import express from 'express';
import cartController from '../controllers/cartController';
import { authenticate } from '../middleware/auth';
import { addToCartValidation, updateCartItemValidation, validate } from '../middleware/validation';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, addToCartValidation, validate, cartController.addItem);
router.put('/items/:id', authenticate, updateCartItemValidation, validate, cartController.updateItem);
router.delete('/items/:id', authenticate, cartController.removeItem);
router.delete('/', authenticate, cartController.clearCart);

export default router;