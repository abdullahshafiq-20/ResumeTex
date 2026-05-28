/**
 * Server-Side Rate Limiter Middleware
 * Tracks API calls by IP address
 * Limits to 2 calls per 24 hours per IP
 */

// In-memory store: { ip: [{ timestamp: ms, endpoint: string }, ...] }
const callHistory = new Map();

const MAX_CALLS_PER_DAY = 2;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Cleanup old entries every hour

/**
 * Get client IP address (handles proxies)
 */
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket?.remoteAddress ||
    'unknown'
  );
};

/**
 * Clean up old timestamps from memory
 */
const cleanupOldEntries = () => {
  const now = Date.now();
  for (const [ip, calls] of callHistory.entries()) {
    const recentCalls = calls.filter(call => now - call.timestamp < MILLISECONDS_PER_DAY);
    if (recentCalls.length === 0) {
      callHistory.delete(ip);
    } else {
      callHistory.set(ip, recentCalls);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupOldEntries, CLEANUP_INTERVAL);

/**
 * Get rate limit status for an IP
 */
const getRateLimitStatus = (ip) => {
  const now = Date.now();
  const calls = callHistory.get(ip) || [];
  
  // Filter to only calls from today
  const todayCalls = calls.filter(call => now - call.timestamp < MILLISECONDS_PER_DAY);
  
  // Update the map with filtered calls
  if (todayCalls.length === 0) {
    callHistory.delete(ip);
  } else {
    callHistory.set(ip, todayCalls);
  }
  
  return {
    callsUsed: todayCalls.length,
    maxCalls: MAX_CALLS_PER_DAY,
    canMakeCall: todayCalls.length < MAX_CALLS_PER_DAY,
    remainingCalls: Math.max(0, MAX_CALLS_PER_DAY - todayCalls.length),
    resetTime: new Date(Date.now() + MILLISECONDS_PER_DAY).toISOString(),
  };
};

/**
 * Record an API call for an IP
 */
const recordCall = (ip, endpoint = 'api') => {
  const calls = callHistory.get(ip) || [];
  calls.push({
    timestamp: Date.now(),
    endpoint: endpoint,
  });
  callHistory.set(ip, calls);
};

/**
 * Rate Limiter Middleware Factory
 * Specify which endpoints to rate limit
 */
const rateLimiterMiddleware = (endpoint = 'api') => {
  return (req, res, next) => {
    const clientIp = getClientIp(req);
    const status = getRateLimitStatus(clientIp);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', status.maxCalls);
    res.setHeader('X-RateLimit-Used', status.callsUsed);
    res.setHeader('X-RateLimit-Remaining', status.remainingCalls);
    res.setHeader('X-RateLimit-Reset', status.resetTime);

    // Check if limit exceeded
    if (!status.canMakeCall) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Maximum ${status.maxCalls} conversions per day allowed.`,
        retryAfter: status.resetTime,
        remainingCalls: status.remainingCalls,
        callsUsed: status.callsUsed,
      });
    }

    // Attach rate limit status to request object for later use
    req.rateLimit = {
      status,
      clientIp,
      recordCall: () => recordCall(clientIp, endpoint),
    };

    next();
  };
};

/**
 * Middleware to record successful API call
 */
const recordSuccessfulCall = (req, res, next) => {
  if (req.rateLimit) {
    req.rateLimit.recordCall();
  }
  next();
};

export {
  rateLimiterMiddleware,
  recordSuccessfulCall,
  getRateLimitStatus,
  getClientIp,
  cleanupOldEntries,
};
