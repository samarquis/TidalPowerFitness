import express from 'express';
import cartController from '../controllers/cartController';
import { authenticate } from '../middleware/auth';
import { validateAddToCart, validateUpdateCartItem, validateRemoveFromCart, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, validateAddToCart, handleValidationErrors, cartController.addItem);
router.put('/items/:id', authenticate, validateUpdateCartItem, handleValidationErrors, cartController.updateItem);
router.delete('/items/:id', authenticate, validateRemoveFromCart, handleValidationErrors, cartController.removeItem);
router.delete('/', authenticate, cartController.clearCart);

export default router;
