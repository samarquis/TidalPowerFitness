import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
    id: string;
    userId: string;
    email: string;
    role?: 'client' | 'trainer' | 'admin'; // Keep for backward compatibility
    roles: string[];
}

// Generate JWT token
export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
