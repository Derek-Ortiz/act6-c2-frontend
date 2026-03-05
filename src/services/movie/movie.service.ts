// Servicio de negocio para películas (lógica de negocio y orchestration)
import { movieApiService } from '../api/movie-api.service';
import { cacheService } from '../cache/cache.service';
import { Movie, MovieFilters, MoviesResponse, ApiResponse } from '@/types/movie.types';

class MovieService {
  // Obtener películas con cache y filtros
  async getMovies(
    category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming' = 'popular',
    page: number = 1
  ): Promise<ApiResponse<MoviesResponse>> {
    const cacheKey = `movies_${category}_${page}`;
    
    // Intentar obtener del cache
    const cachedData = cacheService.get<MoviesResponse>(cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
      };
    }

    // Si no está en cache, obtener de la API
    let response: ApiResponse<MoviesResponse>;

    switch (category) {
      case 'popular':
        response = await movieApiService.getPopularMovies(page);
        break;
      case 'top_rated':
        response = await movieApiService.getTopRatedMovies(page);
        break;
      case 'now_playing':
        response = await movieApiService.getNowPlayingMovies(page);
        break;
      case 'upcoming':
        response = await movieApiService.getUpcomingMovies(page);
        break;
      default:
        response = await movieApiService.getPopularMovies(page);
    }

    // Guardar en cache si fue exitoso
    if (response.success && response.data) {
      cacheService.set(cacheKey, response.data);
    }

    return response;
  }

  // Buscar películas
  async searchMovies(query: string, page: number = 1): Promise<ApiResponse<MoviesResponse>> {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: 'Search query cannot be empty',
      };
    }

    const cacheKey = `search_${query}_${page}`;
    
    // Intentar obtener del cache
    const cachedData = cacheService.get<MoviesResponse>(cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
      };
    }

    const response = await movieApiService.searchMovies(query, page);

    if (response.success && response.data) {
      cacheService.set(cacheKey, response.data);
    }

    return response;
  }

  // Obtener detalle de película
  async getMovieDetail(id: number): Promise<ApiResponse<Movie>> {
    if (!id || id <= 0) {
      return {
        success: false,
        error: 'Invalid movie ID',
      };
    }

    const cacheKey = `movie_${id}`;
    
    const cachedData = cacheService.get<Movie>(cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
      };
    }

    const response = await movieApiService.getMovieById(id);

    if (response.success && response.data) {
      cacheService.set(cacheKey, response.data);
    }

    return response;
  }

  // Filtrar y ordenar películas (lógica de negocio)
  filterAndSortMovies(movies: Movie[], filters: MovieFilters): Movie[] {
    let filtered = [...movies];

    // Filtrar por búsqueda
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.overview.toLowerCase().includes(query)
      );
    }

    // Ordenar
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'popularity':
            comparison = b.popularity - a.popularity;
            break;
          case 'vote_average':
            comparison = b.vote_average - a.vote_average;
            break;
          case 'release_date':
            comparison = new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
            break;
        }

        return filters.order === 'asc' ? -comparison : comparison;
      });
    }

    return filtered;
  }

  // Validar si una película está disponible
  isMovieAvailable(movie: Movie): boolean {
    return movie.poster_path !== null && movie.overview !== '';
  }

  // Obtener URL de imagen completa
  getImageUrl(path: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      small: 'w200',
      medium: 'w500',
      large: 'w780',
    };
    
    if (!path) return '/placeholder-movie.jpg';
    
    return `https://image.tmdb.org/t/p/${sizes[size]}${path}`;
  }

  // Formatear fecha de lanzamiento
  formatReleaseDate(date: string): string {
    if (!date) return 'Unknown';
    
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  }

  // Calcular rating en estrellas
  getRatingStars(voteAverage: number): number {
    return Math.round((voteAverage / 10) * 5 * 10) / 10;
  }
}

export const movieService = new MovieService();
