import express from 'express';
import { authenticate } from '../middleware/auth';
import paymentService from '../services/paymentService';

const router = express.Router();

// POST /api/payments/checkout
router.post('/checkout', authenticate, async (req: any, res) => {
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

// POST /api/payments/confirm-mock (Dev only)
router.post('/confirm-mock', authenticate, async (req: any, res) => {
    try {
        const { packageId } = req.body;
        if (!packageId) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const result = await paymentService.processMockPayment(req.user.id, packageId);
        res.json(result);
    } catch (error: any) {
        console.error('Mock payment error:', error);
        res.status(500).json({ error: error.message || 'Failed to process mock payment' });
    }
});

// POST /api/payments/webhook
router.post('/webhook', async (req, res) => {
    // TODO: Implement webhook signature verification for Square
    res.status(200).send('OK');
});

export default router;
