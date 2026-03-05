// Tipos y modelos de datos para películas
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids?: number[];
  original_language: string;
  original_title: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieFilters {
  query?: string;
  page?: number;
  sortBy?: 'popularity' | 'release_date' | 'vote_average';
  order?: 'asc' | 'desc';
}
