type Entry<T> = { value: T; expiresAt: number };

export class MemoryCache {
  private store = new Map<string, Entry<unknown>>();

  constructor(private ttlSeconds: number) {}

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T) {
    const expiresAt = Date.now() + this.ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }
}
