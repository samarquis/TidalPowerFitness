import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation, updateProfileValidation, validate } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, and profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, first_name, last_name]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [client, trainer] }
 *     responses:
 *       201: { description: User created successfully }
 *       400: { description: Validation error }
 *       409: { description: Email already exists }
 */
router.post('/register', registerValidation, validate, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get session cookie
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', loginValidation, validate, login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Terminate the current session
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Logged out successfully }
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile and credit balance
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Returns user profile }
 *       401: { description: Not authenticated }
 */
router.get('/profile', authenticate, getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 *       401: { description: Not authenticated }
 */
router.put('/profile', authenticate, updateProfileValidation, validate, updateProfile);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password: { type: string }
 *               new_password: { type: string }
 *     responses:
 *       200: { description: Password changed }
 *       401: { description: Invalid current password }
 */
router.post('/change-password', authenticate, changePassword);

export default router;