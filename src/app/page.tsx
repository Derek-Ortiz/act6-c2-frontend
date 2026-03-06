"use client";

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import MovieCard from '../components/MovieCard';

// Reutilizamos la interfaz
interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  genre: string;
  stars: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Llamamos a nuestro propio Backend (SOA), no a la API externa directamente
        const response = await apiClient.get('/movies');
        setMovies(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las películas desde el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Cargando películas... 🍿</div>;
  if (error) return <div style={{ color: '#ef4444', textAlign: 'center' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Películas Destacadas</h2>
      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}