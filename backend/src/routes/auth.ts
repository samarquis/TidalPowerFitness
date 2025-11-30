import express from 'express';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegister, validateLogin, validateUpdateProfile, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateUpdateProfile, handleValidationErrors, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
