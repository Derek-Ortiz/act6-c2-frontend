// Componente de filtros para películas
'use client';

interface MovieFiltersProps {
  category: string;
  onCategoryChange: (category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export function MovieFilters({
  category,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isLoading = false,
}: MovieFiltersProps) {
  const categories = [
    { value: 'popular', label: 'Popular', icon: '🔥' },
    { value: 'top_rated', label: 'Top Rated', icon: '⭐' },
    { value: 'now_playing', label: 'Now Playing', icon: '🎬' },
    { value: 'upcoming', label: 'Upcoming', icon: '📅' },
  ];

  return (
    <div className="bg-neutral-900 rounded-lg p-6 mb-8 shadow-xl border border-neutral-800">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={isLoading}
              className="w-full bg-neutral-800 text-white placeholder-gray-500 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value as any)}
              disabled={isLoading}
              className={`px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                category === cat.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
