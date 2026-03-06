"use client";

import { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import MovieCard from '../../components/MovieCard';

export default function Favorites() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('soa_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchFavorites(parsedUser.id);
    } else {
      window.location.href = '/login'; // Proteger ruta
    }
  }, []);

  const fetchFavorites = async (userId: number) => {
    try {
      const response = await apiClient.get(`/favorites/${userId}`);
      // El backend devuelve los datos combinados de la tabla movies y favorites
      setMovies(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Cargando tus favoritos... 🍿</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Mis Películas Favoritas ❤️</h2>
      {movies.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Aún no tienes películas favoritas. ¡Ve al inicio y agrega algunas!</p>
      ) : (
        <div className="grid">
          {movies.map((movie) => (
            // Pasamos un prop extra para indicar que ya es favorito en esta vista
            <MovieCard key={movie.id} movie={movie} userId={user.id} />
          ))}
        </div>
      )}
    </div>
  );
}