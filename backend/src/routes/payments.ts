import express from 'express';
import { authenticate } from '../middleware/auth';
import paymentService from '../services/paymentService';
import Cart from '../models/Cart';

const router = express.Router();

// POST /api/payments/checkout (single package)
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

// POST /api/payments/checkout-cart (entire cart)
router.post('/checkout-cart', authenticate, async (req: any, res) => {
    try {
        const cart = await Cart.getCartWithItems(req.user.id);

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // For mock payments, redirect to mock checkout with cart info
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Create a query string with all package IDs and quantities
        const cartData = cart.items.map(item => ({
            packageId: item.package_id,
            quantity: item.quantity
        }));

        // Encode cart data as base64 for the URL
        const cartParam = Buffer.from(JSON.stringify(cartData)).toString('base64');

        res.json({
            url: `${baseUrl}/checkout/mock?cart=${encodeURIComponent(cartParam)}`
        });
    } catch (error: any) {
        console.error('Cart checkout error:', error);
        res.status(500).json({ error: error.message || 'Failed to create cart checkout session' });
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
