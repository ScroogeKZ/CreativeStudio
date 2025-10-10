import NodeCache from 'node-cache';
import { logger } from './logger';

// Cache TTL in seconds (10 minutes for content, 5 minutes for dynamic data)
const CONTENT_TTL = 600; // 10 minutes
const DYNAMIC_TTL = 300; // 5 minutes

// Create cache instances
export const contentCache = new NodeCache({ 
  stdTTL: CONTENT_TTL,
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Better performance, but be careful with mutations
});

export const dynamicCache = new NodeCache({ 
  stdTTL: DYNAMIC_TTL,
  checkperiod: 60,
  useClones: false,
});

// Cache keys
export const CACHE_KEYS = {
  ALL_SERVICES: 'all_services',
  ALL_CASES: 'all_cases',
  ALL_POSTS: 'all_posts',
  ALL_TESTIMONIALS: 'all_testimonials',
  SERVICE_BY_SLUG: (slug: string) => `service_${slug}`,
  CASE_BY_SLUG: (slug: string) => `case_${slug}`,
  POST_BY_SLUG: (slug: string) => `post_${slug}`,
  RECENT_POSTS: (limit: number) => `recent_posts_${limit}`,
};

// Clear all content cache
export function clearContentCache() {
  contentCache.flushAll();
  logger.info('Content cache cleared');
}

// Clear specific cache entry
export function clearCacheKey(key: string) {
  contentCache.del(key);
  dynamicCache.del(key);
  logger.info('Cache cleared for key', { key });
}

// Cache middleware for Express routes
export function cacheMiddleware(key: string, ttl?: number) {
  return (req: any, res: any, next: any) => {
    const cachedData = contentCache.get(key);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache response
    res.json = (data: any) => {
      if (res.statusCode === 200) {
        contentCache.set(key, data, ttl || CONTENT_TTL);
      }
      return originalJson(data);
    };
    
    next();
  };
}
