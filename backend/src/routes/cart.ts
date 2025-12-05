import express from 'express';
import cartController from '../controllers/cartController';
import { authenticate } from '../middleware/auth';
import { validateAddToCart, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, validateAddToCart, handleValidationErrors, cartController.addItem);
// Temporarily removed validation to debug 400 errors
router.put('/items/:id', authenticate, cartController.updateItem);
router.delete('/items/:id', authenticate, cartController.removeItem);
router.delete('/', authenticate, cartController.clearCart);

export default router;
