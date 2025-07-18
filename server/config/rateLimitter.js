import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const coinRequestLimiter = rateLimit({
    keyGenerator: ipKeyGenerator,
    windowMs: 60 * 60 * 24 * 1000, // 1 day
    max: 1, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res, next, options) => {
        // Access rate limit info from request object
        const rateLimitInfo = req.rateLimit;

        res.status(429).json({
            message: "You can only make 1 request per day, please try again after 24 hours",
            IP: req.ip,
            limit: rateLimitInfo?.limit || options.max || 5,
            remaining: rateLimitInfo?.remaining || 0,
            resetTime: rateLimitInfo?.resetTime ? new Date(rateLimitInfo.resetTime).toISOString() : new Date(Date.now() + options.windowMs).toISOString(),
        });
    },
});

