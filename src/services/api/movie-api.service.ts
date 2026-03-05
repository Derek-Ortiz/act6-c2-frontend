// Servicio de API para operaciones con películas
import { httpClient } from './http-client.service';
import { ENDPOINTS } from '@/config/api.config';
import { ApiResponse, Movie, MoviesResponse } from '@/types/movie.types';

class MovieApiService {
  // Obtener películas populares
  async getPopularMovies(page: number = 1): Promise<ApiResponse<MoviesResponse>> {
    const endpoint = `${ENDPOINTS.POPULAR}?page=${page}`;
    return httpClient.getWithRetry<MoviesResponse>(endpoint);
  }

  // Obtener películas mejor valoradas
  async getTopRatedMovies(page: number = 1): Promise<ApiResponse<MoviesResponse>> {
    const endpoint = `${ENDPOINTS.TOP_RATED}?page=${page}`;
    return httpClient.getWithRetry<MoviesResponse>(endpoint);
  }

  // Obtener películas en cartelera
  async getNowPlayingMovies(page: number = 1): Promise<ApiResponse<MoviesResponse>> {
    const endpoint = `${ENDPOINTS.NOW_PLAYING}?page=${page}`;
    return httpClient.getWithRetry<MoviesResponse>(endpoint);
  }

  // Obtener próximos estrenos
  async getUpcomingMovies(page: number = 1): Promise<ApiResponse<MoviesResponse>> {
    const endpoint = `${ENDPOINTS.UPCOMING}?page=${page}`;
    return httpClient.getWithRetry<MoviesResponse>(endpoint);
  }

  // Buscar películas
  async searchMovies(query: string, page: number = 1): Promise<ApiResponse<MoviesResponse>> {
    const encodedQuery = encodeURIComponent(query);
    const endpoint = `${ENDPOINTS.SEARCH}?query=${encodedQuery}&page=${page}`;
    return httpClient.getWithRetry<MoviesResponse>(endpoint);
  }

  // Obtener detalle de una película
  async getMovieById(id: number): Promise<ApiResponse<Movie>> {
    const endpoint = ENDPOINTS.MOVIE_DETAIL(id);
    return httpClient.getWithRetry<Movie>(endpoint);
  }
}

export const movieApiService = new MovieApiService();
