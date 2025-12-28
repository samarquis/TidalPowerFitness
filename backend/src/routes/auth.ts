import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation, updateProfileValidation, validate } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', authenticate, logout);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;