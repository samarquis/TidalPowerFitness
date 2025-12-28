import { Request, Response, NextFunction } from 'express';

/**
 * Simple CSRF protection middleware that checks for a custom header.
 * Since browser-based CSRF attacks cannot set custom headers, this 
 * effectively blocks them for AJAX requests.
 */
export const csrfCheck = (req: Request, res: Response, next: NextFunction): void => {
    // Skip GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const csrfHeader = req.get('X-TPF-Request');

    if (!csrfHeader || csrfHeader !== 'true') {
        res.status(403).json({
            error: 'CSRF protection violation. Missing required security header.'
        });
        return;
    }

    next();
};
