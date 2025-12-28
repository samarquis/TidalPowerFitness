import express from 'express';
import { authenticate } from '../middleware/auth';
import paymentService from '../services/paymentService';
import { checkoutValidation, validate } from '../middleware/validation';

const router = express.Router();

// POST /api/payments/checkout (single package)
router.post('/checkout', authenticate, checkoutValidation, validate, async (req: any, res) => {
    try {
        const { packageId } = req.body;
        if (!packageId) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const session = await paymentService.createCheckoutSession(req.user.id, packageId);
        res.json(session);
    } catch (error: any) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
});

// POST /api/payments/checkout-cart (entire cart)
router.post('/checkout-cart', authenticate, async (req: any, res) => {
    try {
        const session = await paymentService.createCartCheckoutSession(req.user.id);
        res.json(session);
    } catch (error: any) {
        console.error('Cart checkout error:', error);
        res.status(500).json({ error: error.message || 'Failed to create cart checkout session' });
    }
});

// POST /api/payments/confirm-mock (Dev only)
router.post('/confirm-mock', authenticate, async (req: any, res) => {
    try {
        const { packageId, items } = req.body;

        if (items && Array.isArray(items)) {
            const result = await paymentService.processMockCartPayment(req.user.id, items);
            return res.json(result);
        }

        if (!packageId) {
            return res.status(400).json({ error: 'Package ID or items array is required' });
        }

        const result = await paymentService.processMockPayment(req.user.id, packageId);
        res.json(result);
    } catch (error: any) {
        console.error('Mock payment error:', error);
        res.status(500).json({ error: error.message || 'Failed to process mock payment' });
    }
});

// POST /api/payments/webhook
router.post('/webhook', async (req: any, res) => {
    try {
        const signature = req.headers['x-square-hmacsha256-signature'] as string;
        const body = req.rawBody || JSON.stringify(req.body);
        
        // Use BACKEND_URL from env or construct it
        const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const webhookUrl = `${backendUrl}/api/payments/webhook`;

        await paymentService.handleSquareWebhook(req.body, signature, webhookUrl);
        res.status(200).send('OK');
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        // Always return 200 to Square to avoid retries if it's a signature mismatch 
        // that we might want to debug, but for now let's follow standard webhook practice
        res.status(400).send(error.message);
    }
});

export default router;
