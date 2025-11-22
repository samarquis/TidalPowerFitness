import express, { Request, Response } from 'express';
import { squareClient } from '../services/square';
import { authenticate } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = express.Router();

// Create payment (authenticated)
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { sourceId, amount, currency = 'USD', note, referenceId } = req.body;

        if (!sourceId || !amount) {
            res.status(400).json({ error: 'Source ID and amount are required' });
            return;
        }

        const payment = await squareClient.createPayment({
            sourceId,
            amountMoney: {
                amount: Math.round(amount * 100), // Convert to cents
                currency,
            },
            idempotencyKey: randomUUID(),
            customerId: req.user?.userId,
            note,
            referenceId,
        });

        res.status(201).json({
            message: 'Payment processed successfully',
            payment: payment.payment,
        });
    } catch (error: any) {
        console.error('Payment error:', error);
        res.status(500).json({ error: error.message || 'Payment failed' });
    }
});

// Get payment by ID (authenticated)
router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const payment = await squareClient.getPayment(id);

        res.status(200).json({ payment: payment.payment });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ error: 'Failed to get payment' });
    }
});

// Refund payment (authenticated, admin only recommended)
router.post('/:id/refund', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { amount, currency = 'USD', reason } = req.body;

        const refund = await squareClient.refundPayment({
            paymentId: id,
            amountMoney: {
                amount: Math.round(amount * 100),
                currency,
            },
            idempotencyKey: randomUUID(),
            reason,
        });

        res.status(200).json({
            message: 'Refund processed successfully',
            refund: refund.refund,
        });
    } catch (error: any) {
        console.error('Refund error:', error);
        res.status(500).json({ error: error.message || 'Refund failed' });
    }
});

// List payments (authenticated)
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const { beginTime, endTime, limit } = req.query;

        const result = await squareClient.listPayments({
            beginTime: beginTime as string,
            endTime: endTime as string,
            limit: limit ? Number(limit) : undefined,
            sortOrder: 'DESC',
        });

        res.status(200).json({ payments: result.payments || [] });
    } catch (error) {
        console.error('List payments error:', error);
        res.status(500).json({ error: 'Failed to list payments' });
    }
});

export default router;
