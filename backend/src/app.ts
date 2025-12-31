import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';

// Load env vars
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import trainerRoutes from './routes/trainers';
import appointmentRoutes from './routes/appointments';
import paymentRoutes from './routes/payments';
import classRoutes from './routes/classes';
import setupRoutes from './routes/setup';
import exerciseRoutes from './routes/exercises';
import workoutTemplateRoutes from './routes/workoutTemplates';
import workoutSessionRoutes from './routes/workoutSessions';
import availabilityRoutes from './routes/availability';
import workoutAssignmentRoutes from './routes/workoutAssignments';
import packageRoutes from './routes/packages';
import importRoutes from './routes/import';
import bookingRoutes from './routes/bookings';
import migrationRoutes from './routes/migrations';
import cartRoutes from './routes/cart';
import demoUserRoutes from './routes/demoUsers';
import achievementRoutes from './routes/achievements';
import notificationRoutes from './routes/notifications';
import progressRoutes from './routes/progress';
import leaderboardRoutes from './routes/leaderboard';
import changelogRoutes from './routes/changelog';
import adminRoutes from './routes/admin';
import programRoutes from './routes/programs';
import challengeRoutes from './routes/challenges';

const app = express();

// Middleware
import { apiLimiter, authLimiter } from './middleware/rateLimit';
import { csrfCheck } from './middleware/csrf';

// Apply global rate limiter to all API routes
app.use('/api', apiLimiter);

// Apply CSRF protection to all state-changing API routes
app.use('/api', csrfCheck);

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://tidal-power-frontend.onrender.com',
    'https://tidal-power-frontend-app.onrender.com',
    process.env.FRONTEND_URL
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Check if the origin matches the Vercel regex
        const vercelRegex = /https?:\/\/[a-zA-Z0-9-]+\.vercel\.app/;
        if (vercelRegex.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-TPF-Request']
};

app.set('trust proxy', 1); // Trust first proxy
app.use(cors(corsOptions));
app.use(cookieParser());

// Request logging middleware
app.use((req: any, res: any, next: any) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

app.use(express.json({
    verify: (req: any, res: any, buf: Buffer) => {
        req.rawBody = buf.toString();
    }
}));
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
app.use('/api/auth', authLimiter, authRoutes);

// User management routes
app.use('/api/users', userRoutes);

// Trainer routes
app.use('/api/trainers', trainerRoutes);

// Appointment routes (Acuity integration)
app.use('/api/appointments', appointmentRoutes);

// Payment routes (Square integration)
app.use('/api/payments', paymentRoutes);

// Classes routes
app.use('/api/classes', classRoutes);

// Workout tracking routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workout-templates', workoutTemplateRoutes);
app.use('/api/workout-sessions', workoutSessionRoutes);

// Trainer availability routes
app.use('/api/availability', availabilityRoutes);

// Workout assignment routes
app.use('/api/assignments', workoutAssignmentRoutes);

// Package routes
app.use('/api/packages', packageRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Program routes
app.use('/api/programs', programRoutes);

// Challenge routes
app.use('/api/challenges', challengeRoutes);

// Import routes (admin only)
app.use('/api/import', importRoutes);

// Migration routes (admin only)
app.use('/api/admin/migrate', migrationRoutes);

// Demo user routes (admin only)
app.use('/api/demo-users', demoUserRoutes);

// Setup routes (one-time admin creation)
app.use('/api/setup', setupRoutes);

// Achievement routes
app.use('/api/achievements', achievementRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Progress routes
app.use('/api/progress', progressRoutes);

// Leaderboard routes
app.use('/api/leaderboard', leaderboardRoutes);

// Changelog routes
app.use('/api/changelog', changelogRoutes);

export default app;