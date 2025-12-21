import { SquareClient, SquareEnvironment } from 'square';
import { v4 as uuidv4 } from 'uuid';
import CreditService from './creditService';
import PackageModel from '../models/Package';
import AchievementModel from '../models/Achievement';
import pool from '../config/db';

class PaymentService {
    private provider: string;
    private squareClient: SquareClient | null = null;

    constructor() {
        this.provider = process.env.PAYMENT_PROVIDER || 'mock';

        if (this.provider === 'square') {
            const accessToken = process.env.SQUARE_ACCESS_TOKEN;
            const environment = process.env.NODE_ENV === 'production'
                ? SquareEnvironment.Production
                : SquareEnvironment.Sandbox;

            if (!accessToken) {
                console.warn('Square access token missing given PAYMENT_PROVIDER=square');
            }

            this.squareClient = new SquareClient({
                token: accessToken || '',
                environment,
            });
        }
    }

    // Create a checkout session (or mock URL)
    async createCheckoutSession(userId: string, packageId: string): Promise<{ url: string }> {
        const pkg = await PackageModel.getById(packageId);
        if (!pkg) {
            throw new Error('Package not found');
        }

        if (this.provider === 'mock') {
            // Return a URL to the frontend mock checkout page
            // We include packageId and userId in the query params for the mock page to use
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

                // Create a payment link using SquareClient (checkout.paymentLinks)
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
                                    amount: BigInt(Math.round(pkg.price * 100)), // Convert to cents
                                    currency: 'USD'
                                }
                            }
                        ]
                    },
                    checkoutOptions: {
                        redirectUrl: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
                    }
                });

                // Check response structure - use casting if type definitions are incomplete in this version
                const result: any = response.result || response;

                if (result.paymentLink?.url) {
                    return { url: result.paymentLink.url };
                } else if (result.body?.paymentLink?.url) {
                    return { url: result.body.paymentLink.url };
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
                await AchievementModel.checkAndAward(userId, 'purchased_credits', pkg.credits);
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

        let totalCredits = 0;
        const results = [];
        let totalCreditsPurchased = 0;

        for (const item of items) {
            // Get package details for achievement calculation
            const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [item.packageId]);
            if (pkgResult.rows.length > 0) {
                const pkg = pkgResult.rows[0];
                totalCreditsPurchased += pkg.credits * item.quantity;
            }

            for (let i = 0; i < item.quantity; i++) {
                const credits = await CreditService.assignCreditsForPackage(userId, item.packageId);
                totalCredits += credits.credits_added || 0;
                results.push({ packageId: item.packageId, credits });
            }
        }

        // Check for achievement
        try {
            if (totalCreditsPurchased > 0) {
                await AchievementModel.checkAndAward(userId, 'purchased_credits', totalCreditsPurchased);
            }
        } catch (e) {
            console.error('Failed to check achievements', e);
        }

        return {
            success: true,
            message: 'Mock cart payment successful',
            total_credits_added: totalCredits,
            items: results
        };
    }

    // Handle Square Webhook
    async handleSquareWebhook(body: any, signature: string): Promise<void> {
        // Security: In a real app, verify 'x-square-hmac-sha256' signature 
        // using process.env.SQUARE_WEBHOOK_SIGNATURE_KEY

        const eventType = body.type;
        if (eventType === 'payment.updated') {
            const payment = body.data.object.payment;
            if (payment.status === 'COMPLETED') {
                // The order ID or metadata should link back to user/package
                // Note: Square Payment objects might not carry the original order metadata directly 
                // without looking up the order. 

                // For this implementation, we rely on the implementation simplicity.
                // In production, we would use the Order ID to fetch metadata.
            }
        }
    }
}

export default new PaymentService();
