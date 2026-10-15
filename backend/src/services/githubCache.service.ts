interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

export class BoundedMemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlight = new Map<string, Promise<unknown>>();
  private readonly defaultTtlMs: number;
  private readonly maxEntries: number;

  constructor(defaultTtlSeconds = 300, maxEntries = 500) {
    this.defaultTtlMs = defaultTtlSeconds * 1000;
    this.maxEntries = maxEntries;
  }

  /**
   * Generates a deterministic cache key for search requests
   */
  public static createSearchKey(
    query: string,
    page: number,
    perPage: number,
    sort: string = '',
    order: string = 'desc'
  ): string {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedSort = (sort || 'default').trim().toLowerCase();
    const normalizedOrder = (order || 'desc').trim().toLowerCase();
    return `search:${normalizedQuery}:p${page}:sz${perPage}:s${normalizedSort}:o${normalizedOrder}`;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh entry position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs?: number): void {
    // Evict expired entries or oldest if capacity reached
    if (this.cache.size >= this.maxEntries) {
      this.evictOldestOrExpired();
    }

    const effectiveTtl = ttlMs ?? this.defaultTtlMs;
    const now = Date.now();
    this.cache.set(key, {
      data,
      expiresAt: now + effectiveTtl,
      createdAt: now,
    });
  }

  /**
   * Handles concurrent identical requests with deduplication
   */
  public async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs?: number
  ): Promise<{ data: T; cached: boolean }> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return { data: cached, cached: true };
    }

    // Deduplicate in-flight requests
    const existingPromise = this.inFlight.get(key);
    if (existingPromise) {
      const result = (await existingPromise) as T;
      return { data: result, cached: true };
    }

    const fetchPromise = (async () => {
      try {
        const fetchedData = await fetcher();
        this.set(key, fetchedData, ttlMs);
        return fetchedData;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, fetchPromise);
    const data = await fetchPromise;
    return { data, cached: false };
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
    this.inFlight.clear();
  }

  public size(): number {
    return this.cache.size;
  }

  private evictOldestOrExpired(): void {
    const now = Date.now();
    // First, purge any expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }

    // If still at capacity, delete the oldest item (first key in map iteration)
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }
}

// Singleton cache instance with default 5-minute (300s) TTL and 500 entry limit
export const searchCache = new BoundedMemoryCache(300, 500);
