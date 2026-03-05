'use client';

import { useState, useEffect, useCallback } from 'react';
import { movieService } from '@/services/movie/movie.service';
import { Movie } from '@/types/movie.types';
import { MovieGrid } from '@/components/movies/MovieGrid';
import { MovieFilters } from '@/components/movies/MovieFilters';
import { Pagination } from '@/components/movies/Pagination';
import { ErrorNotification } from '@/components/ui/ErrorNotification';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<'popular' | 'top_rated' | 'now_playing' | 'upcoming'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar películas
  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (searchQuery.trim()) {
        response = await movieService.searchMovies(searchQuery, currentPage);
      } else {
        response = await movieService.getMovies(category, currentPage);
      }

      if (response.success && response.data) {
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500)); // API limita a 500 páginas
      } else {
        setError(response.error || 'Error loading movies');
        setMovies([]);
      }
    } catch {
      setError('Unexpected error occurred');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, currentPage, searchQuery]);

  // Cargar películas cuando cambian las dependencias
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Manejar cambio de categoría
  const handleCategoryChange = (newCategory: typeof category) => {
    setCategory(newCategory);
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎬</div>
            <div>
              <h1 className="text-3xl font-bold text-white">Movie Database</h1>
              <p className="text-gray-400 text-sm">
                Discover thousands of movies powered by SOA architecture
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <MovieFilters
          category={category}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
        />

        {/* Información de resultados */}
        {!isLoading && movies.length > 0 && (
          <div className="mb-6 text-gray-400">
            Showing page {currentPage} of {totalPages} 
            {searchQuery && ` · Searching for "${searchQuery}"`}
          </div>
        )}

        {/* Grid de películas */}
        <MovieGrid movies={movies} isLoading={isLoading} />

        {/* Paginación */}
        {!isLoading && movies.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-neutral-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">🏗️ Built with Service-Oriented Architecture (SOA)</p>
            <p className="text-sm">
              Features: API Service Layer • Business Logic Layer • Caching • Rate Limiting • Error Handling
            </p>
          </div>
        </div>
      </footer>

      {/* Notificación de error */}
      {error && (
        <ErrorNotification
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}