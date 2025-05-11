// lib/cache.ts
type CacheItem<T> = {
  data: T;
  timestamp: number;
}

class Cache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    const now = Date.now()
    if (now - item.timestamp > this.defaultTTL) {
      // Cache expired
      this.cache.delete(key)
      return null
    }
    
    return item.data as T
  }
  
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    if (ttl) {
      setTimeout(() => {
        this.cache.delete(key)
      }, ttl)
    }
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
}

export const cache = new Cache()