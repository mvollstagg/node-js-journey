import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3000),
  baseUrl: process.env.POKEAPI_BASE_URL || "https://pokeapi.co/api/v2",
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS || 60),
  httpTimeoutMs: Number(process.env.HTTP_TIMEOUT_MS || 8000),
  maxRetries: Number(process.env.MAX_RETRIES || 3),
} as const;