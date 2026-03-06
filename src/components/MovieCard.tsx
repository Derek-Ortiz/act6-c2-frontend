"use client"; // Necesario porque tiene interactividad (onClick)

import { useState } from 'react';
import { apiClient } from '../services/api';

interface MovieProps {
  movie: {
    id: number;
    title: string;
    description: string;
    year: number;
    genre: string;
    stars: number;
  };
  // Para simplificar, hardcodeamos un usuario de prueba (ID 1)
  userId?: number; 
}

export default function MovieCard({ movie, userId = 1 }: MovieProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (!isFavorite) {
        // Enviar al backend para guardar en BD
        await apiClient.post('/favorites', { userId, movie });
        setIsFavorite(true);
      } else {
        // Enviar al backend para hacer el soft-delete
        await apiClient.delete('/favorites', { data: { userId, movie } });
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error);
      alert("Hubo un error al actualizar los favoritos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{movie.title}</h2>
        <span style={{ backgroundColor: 'var(--accent)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.875rem' }}>
          ⭐ {movie.stars}
        </span>
      </div>
      
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
        {movie.year} • {movie.genre}
      </p>
      
      <p style={{ fontSize: '0.95rem', flexGrow: 1, marginBottom: '1.5rem' }}>
        {movie.description}
      </p>

      <button 
        onClick={toggleFavorite}
        disabled={loading}
        style={{
          backgroundColor: isFavorite ? 'transparent' : 'var(--primary)',
          color: isFavorite ? 'var(--primary)' : 'white',
          border: `2px solid var(--primary)`,
          padding: '0.75rem',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        {loading ? 'Cargando...' : isFavorite ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos'}
      </button>
    </div>
  );
}