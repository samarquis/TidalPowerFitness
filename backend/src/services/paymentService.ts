import { SquareClient, SquareEnvironment } from 'square';
import { v4 as uuidv4 } from 'uuid';
import CreditService from './creditService';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import encBase64 from 'crypto-js/enc-base64';
import PackageModel from '../models/Package';
import AchievementModel from '../models/Achievement';
import CartModel from '../models/Cart';
import pool from '../config/db';

class PaymentService {
    private provider: string;
    private squareClient: SquareClient | null = null;
    private squareWebhookSecret: string;

    constructor() {
        this.reinitialize(); // Initial call
    }

    public reinitialize() {
        this.provider = process.env.PAYMENT_PROVIDER || 'mock';

        if (this.provider === 'square') {
            const accessToken = process.env.SQUARE_ACCESS_TOKEN;
            const environment = process.env.SQUARE_ENVIRONMENT === 'production'
                ? SquareEnvironment.Production
                : SquareEnvironment.Sandbox;

            if (!accessToken) {
                console.warn('Square access token missing given PAYMENT_PROVIDER=square');
            }

            this.squareClient = new SquareClient({
                token: accessToken || '',
                environment,
            });
        } else {
            this.squareClient = null; // Ensure client is null if not square provider
        }
        this.squareWebhookSecret = process.env.SQUARE_WEBHOOK_SECRET || '';
    }

    // Create a checkout session for a single package
    async createCheckoutSession(userId: string, packageId: string): Promise<{ url: string }> {
        const pkg = await PackageModel.getById(packageId);
        if (!pkg) {
            throw new Error('Package not found');
        }

        if (this.provider === 'mock') {
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return {
                url: `${baseUrl}/checkout/mock?packageId=${packageId}`
            };
        } else if (this.provider === 'square') {
            if (!this.squareClient) {
                throw new Error('Square client not initialized');
            }

            try {
                const locationId = process.env.SQUARE_LOCATION_ID;
                if (!locationId) {
                    throw new Error('SQUARE_LOCATION_ID is required for Square payments');
                }

                const response = await this.squareClient.checkout.paymentLinks.create({
                    idempotencyKey: uuidv4(),
                    order: {
                        locationId,
                        metadata: {
                            userId,
                            packageId,
                            type: 'package_purchase'
                        },
                        lineItems: [
                            {
                                name: pkg.name,
                                quantity: '1',
                                basePriceMoney: {
                                    amount: BigInt(pkg.price_cents),
                                    currency: 'USD'
                                }
                            }
                        ]
                    },
                    checkoutOptions: {
                        redirectUrl: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
                    }
                });

                const result: any = (response as any).result || response;
                const paymentLink = result.paymentLink || result.body?.paymentLink;

                if (paymentLink?.url) {
                    return { url: paymentLink.url };
                } else {
                    console.error('Square Payment Link Response:', JSON.stringify(result, null, 2));
                    throw new Error('Failed to generate Square payment link - URL not found in response');
                }
            } catch (error) {
                console.error('Square checkout error:', error);
                throw new Error('Failed to initialize Square checkout');
            }
        } else {
            throw new Error(`Unknown payment provider: ${this.provider}`);
        }
    }

    // Create a checkout session for the entire cart
    async createCartCheckoutSession(userId: string): Promise<{ url: string }> {
        const cart = await CartModel.getCartWithItems(userId);
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        if (this.provider === 'mock') {
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const cartData = cart.items.map(item => ({
                packageId: item.package_id,
                quantity: item.quantity
            }));
            const cartParam = Buffer.from(JSON.stringify(cartData)).toString('base64');
            return {
                url: `${baseUrl}/checkout/mock?cart=${encodeURIComponent(cartParam)}`
            };
        } else if (this.provider === 'square') {
            if (!this.squareClient) {
                throw new Error('Square client not initialized');
            }

            try {
                const locationId = process.env.SQUARE_LOCATION_ID;
                if (!locationId) {
                    throw new Error('SQUARE_LOCATION_ID is required for Square payments');
                }

                const lineItems = cart.items.map(item => ({
                    name: item.package_name || 'Fitness Package',
                    quantity: item.quantity.toString(),
                    basePriceMoney: {
                        amount: BigInt(item.package_price_cents || 0),
                        currency: 'USD'
                    },
                    metadata: {
                        packageId: item.package_id
                    }
                }));

                const response = await this.squareClient.checkout.paymentLinks.create({
                    idempotencyKey: uuidv4(),
                    order: {
                        locationId,
                        metadata: {
                            userId,
                            cartId: cart.id,
                            type: 'cart_purchase'
                        },
                        lineItems
                    },
                    checkoutOptions: {
                        redirectUrl: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
                    }
                });

                const result: any = (response as any).result || response;
                const paymentLink = result.paymentLink || result.body?.paymentLink;

                if (paymentLink?.url) {
                    return { url: paymentLink.url };
                } else {
                    console.error('Square Cart Checkout Response:', JSON.stringify(result, null, 2));
                    throw new Error('Failed to generate Square payment link for cart');
                }
            } catch (error) {
                console.error('Square cart checkout error:', error);
                throw new Error('Failed to initialize Square cart checkout');
            }
        } else {
            throw new Error(`Unknown payment provider: ${this.provider}`);
        }
    }

    // Process a mock payment confirmation
    async processMockPayment(userId: string, packageId: string): Promise<any> {
        if (this.provider !== 'mock') {
            throw new Error('Mock payments are not enabled');
        }

        // Get package details to know credit amount for achievement
        const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
        const pkg = pkgResult.rows[0];

        // Assign credits
        const credits = await CreditService.assignCreditsForPackage(userId, packageId);

        // Check for achievement
        if (pkg) {
            try {
                await AchievementModel.checkAndAward(userId, 'purchased_credits', pkg.credit_count);
            } catch (e) {
                console.error('Failed to check achievements', e);
            }
        }

        return {
            success: true,
            message: 'Mock payment successful',
            credits
        };
    }

    // Process a mock cart payment confirmation
    async processMockCartPayment(userId: string, items: { packageId: string, quantity: number }[]): Promise<any> {
        if (this.provider !== 'mock') {
            throw new Error('Mock payments are not enabled');
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let totalCredits = 0;
            const results = [];
            let totalCreditsPurchased = 0;

            for (const item of items) {
                // Get package details for achievement calculation
                const pkgResult = await client.query('SELECT * FROM packages WHERE id = $1', [item.packageId]);
                if (pkgResult.rows.length > 0) {
                    const pkg = pkgResult.rows[0];
                    totalCreditsPurchased += pkg.credit_count * item.quantity;
                }

                for (let i = 0; i < item.quantity; i++) {
                    const credits = await CreditService.assignCreditsForPackage(userId, item.packageId);
                    totalCredits += credits.credits_added || 0;
                    results.push({ packageId: item.packageId, credits });
                }
            }

            // Check for achievement
            if (totalCreditsPurchased > 0) {
                await AchievementModel.checkAndAward(userId, 'purchased_credits', totalCreditsPurchased);
            }

            // Clear cart
            await CartModel.clearCart(userId);

            await client.query('COMMIT');

            return {
                success: true,
                message: 'Mock cart payment successful',
                total_credits_added: totalCredits,
                items: results
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    private _isSquareSignatureValid(body: string, signature: string, url: string): boolean {
        if (!this.squareWebhookSecret) {
            console.warn('Square webhook secret not configured. Skipping signature verification.');
            return true; 
        }

        const hmac = HmacSHA256(url + body, this.squareWebhookSecret);
        const digest = encBase64.stringify(hmac);
        return digest === signature;
    }

    // Handle Square Webhook
    async handleSquareWebhook(body: any, signature: string, url: string): Promise<void> {
        if (!this._isSquareSignatureValid(JSON.stringify(body), signature, url)) {
            console.warn('Square webhook signature verification failed.');
            throw new Error('Invalid Square webhook signature');
        }

        const eventType = body.type;
        if (eventType === 'payment.updated') {
            const payment = body.data.object.payment;
            if (payment.status === 'COMPLETED') {
                const orderId = payment.order_id;
                if (!orderId) {
                    console.error('Square webhook: Missing order_id in payment.updated event');
                    return;
                }

                if (!this.squareClient) return;

                try {
                    // Fetch the order to get metadata and line items
                    const orderResponse = await this.squareClient.orders.retrieveOrder({ orderId });
                    const order: any = (orderResponse as any).result?.order || (orderResponse as any).order;

                    if (!order) {
                        console.error(`Square webhook: Could not retrieve order ${orderId}`);
                        return;
                    }

                    const metadata = order.metadata || {};
                    const userId = metadata.userId;
                    const type = metadata.type;

                    if (!userId) {
                        console.error(`Square webhook: Missing userId in order ${orderId} metadata`);
                        return;
                    }

                    if (type === 'package_purchase') {
                        const packageId = metadata.packageId;
                        if (packageId) {
                            const pkg = await PackageModel.getById(packageId);
                            if (pkg) {
                                await CreditService.assignCreditsForPackage(userId, packageId);
                                await AchievementModel.checkAndAward(userId, 'purchased_credits', pkg.credit_count);
                            }
                        }
                    } else if (type === 'cart_purchase') {
                        // For cart purchase, we process all line items from the Square Order
                        const lineItems = order.lineItems || [];
                        let totalCreditsPurchased = 0;
                        
                        for (const li of lineItems) {
                            const packageId = li.metadata?.packageId;
                            if (packageId) {
                                const quantity = parseInt(li.quantity);
                                const pkg = await PackageModel.getById(packageId);
                                if (pkg) {
                                    for (let i = 0; i < quantity; i++) {
                                        await CreditService.assignCreditsForPackage(userId, packageId);
                                    }
                                    totalCreditsPurchased += pkg.credit_count * quantity;
                                }
                            }
                        }
                        
                        if (totalCreditsPurchased > 0) {
                            await AchievementModel.checkAndAward(userId, 'purchased_credits', totalCreditsPurchased);
                        }
                        await CartModel.clearCart(userId);
                    }

                    console.log(`Square webhook: Successfully processed ${type} for userId: ${userId}, orderId: ${orderId}`);
                } catch (error) {
                    console.error(`Square webhook: Error processing order ${orderId}:`, error);
                }
            }
        }
    }
}

export default new PaymentService();
