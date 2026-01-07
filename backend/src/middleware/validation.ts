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



// Program Validations



export const createProgramValidation = [



    body('name').notEmpty().withMessage('Program name is required').trim().escape(),



    body('total_weeks').optional().isInt({ min: 1, max: 52 }).withMessage('Duration must be between 1 and 52 weeks'),



    body('templates').isArray({ min: 1 }).withMessage('At least one workout template is required'),



    body('templates.*.template_id').isUUID().withMessage('Invalid template ID'),



    body('templates.*.week_number').isInt({ min: 1 }).withMessage('Invalid week number'),



    body('templates.*.day_number').isInt({ min: 1, max: 7 }).withMessage('Day number must be between 1 and 7'),



];







export const assignProgramValidation = [



    body('client_id').isUUID().withMessage('Invalid client ID'),



    body('program_id').isUUID().withMessage('Invalid program ID'),



    body('start_date').optional().isDate().withMessage('Invalid date format (YYYY-MM-DD)'),



];







// Exercise Validations



export const createExerciseValidation = [



    body('name').notEmpty().withMessage('Exercise name is required').trim().escape(),



    body('workout_type_id').optional().isUUID().withMessage('Invalid workout type ID'),



    body('primary_muscle_group').optional().isUUID().withMessage('Invalid primary muscle group ID'),



    body('secondary_muscle_group_ids').optional().isArray().withMessage('Secondary muscle groups must be an array'),



    body('secondary_muscle_group_ids.*').isUUID().withMessage('Invalid muscle group ID'),



    body('video_url').optional().isURL().withMessage('Invalid video URL'),



    body('image_url').optional().isURL().withMessage('Invalid image URL'),



];





// Workout Session Validations
export const createSessionValidation = [
    body('session_date').isDate().withMessage('Valid session date is required (YYYY-MM-DD)'),
    body('trainer_id').isUUID().withMessage('Invalid trainer ID'),
    body('workout_type_id').optional().isUUID().withMessage('Invalid workout type ID'),
    body('class_id').optional().isUUID().withMessage('Invalid class ID'),
    body('participant_ids').optional().isArray().withMessage('Participant IDs must be an array'),
    body('exercises').optional().isArray().withMessage('Exercises must be an array'),
    body('exercises.*.exercise_id').isUUID().withMessage('Invalid exercise ID in session'),
];

export const bulkLogValidation = [
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array of logs'),
    body('*.session_exercise_id').isUUID().withMessage('Invalid session exercise ID'),
    body('*.client_id').isUUID().withMessage('Invalid client ID'),
    body('*.set_number').isInt({ min: 1 }).withMessage('Set number must be at least 1'),
    body('*.reps_completed').isInt({ min: 0 }).withMessage('Reps must be a non-negative integer'),
    body('*.weight_used_lbs').isFloat({ min: 0 }).withMessage('Weight must be a non-negative number'),
    body('*.rpe').optional({ checkFalsy: true }).isInt({ min: 1, max: 10 }).withMessage('RPE must be between 1 and 10'),
];
