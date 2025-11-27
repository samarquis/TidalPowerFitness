import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// TODO: Square payment integration temporarily disabled due to SDK API complexity
// Need to investigate correct Square SDK v13+ API structure

// POST /api/payments/checkout
router.post('/checkout', authenticate, async (req: any, res) => {
    res.status(501).json({
        message: 'Square payment integration is temporarily unavailable. Please contact support.'
    });
});

// POST /api/payments/webhook
router.post('/webhook', async (req, res) => {
    res.status(200).send('OK');
});

export default router;
