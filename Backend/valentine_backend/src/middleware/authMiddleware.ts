import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface JwtPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // Check for token in cookies or Authorization header
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token." });
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== "ADMIN") {
        res.status(403).json({ error: "Access denied. Admins only." });
        return;
    }
    next();
};
