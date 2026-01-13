import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../auth';
import * as jwtUtils from '../../utils/jwt';

jest.mock('../../utils/jwt');
jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            cookies: {},
            get: jest.fn()
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        (nextFunction as jest.Mock).mockClear();
    });

    it('should fail if no token is provided in cookies', async () => {
        await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication required' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should fail if token is provided in Authorization header (Bearer token support removed)', async () => {
        mockRequest.headers = {
            authorization: 'Bearer valid-token'
        };

        await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication required' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should succeed if valid token is provided in cookies', async () => {
        const decodedToken = { id: 'user-id', email: 'test@example.com', roles: ['trainer'] };
        mockRequest.cookies = { token: 'valid-token' };
        (jwtUtils.verifyToken as jest.Mock).mockReturnValue(decodedToken);

        await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.user).toEqual(decodedToken);
    });

    it('should fail if token in cookies is invalid', async () => {
        mockRequest.cookies = { token: 'invalid-token' };
        (jwtUtils.verifyToken as jest.Mock).mockReturnValue(null);

        await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired session' });
        expect(nextFunction).not.toHaveBeenCalled();
    });
});
