/**
 * Browser-side Rate Limiter
 * Limits API calls to 2 per day per browser/IP
 * Uses localStorage to track call timestamps
 */

const RATE_LIMIT_KEY = 'api_call_timestamps';
const MAX_CALLS_PER_DAY = 2;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Get all API call timestamps from today
 * @returns {number[]} Array of timestamps (milliseconds)
 */
const getTodayCallTimestamps = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return [];
    
    const allTimestamps = JSON.parse(stored);
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    
    // Filter only timestamps from today
    const todayTimestamps = allTimestamps.filter(
      timestamp => timestamp >= todayStart
    );
    
    return todayTimestamps;
  } catch (error) {
    console.error('Error reading rate limit from localStorage:', error);
    return [];
  }
};

/**
 * Save a new API call timestamp
 */
const recordApiCall = () => {
  try {
    const timestamps = getTodayCallTimestamps();
    timestamps.push(Date.now());
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
  } catch (error) {
    console.error('Error saving rate limit to localStorage:', error);
  }
};

/**
 * Check if user can make an API call
 * @returns {object} { canMakeCall: boolean, remainingCalls: number, resetTime: string }
 */
const checkRateLimit = () => {
  const todayTimestamps = getTodayCallTimestamps();
  const canMakeCall = todayTimestamps.length < MAX_CALLS_PER_DAY;
  const remainingCalls = Math.max(0, MAX_CALLS_PER_DAY - todayTimestamps.length);
  
  // Calculate reset time (next day at 00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const resetDate = new Date(today.getTime() + MILLISECONDS_PER_DAY);
  const resetTime = resetDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return {
    canMakeCall,
    remainingCalls,
    resetTime,
    callsUsed: todayTimestamps.length,
    maxCalls: MAX_CALLS_PER_DAY
  };
};

/**
 * Reset rate limit (for testing or manual reset)
 */
const resetRateLimit = () => {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch (error) {
    console.error('Error resetting rate limit:', error);
  }
};

/**
 * Get formatted message about current rate limit status
 * @returns {string} Formatted message
 */
const getRateLimitMessage = () => {
  const status = checkRateLimit();
  if (status.canMakeCall) {
    return `You have ${status.remainingCalls} conversion${status.remainingCalls === 1 ? '' : 's'} remaining today.`;
  } else {
    return `Daily limit reached! You can make ${MAX_CALLS_PER_DAY} conversions per day. Reset at ${status.resetTime}.`;
  }
};

export {
  checkRateLimit,
  recordApiCall,
  resetRateLimit,
  getRateLimitMessage,
  MAX_CALLS_PER_DAY,
  MILLISECONDS_PER_DAY
};
