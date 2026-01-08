import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate, resetPasswordValidation, addUserRoleValidation } from '../middleware/validation';
import userController from '../controllers/userController';

const router = express.Router();

// Get current user profile
router.get('/self', authenticate, userController.getSelf);

// Spoof user role (super admin only)
router.post('/spoof-role', authenticate, userController.spoofRole);

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);

// Add role to user (admin only)
router.post('/:id/roles', authenticate, authorize('admin'), addUserRoleValidation, validate, userController.addUserRole);

// Remove role from user (admin only)
router.delete('/:id/roles/:role', authenticate, authorize('admin'), userController.removeUserRole);

// Toggle user activation (admin only)
router.patch('/:id/activate', authenticate, authorize('admin'), userController.toggleUserActivation);

// Deactivate user (admin only)
router.delete('/:id', authenticate, authorize('admin'), userController.deactivateUser);

// Reset user password (admin only)
router.post('/:id/reset-password', authenticate, authorize('admin'), resetPasswordValidation, validate, userController.resetUserPassword);

// Impersonate user (admin only)
router.post('/:id/impersonate', authenticate, authorize('admin'), userController.impersonateUser);

// Get user credits
router.get('/:id/credits', authenticate, userController.getUserCredits);

export default router;
