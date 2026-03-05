// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: 'https://devsapihub.com/api-movies',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
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
  MOVIES_TTL: 5 * 60 * 1000, // 5 minutos
  ENABLE_CACHE: true,
} as const;

// Configuración de seguridad
export const SECURITY_CONFIG = {
  ENABLE_RATE_LIMITING: true,
  MAX_REQUESTS_PER_MINUTE: 30,
  SANITIZE_INPUT: true,
} as const;
