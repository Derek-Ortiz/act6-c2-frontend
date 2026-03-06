"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../services/api';

interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  genre: string;
  stars: number;
}

export default function MovieDetail() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('soa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await apiClient.get(`/movies/${params.id}`);
        setMovie(response.data.data);
        
        const storedUser = localStorage.getItem('soa_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          try {
            const favResponse = await apiClient.get(`/favorites/${parsedUser.id}`);
            const favorites = favResponse.data.data || [];
            const isFav = favorites.some((fav: Movie) => fav.id === Number(params.id));
            setIsFavorite(isFav);
          } catch (err) {
            console.error('Error al verificar favoritos:', err);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar la película');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMovie();
    }
  }, [params.id]);

  const toggleFavorite = async () => {
    if (!user || !movie) {
      alert('Debes iniciar sesión para agregar a favoritos');
      router.push('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (!isFavorite) {
        await apiClient.post('/favorites', { userId: user.id, movie });
        setIsFavorite(true);
      } else {
        await apiClient.delete('/favorites', { data: { userId: user.id, movie } });
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error);
      alert("Hubo un error al actualizar los favoritos");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '1.5rem' }}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(emptyStars)}
        <span style={{ marginLeft: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ fontSize: '1.5rem' }}>Cargando película...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ color: '#ef4444', fontSize: '1.25rem' }}>{error || 'Película no encontrada'}</p>
        <button
          onClick={() => router.back()}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Botón volver */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: 'var(--primary)',
          border: '2px solid var(--primary)',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--primary)';
        }}
      >
        ← Volver
      </button>

      {/* Card principal */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '2.5rem',
              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {movie.title}
            </h1>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              color: '#94a3b8',
              fontSize: '1.1rem'
            }}>
              <span style={{ 
                backgroundColor: 'var(--accent)', 
                color: '#000', 
                padding: '4px 12px', 
                borderRadius: '20px',
                fontWeight: 'bold'
              }}>
                {movie.year}
              </span>
              <span style={{
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                color: 'var(--primary)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: '500'
              }}>
                {movie.genre}
              </span>
            </div>
          </div>
          
          {/* Rating */}
          <div style={{ 
            backgroundColor: 'rgba(251, 191, 36, 0.1)', 
            padding: '1rem 1.5rem', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
              Calificación
            </p>
            {renderStars(movie.stars)}
          </div>
        </div>

        {/* Divider */}
        <div style={{ 
          height: '2px', 
          background: 'linear-gradient(90deg, var(--primary), var(--accent), transparent)',
          marginBottom: '2rem',
          borderRadius: '1px'
        }} />

        {/* Descripción */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: 'var(--primary)',
            fontSize: '1.25rem'
          }}>
            Sinopsis
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8',
            color: '#e2e8f0'
          }}>
            {movie.description}
          </p>
        </div>

        {/* Información adicional */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '12px'
        }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>
              ID de Película
            </p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>#{movie.id}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>
              Año de Estreno
            </p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{movie.year}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>
              Género
            </p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{movie.genre}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>
              Puntuación
            </p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
              {movie.stars} / 5.0
            </p>
          </div>
        </div>

        {/* Botón de favoritos */}
        <button
          onClick={toggleFavorite}
          disabled={favoriteLoading}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: favoriteLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            backgroundColor: isFavorite ? 'transparent' : 'var(--primary)',
            color: isFavorite ? 'var(--primary)' : 'white',
            border: `2px solid var(--primary)`
          }}
        >
          {favoriteLoading 
            ? 'Procesando...' 
            : isFavorite 
              ? '❤️ Quitar de Mis Favoritos' 
              : '🤍 Agregar a Mis Favoritos'
          }
        </button>
      </div>
    </div>
  );
}
