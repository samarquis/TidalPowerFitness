import { body, param, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg
            }))
        });
        return;
    }
    next();
};

// Auth validation
export const validateRegister: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('first_name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('First name is required and must be less than 100 characters')
        .matches(/^[a-zA-Z\s-]+$/)
        .withMessage('First name can only contain letters, spaces, and hyphens'),
    body('last_name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Last name is required and must be less than 100 characters')
        .matches(/^[a-zA-Z\s-]+$/)
        .withMessage('Last name can only contain letters, spaces, and hyphens'),
    body('phone')
        .optional()
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Invalid phone number format'),
    body('role')
        .optional()
        .isIn(['client', 'trainer', 'admin'])
        .withMessage('Invalid role')
];

export const validateLogin: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Cart validation
export const validateAddToCart: ValidationChain[] = [
    body('package_id')
        .isUUID()
        .withMessage('Invalid package ID format'),
    body('quantity')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Quantity must be between 1 and 100')
];

export const validateUpdateCartItem: ValidationChain[] = [
    param('id')
        .notEmpty()
        .withMessage('Cart item ID is required'),
    body('quantity')
        .isInt({ min: 1, max: 100 })
        .withMessage('Quantity must be between 1 and 100')
];

export const validateRemoveFromCart: ValidationChain[] = [
    param('id')
        .notEmpty()
        .withMessage('Cart item ID is required')
];

// Booking validation
export const validateCreateBooking: ValidationChain[] = [
    body('class_id')
        .isUUID()
        .withMessage('Invalid class ID format')
];

export const validateCancelBooking: ValidationChain[] = [
    param('id')
        .isUUID()
        .withMessage('Invalid booking ID format')
];

// Package validation
export const validateCreatePackage: ValidationChain[] = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Package name is required and must be less than 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('credits')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Credits must be between 1 and 1000'),
    body('price')
        .isFloat({ min: 0, max: 100000 })
        .withMessage('Price must be a positive number and less than 100000'),
    body('duration_days')
        .optional()
        .isInt({ min: 1, max: 3650 })
        .withMessage('Duration must be between 1 and 3650 days')
];

export const validateUpdatePackage: ValidationChain[] = [
    param('id')
        .isUUID()
        .withMessage('Invalid package ID format'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Package name must be less than 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('credits')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Credits must be between 1 and 1000'),
    body('price')
        .optional()
        .isFloat({ min: 0, max: 100000 })
        .withMessage('Price must be a positive number and less than 100000'),
    body('duration_days')
        .optional()
        .isInt({ min: 1, max: 3650 })
        .withMessage('Duration must be between 1 and 3650 days')
];

// Class validation
export const validateCreateClass: ValidationChain[] = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Class name is required and must be less than 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('trainer_id')
        .isUUID()
        .withMessage('Invalid trainer ID format'),
    body('start_time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),
    body('end_time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),
    body('max_participants')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Max participants must be between 1 and 1000'),
    body('days_of_week')
        .optional()
        .isArray()
        .withMessage('Days of week must be an array')
];

// User update validation
export const validateUpdateProfile: ValidationChain[] = [
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('First name must be less than 100 characters')
        .matches(/^[a-zA-Z\s-]+$/)
        .withMessage('First name can only contain letters, spaces, and hyphens'),
    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Last name must be less than 100 characters')
        .matches(/^[a-zA-Z\s-]+$/)
        .withMessage('Last name can only contain letters, spaces, and hyphens'),
    body('phone')
        .optional()
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Invalid phone number format')
];

// Exercise validation
export const validateCreateExercise: ValidationChain[] = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Exercise name is required and must be less than 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must be less than 2000 characters'),
    body('difficulty_level')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
    body('video_url')
        .optional()
        .isURL()
        .withMessage('Video URL must be a valid URL')
];
