/**
 * Server-Side Rate Limit Info Extractor
 * Extracts rate limit information from response headers
 * 
 * The server sends these headers with every API response:
 * - X-RateLimit-Limit: Maximum calls per day (e.g., 2)
 * - X-RateLimit-Used: Calls used today
 * - X-RateLimit-Remaining: Calls remaining today
 * - X-RateLimit-Reset: When the limit resets (ISO timestamp)
 */

/**
 * Extract rate limit info from axios response
 * @param {AxiosResponse} response - Response from axios
 * @returns {object} Rate limit information
 */
export const getRateLimitFromHeaders = (response) => {
  if (!response?.headers) return null;

  const limit = response.headers['x-ratelimit-limit'];
  const used = response.headers['x-ratelimit-used'];
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];

  if (!limit) return null; // Rate limit headers not present

  return {
    limit: parseInt(limit),
    used: parseInt(used),
    remaining: parseInt(remaining),
    resetTime: reset ? new Date(reset).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : 'unknown',
    resetTimeFull: reset,
    canMakeCall: parseInt(remaining) > 0,
  };
};

/**
 * Get formatted message about rate limit
 * @param {object} rateLimitInfo - From getRateLimitFromHeaders
 * @returns {string} Formatted message
 */
export const formatRateLimitMessage = (rateLimitInfo) => {
  if (!rateLimitInfo) return null;

  if (rateLimitInfo.remaining > 0) {
    return `You have ${rateLimitInfo.remaining} conversion${rateLimitInfo.remaining === 1 ? '' : 's'} remaining today.`;
  } else {
    return `Daily limit reached! Reset at ${rateLimitInfo.resetTime}.`;
  }
};

/**
 * Handle 429 (Too Many Requests) error response
 * @param {AxiosError} error - Error response
 * @returns {string} Formatted error message
 */
export const handle429Error = (error) => {
  const data = error.response?.data;
  const resetTime = data?.retryAfter
    ? new Date(data.retryAfter).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : 'midnight';

  return `Daily limit reached! You can make ${data?.maxCalls || 2} conversions per day. Reset at ${resetTime}.`;
};

export default {
  getRateLimitFromHeaders,
  formatRateLimitMessage,
  handle429Error,
};
