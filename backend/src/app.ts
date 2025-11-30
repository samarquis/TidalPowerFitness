const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const trainerRoutes = require('./routes/trainers');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const classRoutes = require('./routes/classes');
const setupRoutes = require('./routes/setup');
const exerciseRoutes = require('./routes/exercises');
const workoutTemplateRoutes = require('./routes/workoutTemplates');
const workoutSessionRoutes = require('./routes/workoutSessions');
const availabilityRoutes = require('./routes/availability');
const workoutAssignmentRoutes = require('./routes/workoutAssignments');
const packageRoutes = require('./routes/packages');
const importRoutes = require('./routes/import');
const bookingRoutes = require('./routes/bookings');
const migrationRoutes = require('./routes/migrations');
const cartRoutes = require('./routes/cart');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: any, res: any) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.get('/api', (req: any, res: any) => {
    res.json({ message: 'Tidal Power Fitness API' });
});

// Authentication routes
app.use('/api/auth', authRoutes.default || authRoutes);

// User management routes
app.use('/api/users', userRoutes.default || userRoutes);

// Trainer routes
app.use('/api/trainers', trainerRoutes.default || trainerRoutes);

// Appointment routes (Acuity integration)
app.use('/api/appointments', appointmentRoutes.default || appointmentRoutes);

// Payment routes (Square integration)
app.use('/api/payments', paymentRoutes.default || paymentRoutes);

// Classes routes
app.use('/api/classes', classRoutes.default || classRoutes);

// Workout tracking routes
app.use('/api/exercises', exerciseRoutes.default || exerciseRoutes);
app.use('/api/workout-templates', workoutTemplateRoutes.default || workoutTemplateRoutes);
app.use('/api/workout-sessions', workoutSessionRoutes.default || workoutSessionRoutes);

// Trainer availability routes
app.use('/api/availability', availabilityRoutes.default || availabilityRoutes);

// Workout assignment routes
app.use('/api/assignments', workoutAssignmentRoutes.default || workoutAssignmentRoutes);

// Package routes
app.use('/api/packages', packageRoutes.default || packageRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes.default || bookingRoutes);

// Cart routes
app.use('/api/cart', cartRoutes.default || cartRoutes);

// Import routes (admin only)
app.use('/api/import', importRoutes.default || importRoutes);

// Migration routes (admin only)
app.use('/api/admin/migrate', migrationRoutes.default || migrationRoutes);

// Setup routes (one-time admin creation)
app.use('/api/setup', setupRoutes.default || setupRoutes);

module.exports = app;
