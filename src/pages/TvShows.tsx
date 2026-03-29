import React, { useEffect, useState, useCallback } from 'react';
import { tmdbService } from '@/src/services/tmdb';
import { Movie, Genre } from '@/src/types';
import MovieCard from '@/src/components/MovieCard';
import GenreFilter from '@/src/components/GenreFilter';
import { Button } from '@/src/components/ui/Button';
import { Tv, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function TvShows() {
  const [shows, setShows] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbService.getGenres('tv');
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const params: any = { 
          page, 
          sort_by: 'popularity.desc' 
        };
        if (selectedGenre) {
          params.with_genres = selectedGenre;
        }
        const data = await tmdbService.getDiscover('tv', params);
        setShows(prev => page === 1 ? data : [...prev, ...data]);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [page, selectedGenre]);

  const handleGenreSelect = useCallback((genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
    setShows([]);
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <Tv size={28} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-on-surface">
              Explore TV Shows
            </h1>
            <p className="text-on-surface-variant font-medium mt-1 flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              Binge-worthy series and shows
            </p>
          </div>
        </div>
        
        <GenreFilter 
          genres={genres} 
          selectedGenre={selectedGenre} 
          onSelect={handleGenreSelect} 
        />
      </header>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8"
      >
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index % 20 * 0.05 }}
          >
            <MovieCard item={show} type="tv" className="w-full" />
          </motion.div>
        ))}
      </motion.div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && shows.length > 0 && (
        <div className="flex justify-center py-12">
          <Button 
            variant="tonal"
            size="lg"
            onClick={() => setPage(prev => prev + 1)}
            className="px-12 shadow-xl shadow-secondary-container/20"
          >
            Load More Series
          </Button>
        </div>
      )}
    </div>
  );
}
