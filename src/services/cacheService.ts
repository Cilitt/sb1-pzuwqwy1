import { supabase } from '../lib/supabase';

const CACHE_PREFIX = 'app_cache_';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const item: CacheItem<T> = JSON.parse(cached);
      if (Date.now() < item.expiresAt) {
        return item.data;
      }
      localStorage.removeItem(cacheKey);
    }
    return null;
  }

  static set<T>(key: string, data: T, duration = DEFAULT_CACHE_DURATION): void {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));
  }

  static async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    duration = DEFAULT_CACHE_DURATION
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const data = await fetcher();
    this.set(key, data, duration);
    return data;
  }

  static clearCache(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}

// Supabase query wrapper with caching
export const cachedQuery = async <T>(
  queryKey: string,
  query: any,
  duration = DEFAULT_CACHE_DURATION
): Promise<T[]> => {
  return CacheService.getOrFetch(
    queryKey,
    async () => {
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    duration
  );
};