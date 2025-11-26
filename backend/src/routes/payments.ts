import express from 'express';
import { SquareClient, SquareEnvironment } from 'square';
import { authenticate } from '../middleware/auth';
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Initialize Square Client
const squareClient = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN || '',
    environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

// POST /api/payments/checkout
// Create a payment link for a package
router.post('/checkout', authenticate, async (req: any, res) => {
    try {
        const { packageId } = req.body;
        const userId = req.user.id;

        if (!packageId) {
            return res.status(400).json({ message: 'Package ID is required' });
        }

        // 1. Fetch package details
        const packageResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
        if (packageResult.rows.length === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }
        const pkg = packageResult.rows[0];

        // 2. Create Checkout Link
        const idempotencyKey = uuidv4();

        const response = await squareClient.checkout.paymentLinks.create({
            idempotencyKey,
            order: {
                locationId: process.env.SQUARE_LOCATION_ID!,
                lineItems: [
                    {
                        name: pkg.name,
                        quantity: '1',
                        basePriceMoney: {
                            amount: BigInt(Math.round(pkg.price * 100)), // Amount in cents
                            currency: 'USD'
                        },
                        note: pkg.description
                    }
                ],
                metadata: {
                    userId: userId.toString(),
                    packageId: packageId.toString(),
                    credits: pkg.credit_amount.toString()
                }
            },
            checkoutOptions: {
                redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/packages?success=true`,
            }
        });

        const paymentLink = response.result.paymentLink;

        if (!paymentLink?.url) {
            throw new Error('Failed to generate payment link URL');
        }

        res.json({ url: paymentLink.url });

    } catch (error: any) {
        console.error('Checkout error:', error);
        res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
    }
});

// POST /api/payments/webhook
// Handle Square webhooks (e.g., payment.updated)
router.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-square-hmac-sha256'];
        const body = JSON.stringify(req.body);

        // Verify signature (skip for now in dev if needed)

        const event = req.body;

        if (event.type === 'payment.updated') {
            const payment = event.data.object.payment;

            if (payment.status === 'COMPLETED') {
                const orderId = payment.order_id;
                if (orderId) {
                    const orderResponse = await squareClient.orders.get(orderId);
                    const order = orderResponse.result.order;

                    if (order?.metadata) {
                        const userId = order.metadata.userId;
                        const credits = parseInt(order.metadata.credits || '0');

                        if (userId && credits > 0) {
                            // Add credits to user
                            await pool.query(
                                `INSERT INTO user_credits (user_id, credit_amount, remaining_amount, purchase_date, expiry_date)
                                 VALUES ($1, $2, $2, NOW(), NOW() + INTERVAL '30 days')`,
                                [userId, credits]
                            );
                            console.log(`Added ${credits} credits to user ${userId}`);
                        }
                    }
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Webhook processing failed');
    }
});

export default router;
