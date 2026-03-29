import React, { useEffect, useState } from 'react';
import { tmdbService } from '@/src/services/tmdb';
import { Movie } from '@/src/types';
import MovieCard from '@/src/components/MovieCard';
import { Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Upcoming() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await tmdbService.getUpcomingMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
          <Calendar size={28} />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-on-surface">
            Upcoming Releases
          </h1>
          <p className="text-on-surface-variant font-medium mt-1 flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Most anticipated movies coming soon
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8"
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index % 20 * 0.05 }}
            >
              <MovieCard item={movie} type="movie" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
