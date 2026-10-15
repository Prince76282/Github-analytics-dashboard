import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BoundedMemoryCache } from '../src/services/githubCache.service.js';

describe('BoundedMemoryCache (5-Minute Search Cache)', () => {
  let cache: BoundedMemoryCache;

  beforeEach(() => {
    cache = new BoundedMemoryCache(300, 5); // 300s TTL, max 5 entries
  });

  it('generates consistent normalized cache keys', () => {
    const key1 = BoundedMemoryCache.createSearchKey(' React ', 1, 20, 'STARS', 'DESC');
    const key2 = BoundedMemoryCache.createSearchKey('react', 1, 20, 'stars', 'desc');
    expect(key1).toBe('search:react:p1:sz20:sstars:odesc');
    expect(key1).toBe(key2);
  });

  it('stores and retrieves cached data within TTL', () => {
    const data = { items: [{ id: 1, name: 'react' }] };
    cache.set('key1', data);

    const retrieved = cache.get<typeof data>('key1');
    expect(retrieved).toEqual(data);
    expect(cache.has('key1')).toBe(true);
  });

  it('expires items after TTL exceeds', async () => {
    // Cache with a 50ms TTL for testing expiration
    const fastCache = new BoundedMemoryCache(0.05, 10);
    fastCache.set('expire-key', { message: 'temporary' }, 50);

    expect(fastCache.get('expire-key')).toEqual({ message: 'temporary' });

    // Wait 60ms
    await new Promise((r) => setTimeout(r, 60));

    expect(fastCache.get('expire-key')).toBeNull();
    expect(fastCache.has('expire-key')).toBe(false);
  });

  it('enforces maximum capacity and evicts oldest items', () => {
    const bounded = new BoundedMemoryCache(300, 3);
    bounded.set('k1', 'val1');
    bounded.set('k2', 'val2');
    bounded.set('k3', 'val3');
    expect(bounded.size()).toBe(3);

    // Adding 4th item should evict oldest (k1)
    bounded.set('k4', 'val4');
    expect(bounded.size()).toBeLessThanOrEqual(3);
    expect(bounded.get('k1')).toBeNull();
    expect(bounded.get('k4')).toBe('val4');
  });

  it('deduplicates concurrent identical fetch requests', async () => {
    const fetchSpy = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return { payload: 'remote-data' };
    });

    const [res1, res2, res3] = await Promise.all([
      cache.getOrFetch('shared-key', fetchSpy),
      cache.getOrFetch('shared-key', fetchSpy),
      cache.getOrFetch('shared-key', fetchSpy),
    ]);

    // Only one remote call should have occurred
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(res1.data).toEqual({ payload: 'remote-data' });
    expect(res2.data).toEqual({ payload: 'remote-data' });
    expect(res3.data).toEqual({ payload: 'remote-data' });
  });
});
