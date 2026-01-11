import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

// Authenticate middleware - verifies JWT token via HttpOnly cookies or System Key
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Check for system-level key (for automated scripts)
        const systemKey = req.get('x-system-key');
        if (systemKey && systemKey === process.env.SYSTEM_API_KEY) {
            // Attach a virtual system user linked to the primary admin
            req.user = {
                id: 'ae361afc-230c-4772-9ee0-568b4926e0ee', // Scott's ID
                userId: 'ae361afc-230c-4772-9ee0-568b4926e0ee',
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
