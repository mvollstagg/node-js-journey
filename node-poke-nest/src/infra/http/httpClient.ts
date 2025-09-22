import { config } from "../config.js";
import { log } from "../logging/logger.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${config.baseUrl}${path}`;
  let attempt = 0;

  while (true) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.httpTimeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (res.ok) {
        clearTimeout(timer);
        return (await res.json()) as T;
      }

      if ((res.status === 429 || res.status >= 500) && attempt < config.maxRetries) {
        const backoff = 2 ** attempt * 200;
        log.warn(`Retry ${attempt}/${config.maxRetries} for ${url} (status ${res.status})`);
        await sleep(backoff);
        continue;
      }

      clearTimeout(timer);
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    } catch (err) {
      clearTimeout(timer);
      if (attempt < config.maxRetries) {
        const backoff = 2 ** attempt * 200;
        log.warn(`Error "${(err as Error).message}". Retrying in ${backoff}ms (${attempt})`);
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
}
