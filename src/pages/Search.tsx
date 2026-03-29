import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X, Filter, Sparkles } from 'lucide-react';
import { tmdbService } from '@/src/services/tmdb';
import { Movie } from '@/src/types';
import MovieCard from '@/src/components/MovieCard';
import PersonCard from '@/src/components/PersonCard';
import { motion, AnimatePresence } from 'motion/react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<Movie[]>([]);
  
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState<number | ''>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  const [movieGenres, setMovieGenres] = useState<any[]>([]);
  const [tvGenres, setTvGenres] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrendingAndGenres = async () => {
      try {
        const [trendingData, mGenres, tGenres] = await Promise.all([
          tmdbService.getTrending('all'),
          tmdbService.getGenres('movie'),
          tmdbService.getGenres('tv')
        ]);
        setTrending(trendingData);
        setMovieGenres(mGenres);
        setTvGenres(tGenres);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchTrendingAndGenres();
  }, []);

  const availableGenres = useMemo(() => {
    if (mediaType === 'movie') return movieGenres;
    if (mediaType === 'tv') return tvGenres;
    
    // Combine and deduplicate
    const combined = [...movieGenres, ...tvGenres];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [mediaType, movieGenres, tvGenres]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - i);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const hasFilters = selectedGenre !== '' || selectedYear !== '' || mediaType !== 'all';
      
      if (query.trim() || hasFilters) {
        setLoading(true);
        try {
          let data: any[] = [];
          
          if (query.trim()) {
            // Text search
            if (mediaType === 'all') {
               data = await tmdbService.searchMulti(query);
            } else if (mediaType === 'movie') {
               data = await tmdbService.searchMovies(query, 1, selectedYear);
            } else if (mediaType === 'tv') {
               data = await tmdbService.searchTv(query, 1, selectedYear);
            }
          } else {
            // Discover with filters
            if (mediaType === 'all') {
              const [movies, tvs] = await Promise.all([
                tmdbService.getDiscover('movie', { 
                  with_genres: selectedGenre || undefined, 
                  primary_release_year: selectedYear || undefined 
                }),
                tmdbService.getDiscover('tv', { 
                  with_genres: selectedGenre || undefined, 
                  first_air_date_year: selectedYear || undefined 
                })
              ]);
              data = [...movies, ...tvs].sort((a: any, b: any) => b.popularity - a.popularity);
            } else {
              const params: any = {};
              if (selectedGenre) params.with_genres = selectedGenre;
              if (selectedYear) {
                if (mediaType === 'movie') params.primary_release_year = selectedYear;
                else params.first_air_date_year = selectedYear;
              }
              data = await tmdbService.getDiscover(mediaType, params);
            }
          }
          
          let filtered = data;
          
          // Apply client-side filters if the API didn't support them
          if (query.trim()) {
             if (mediaType === 'all' && selectedYear) {
               filtered = filtered.filter((item: any) => {
                 const releaseDate = item.release_date || item.first_air_date;
                 return releaseDate && releaseDate.startsWith(selectedYear);
               });
             }
             
             if (selectedGenre !== '') {
               filtered = filtered.filter((item: any) => item.genre_ids?.includes(Number(selectedGenre)));
             }
          } else {
             if (mediaType === 'all' && selectedGenre !== '') {
               filtered = filtered.filter((item: any) => item.genre_ids?.includes(Number(selectedGenre)));
             }
          }
          
          setResults(filtered);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, mediaType, selectedYear, selectedGenre]);

  const hasFilters = selectedGenre !== '' || selectedYear !== '' || mediaType !== 'all';
  const isSearching = query.trim() !== '' || hasFilters;

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-4">
        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <SearchIcon className="text-primary group-focus-within:scale-110 transition-transform" size={24} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors..."
            className="w-full pl-16 pr-16 py-5 bg-surface-variant/20 border border-outline-variant/30 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-surface-variant/40 focus:border-primary transition-all text-xl font-medium placeholder:text-on-surface-variant/50 shadow-sm"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-6 flex items-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center">
          <div className="flex items-center gap-1 bg-surface-variant/30 p-1 rounded-2xl border border-outline-variant/30">
            <button 
              onClick={() => setMediaType('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mediaType === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setMediaType('movie')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mediaType === 'movie' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Movies
            </button>
            <button 
              onClick={() => setMediaType('tv')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mediaType === 'tv' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              TV Shows
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : '')}
              className="flex-1 sm:flex-none bg-surface-variant/30 border border-outline-variant/30 text-on-surface rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px', paddingRight: '40px' }}
            >
              <option value="" className="bg-surface">All Genres</option>
              {availableGenres.map(g => (
                <option key={g.id} value={g.id} className="bg-surface">{g.name}</option>
              ))}
            </select>

            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 sm:flex-none bg-surface-variant/30 border border-outline-variant/30 text-on-surface rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px', paddingRight: '40px' }}
            >
              <option value="" className="bg-surface">All Years</option>
              {years.map(y => (
                <option key={y} value={y} className="bg-surface">{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-4"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-bold animate-pulse">
              {query.trim() ? `Searching for "${query}"...` : 'Discovering content...'}
            </p>
          </motion.div>
        ) : isSearching ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight">
                {query.trim() ? (
                  <>Results for <span className="text-primary">"{query}"</span></>
                ) : (
                  <>Discover <span className="text-primary">Content</span></>
                )}
              </h2>
              <p className="text-sm text-on-surface-variant font-bold">
                {results.length} items found
              </p>
            </div>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                {results.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index % 20 * 0.03 }}
                  >
                    {item.media_type === 'person' ? (
                      <PersonCard item={item} className="w-full" />
                    ) : (
                      <MovieCard item={item} className="w-full" />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 space-y-4 bg-surface-variant/10 rounded-[40px] border border-dashed border-outline-variant/50">
                <div className="w-20 h-20 bg-surface-variant/30 rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
                  <SearchIcon size={40} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-display font-black">No results found</p>
                  <p className="text-on-surface-variant font-medium">Try adjusting your filters or search query.</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="trending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 px-2">
              <Sparkles size={24} className="text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight">Trending Searches</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
              {trending.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index % 20 * 0.03 }}
                >
                  <MovieCard item={item} className="w-full" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
