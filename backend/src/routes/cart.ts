import express from 'express';
import cartController from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, cartController.addItem);
router.put('/items/:id', authenticate, cartController.updateItem);
router.delete('/items/:id', authenticate, cartController.removeItem);
router.delete('/', authenticate, cartController.clearCart);

export default router;
