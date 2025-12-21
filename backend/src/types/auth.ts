import { Request } from 'express';
import { JWTPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
    user: JWTPayload;
}
