// Componente de tarjeta de película
import { Movie } from '@/types/movie.types';
import { movieService } from '@/services/movie/movie.service';
import Link from 'next/link';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movieService.getImageUrl(movie.poster_path, 'medium');
  const rating = movieService.getRatingStars(movie.vote_average);

  return (
    <Link 
      href={`/movies/${movie.id}`}
      className="group block bg-neutral-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-movie.jpg';
          }}
        />
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-white text-sm font-semibold">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">
          {movieService.formatReleaseDate(movie.release_date)}
        </p>
        <p className="text-gray-300 text-sm line-clamp-3">
          {movie.overview || 'No description available'}
        </p>
      </div>
    </Link>
  );
}
