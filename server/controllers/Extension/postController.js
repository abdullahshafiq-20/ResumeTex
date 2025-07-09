import axios from "axios";
import * as cheerio from 'cheerio';

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0"
];

// Simple in-memory cache
const cache = new Map();
const TTL = 1000 * 60 * 30; // 30 minutes

// Function to clean LinkedIn post URL by removing query parameters
function cleanLinkedInUrl(url) {
    try {
        if (!url || typeof url !== 'string') {
            throw new Error('Invalid URL provided');
        }

        // Handle the specific case mentioned in the request
        const questionMarkIndex = url.indexOf('?');
        if (questionMarkIndex !== -1) {
            return url.substring(0, questionMarkIndex);
        }

        return url;
    } catch (error) {
        throw new Error(`Error cleaning URL: ${error.message}`);
    }
}

// Function to check if login modal is present and handle it
function checkForLoginModal($) {
    const loginModalSelectors = [
        '.authentication-outlet',
        '.auth-modal',
        '.login-modal',
        '[data-test-id="sign-in-modal"]',
        '.challenge-page',
        '.guest-authentication'
    ];

    for (const selector of loginModalSelectors) {
        if ($(selector).length > 0) {
            return true;
        }
    }
    return false;
}

// Function to extract post content from LinkedIn post page
function parsePostContent(html) {
    const $ = cheerio.load(html);

    try {
        // Check if login modal is displayed
        const hasLoginModal = checkForLoginModal($);

        // Primary target: data-test-id="main-feed-activity-card__commentary"
        let commentary = $('[data-test-id="main-feed-activity-card__commentary"]').text().trim();

        // Fallback selectors if primary doesn't work
        if (!commentary) {
            const fallbackSelectors = [
                '.feed-shared-text',
                '.feed-shared-text__text-view',
                '.attributed-text-segment-list__content',
                '.feed-shared-inline-show-more-text',
                '.break-words',
                '[data-test-id="main-feed-activity-card__commentary"] .attributed-text-segment-list__content',
                '.feed-shared-text .break-words'
            ];

            for (const selector of fallbackSelectors) {
                commentary = $(selector).first().text().trim();
                if (commentary) break;
            }
        }

        // Extract additional metadata
        const authorName = $('.feed-shared-actor__name').text().trim() ||
            $('[data-test-id="main-feed-activity-card__actor-name"]').text().trim() ||
            $('.update-components-actor__name').text().trim();

        const authorTitle = $('.feed-shared-actor__description').text().trim() ||
            $('[data-test-id="main-feed-activity-card__actor-description"]').text().trim() ||
            $('.update-components-actor__description').text().trim();

        const postTime = $('time').attr('datetime') || $('time').text().trim() || '';

        const likes = $('.social-action-bar__action-count').first().text().trim() || '0';
        const comments = $('.social-action-bar__action-count').eq(1).text().trim() || '0';
        const shares = $('.social-action-bar__action-count').last().text().trim() || '0';

        // Extract hashtags
        const hashtags = [];
        $('a[href*="/hashtag/"]').each((_, el) => {
            const hashtagText = $(el).text().trim();
            if (hashtagText && hashtagText.startsWith('#')) {
                hashtags.push(hashtagText);
            }
        });

        // Extract mentions
        const mentions = [];
        $('a[href*="/in/"]').each((_, el) => {
            const mentionText = $(el).text().trim();
            if (mentionText && mentionText.startsWith('@')) {
                mentions.push(mentionText);
            }
        });

        return {
            success: true,
            hasLoginModal,
            content: {
                commentary: commentary || "No commentary found",
                author: {
                    name: authorName || "Unknown",
                    title: authorTitle || "Not specified"
                },
                postTime,
                engagement: {
                    likes,
                    comments,
                    shares
                },
                hashtags,
                mentions
            },
            extractedAt: new Date().toISOString()
        };

    } catch (error) {
        return {
            success: false,
            hasLoginModal: checkForLoginModal($),
            error: `Error parsing content: ${error.message}`,
            extractedAt: new Date().toISOString()
        };
    }
}

// Main function to get LinkedIn post content
export const getLinkedInPost = async (url) => {


    if (!url) {
        return {
            success: false,
            error: "URL parameter is required"
        };
    }

    try {
        // Clean the URL
        const cleanedUrl = cleanLinkedInUrl(url);

        // Check cache first
        const cacheKey = `post_${cleanedUrl}`;
        const cached = cache.get(cacheKey);
        const now = Date.now();

        if (cached && (now - cached.timestamp < TTL)) {
            return {
                ...cached.data,
                fromCache: true
            };
        }

        // Make request to LinkedIn
        const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

        const response = await axios.get(cleanedUrl, {
            headers: {
                "User-Agent": randomUserAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Referer": "https://www.linkedin.com/",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            },
            timeout: 15000,
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
            }
        });

        // Parse the content
        const result = parsePostContent(response.data);

        // Add URL info to result
        result.urlInfo = {
            originalUrl: url,
            cleanedUrl: cleanedUrl,
            wasUrlCleaned: url !== cleanedUrl
        };

        // Cache successful results
        if (result.success) {
            cache.set(cacheKey, {
                data: result,
                timestamp: now
            });
        }

        return result;

    } catch (error) {
        console.error('Error fetching LinkedIn post:', error.message);

        let errorMessage = "Error fetching post";
        let statusCode = 500;

        if (error.response) {
            statusCode = error.response.status;
            if (statusCode === 404) {
                errorMessage = "Post not found or URL is invalid";
            } else if (statusCode === 403) {
                errorMessage = "Access denied - post may be private or require authentication";
            } else if (statusCode === 429) {
                errorMessage = "Rate limit exceeded - please try again later";
            } else {
                errorMessage = `HTTP ${statusCode}: ${error.response.statusText}`;
            }
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = "Request timeout - LinkedIn may be blocking requests";
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = "Network error - unable to reach LinkedIn";
        }

        return {
            success: false,
            error: errorMessage,
            details: error.message,
            urlInfo: {
                originalUrl: url,
                cleanedUrl: url ? cleanLinkedInUrl(url) : null,
                wasUrlCleaned: url ? url !== cleanLinkedInUrl(url) : false
            }
        };
    }
};

// Function to clear cache (utility)
export const clearPostCache = () => {
    cache.clear();
    return {
        success: true,
        message: "Post cache cleared successfully"
    };
};

// Function to get cache statistics
export const getCacheStats = () => {
    return {
        success: true,
        cacheSize: cache.size,
        entries: Array.from(cache.keys())
    };
};
