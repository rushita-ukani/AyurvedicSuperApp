import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

interface CacheEntry<T> {
  timestamp: number;
  data: T;
  ttlMs: number;
}

class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  public async set<T>(key: string, data: T, ttlMs: number = 300000): Promise<void> {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      data,
      ttlMs,
    };
    this.memoryCache.set(key, entry);
    try {
      await AsyncStorage.setItem(`@cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      logger.warn('CacheManager', `Failed to persist cache key ${key}`, e);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    // 1. Check memory cache first
    const memEntry = this.memoryCache.get(key);
    if (memEntry) {
      if (Date.now() - memEntry.timestamp < memEntry.ttlMs) {
        return memEntry.data;
      }
    }

    // 2. Check disk cache
    try {
      const raw = await AsyncStorage.getItem(`@cache_${key}`);
      if (raw) {
        const diskEntry: CacheEntry<T> = JSON.parse(raw);
        this.memoryCache.set(key, diskEntry);
        if (Date.now() - diskEntry.timestamp < diskEntry.ttlMs) {
          return diskEntry.data;
        }
      }
    } catch (e) {
      logger.warn('CacheManager', `Failed to read cache key ${key}`, e);
    }

    return null;
  }

  public async clear(): Promise<void> {
    this.memoryCache.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('@cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (e) {
      logger.error('CacheManager', 'Failed to clear cache', e);
    }
  }
}

export const cacheManager = new CacheManager();
