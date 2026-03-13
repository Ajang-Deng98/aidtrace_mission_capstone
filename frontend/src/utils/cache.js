// Simple cache utility to reduce API calls
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  clearAll() {
    this.cache.clear();
  }
}

export const cache = new CacheManager();

// Wrapper for API calls with caching
export const cachedAPICall = async (key, apiFunction) => {
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache hit: ${key}`);
    return { data: cached };
  }

  console.log(`Cache miss: ${key}`);
  const response = await apiFunction();
  cache.set(key, response.data);
  return response;
};
