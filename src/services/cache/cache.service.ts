// Servicio de cache con gestión de memoria
import { CACHE_CONFIG } from '@/config/api.config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  // Guardar en cache
  set<T>(key: string, data: T): void {
    if (!CACHE_CONFIG.ENABLE_CACHE) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Limitar tamaño del cache (máximo 100 entradas)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  // Obtener del cache
  get<T>(key: string): T | null {
    if (!CACHE_CONFIG.ENABLE_CACHE) return null;

    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_CONFIG.MOVIES_TTL;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Limpiar cache
  clear(): void {
    this.cache.clear();
  }

  // Eliminar una entrada específica
  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cacheService = new CacheService();
