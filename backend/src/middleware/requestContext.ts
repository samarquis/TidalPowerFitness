import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestContext = (req: any, res: Response, next: NextFunction) => {
    req.id = uuidv4();
    res.setHeader("X-Request-ID", req.id);
    next();
};
