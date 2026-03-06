const toNumber = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const toBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'https://devsapihub.com/api-movies',
  TIMEOUT: toNumber(process.env.API_TIMEOUT, 10000), // 10 segundos
  RETRY_ATTEMPTS: toNumber(process.env.API_RETRY_ATTEMPTS, 3),
  RETRY_DELAY: toNumber(process.env.API_RETRY_DELAY, 1000), // 1 segundo
} as const;

// Configuración de endpoints
export const ENDPOINTS = {
  POPULAR: '/popular',
  TOP_RATED: '/top_rated',
  NOW_PLAYING: '/now_playing',
  UPCOMING: '/upcoming',
  SEARCH: '/search',
  MOVIE_DETAIL: (id: number) => `/${id}`,
} as const;

// Configuración de cache
export const CACHE_CONFIG = {
  MOVIES_TTL: toNumber(process.env.CACHE_MOVIES_TTL, 5 * 60 * 1000), // 5 minutos
  ENABLE_CACHE: toBoolean(process.env.CACHE_ENABLE, true),
} as const;

// Configuración de seguridad
export const SECURITY_CONFIG = {
  ENABLE_RATE_LIMITING: toBoolean(process.env.SECURITY_ENABLE_RATE_LIMITING, true),
  MAX_REQUESTS_PER_MINUTE: toNumber(process.env.SECURITY_MAX_REQUESTS_PER_MINUTE, 30),
  SANITIZE_INPUT: toBoolean(process.env.SECURITY_SANITIZE_INPUT, true),
} as const;
