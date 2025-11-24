const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const trainerRoutes = require('./routes/trainers');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const classRoutes = require('./routes/classes');
const setupRoutes = require('./routes/setup');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Setup routes (one-time use)
app.use('/api/setup', setupRoutes.default || setupRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
