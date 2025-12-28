import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Generic middleware to handle validation results
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors: any[] = [];
    errors.array().map(err => extractedErrors.push({ [ (err as any).path || 'param' ]: err.msg }));

    res.status(400).json({
        errors: extractedErrors,
    });
};

// Auth Validations
export const registerValidation = [
    body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain a special character'),
    body('first_name').notEmpty().withMessage('First name is required').trim().escape(),
    body('last_name').notEmpty().withMessage('Last name is required').trim().escape(),
    body('phone').optional().trim(),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// User Validations
export const updateProfileValidation = [
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty').trim().escape(),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty').trim().escape(),
    body('phone').optional().trim(),
];

// Payment Validations
export const checkoutValidation = [
    body('packageId').isUUID().withMessage('Invalid package ID'),
];

// Class Validations
export const createClassValidation = [
    body('name').notEmpty().withMessage('Class name is required').trim().escape(),
    body('category').notEmpty().withMessage('Category is required').trim().escape(),
    body('instructor_name').notEmpty().withMessage('Instructor name is required').trim().escape(),
    body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
    body('duration_minutes').isInt({ min: 1, max: 480 }).withMessage('Duration must be between 1 and 480 minutes'),
    body('max_capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('price_cents').optional().isInt({ min: 0 }).withMessage('Price must be a non-negative integer'),
    body('days_of_week').isArray().withMessage('Days of week must be an array of numbers 0-6'),
    body('days_of_week.*').isInt({ min: 0, max: 6 }).withMessage('Day must be between 0 and 6'),
];

// Booking Validations
export const createBookingValidation = [
    body('class_id').isUUID().withMessage('Invalid class ID'),
    body('target_date').optional().isDate().withMessage('Invalid date format (YYYY-MM-DD)'),
    body('attendee_count').optional().isInt({ min: 1, max: 10 }).withMessage('Attendee count must be between 1 and 10'),
];

// Cart Validations
export const addToCartValidation = [
    body('package_id').isUUID().withMessage('Invalid package ID'),
    body('quantity').optional().isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
];

export const updateCartItemValidation = [
    body('quantity').isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
];

// Workout Template Validations
export const createTemplateValidation = [
    body('name').notEmpty().withMessage('Template name is required').trim().escape(),
    body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required'),
    body('exercises.*.exercise_id').isUUID().withMessage('Invalid exercise ID'),
    body('exercises.*.order_in_template').isInt({ min: 1 }).withMessage('Invalid exercise order'),
];