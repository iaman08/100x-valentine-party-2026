
import rateLimit from "express-rate-limit";

// Strict limiter for sensitive actions like registration and OTP
// 5 requests per hour per IP
export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        error: "Too many requests from this IP, please try again after an hour",
    },
});

// Moderate limiter for general API calls
// 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        error: "Too many requests, please try again later",
    },
});

// Polling limiter for status checks
// 30 requests per minute (allows 2s polling interval comfortably)
export const pollingLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        error: "Too many status checks",
    },
});
