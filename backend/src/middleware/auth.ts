import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { query } from '../config/db';
import logger from '../utils/logger';

// Authenticate middleware - verifies JWT token via HttpOnly cookies or System Key
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Check for system-level key (for automated scripts)
        const systemKey = req.get('x-system-key');
        if (systemKey && systemKey === process.env.SYSTEM_API_KEY) {
            // Find the primary admin dynamically to avoid UUID mismatches
            const adminRes = await query("SELECT id, email FROM users WHERE 'admin' = ANY(roles) LIMIT 1");
            const primaryAdmin = adminRes.rows[0];

            if (!primaryAdmin) {
                logger.error('System bypass failed: No admin user found in database.');
                res.status(500).json({ error: 'System configuration error' });
                return;
            }

            // Attach a virtual system user linked to the primary admin
            req.user = {
                id: primaryAdmin.id,
                userId: primaryAdmin.id,
                email: 'system@tidalpower.local',
                roles: ['admin'],
                is_demo_mode_enabled: false
            };
            return next();
        }

        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({ error: 'Invalid or expired session' });
            return;
        }

        // Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: Array<'client' | 'trainer' | 'admin'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        // Check if user has ANY of the allowed roles
        const hasRole = allowedRoles.some(role => req.user?.roles?.includes(role));

        if (!hasRole) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }

        next();
    };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (token) {
            const decoded = verifyToken(token);
            if (decoded) {
                req.user = decoded;
            }
        }

        next();
    } catch (error) {
        next();
    }
};
