import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Add this to your main app file

export const coinRequestLimiter = rateLimit({
    keyGenerator: ipKeyGenerator, // Use the built-in helper
    windowMs: 60 * 60 * 24 * 1000, // 1 day
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const rateLimitInfo = req.rateLimit;
        res.status(429).json({
            message: "You can only make 1 request per day, please try again after 24 hours",
            IP: req.ip,
            limit: rateLimitInfo?.limit || options.max || 1,
            remaining: rateLimitInfo?.remaining || 0,
            resetTime: rateLimitInfo?.resetTime ? new Date(rateLimitInfo.resetTime).toISOString() : new Date(Date.now() + options.windowMs).toISOString(),
        });
    },
});;