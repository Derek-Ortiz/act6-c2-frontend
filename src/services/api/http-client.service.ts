// Servicio HTTP base con manejo de errores y seguridad
import { API_CONFIG } from '@/config/api.config';
import { ApiResponse } from '@/types/movie.types';

class HttpClientService {
  private requestCount: Map<string, number[]> = new Map();

  // Validación de rate limiting
  private checkRateLimit(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.requestCount.get(endpoint) || [];
    
    // Filtrar requests del último minuto
    const recentRequests = requests.filter(time => now - time < 60000);
    
    if (recentRequests.length >= 30) {
      return false;
    }
    
    recentRequests.push(now);
    this.requestCount.set(endpoint, recentRequests);
    return true;
  }

  // Sanitización de entrada
  private sanitizeUrl(url: string): string {
    return url.replace(/[<>'"]/g, '');
  }

  // Método GET con manejo de errores
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      // Rate limiting
      if (!this.checkRateLimit(endpoint)) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          statusCode: 429,
        };
      }

      // Sanitización
      const sanitizedEndpoint = this.sanitizeUrl(endpoint);
      const url = `${API_CONFIG.BASE_URL}${sanitizedEndpoint}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP Error: ${response.status} ${response.statusText}`,
          statusCode: response.status,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout. Please try again.',
            statusCode: 408,
          };
        }
        return {
          success: false,
          error: error.message || 'Network error occurred',
          statusCode: 0,
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred',
        statusCode: 0,
      };
    }
  }

  // Método con retry automático
  async getWithRetry<T>(
    endpoint: string,
    options?: RequestInit,
    retries = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<ApiResponse<T>> {
    let lastError: ApiResponse<T> | null = null;

    for (let i = 0; i < retries; i++) {
      const result = await this.get<T>(endpoint, options);
      
      if (result.success) {
        return result;
      }

      lastError = result;
      
      // No reintentar en errores de cliente (4xx)
      if (result.statusCode && result.statusCode >= 400 && result.statusCode < 500) {
        break;
      }

      // Esperar antes de reintentar
      if (i < retries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1))
        );
      }
    }

    return lastError || {
      success: false,
      error: 'All retry attempts failed',
      statusCode: 0,
    };
  }
}

export const httpClient = new HttpClientService();
