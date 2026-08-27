import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Play, Info, Dices, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Movie } from '@/src/types';
import { Link } from 'react-router-dom';
import { formatRating, formatYear } from '@/src/lib/utils';

interface WatchSpinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const genresList = [
  { id: 'all', label: 'Any Genre' },
  { id: '28', label: 'Action 💥' },
  { id: '35', label: 'Comedy 🍿' },
  { id: '18', label: 'Drama 🎭' },
  { id: '878', label: 'Sci-Fi 🚀' },
  { id: '27', label: 'Horror 👻' },
  { id: '10749', label: 'Romance 💖' },
  { id: '16', label: 'Animation 🎨' },
];

export default function WatchSpinnerModal({ isOpen, onClose }: WatchSpinnerModalProps) {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(7);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Movie | null>(null);

  const handleSpin = async () => {
    setIsSpinning(true);
    setSelectedResult(null);

    try {
      let pool: Movie[] = [];
      if (mediaType === 'movie' || mediaType === 'all') {
        const movies = await tmdbService.getPopularMovies(1);
        pool.push(...movies);
      }
      if (mediaType === 'tv' || mediaType === 'all') {
        const tvs = await tmdbService.getPopularTvShows(1);
        pool.push(...tvs);
      }

      // Filter by genre & rating if applicable
      let filtered = pool.filter(item => (item.vote_average || 0) >= minRating);
      if (selectedGenre !== 'all') {
        const genreId = parseInt(selectedGenre, 10);
        filtered = filtered.filter(item => item.genre_ids?.includes(genreId));
      }

      if (filtered.length === 0) {
        filtered = pool; // fallback
      }

      // Simulate a roulette spin delay for visual hype
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        setSelectedResult(filtered[randomIndex]);
        setIsSpinning(false);
      }, 1200);
    } catch (err) {
      console.error('Spin error:', err);
      setIsSpinning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-surface border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle Glow Header */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-surface-variant/40 hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-all"
          >
            <X size={18} />
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/15 text-primary rounded-2xl shadow-inner">
                <Dices size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-on-surface tracking-tight">
                  What Should I Watch?
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Spin the wheel to pick your next movie or show instantly
                </p>
              </div>
            </div>

            {/* Filter Settings */}
            <div className="space-y-4 pt-2">
              {/* Type Toggle */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2 bg-surface-variant/30 p-1.5 rounded-2xl border border-outline-variant/30">
                  {(['all', 'movie', 'tv'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setMediaType(t)}
                      className={`py-2 text-xs font-bold rounded-xl transition-all capitalize ${
                        mediaType === t
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {t === 'all' ? 'Any' : t === 'movie' ? 'Movies' : 'TV Shows'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Selector */}
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  Vibe / Genre
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {genresList.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGenre(g.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                        selectedGenre === g.id
                          ? 'bg-secondary-container text-on-secondary-container border-primary/50 shadow-sm'
                          : 'bg-surface-variant/20 border-outline-variant/30 text-on-surface-variant hover:border-outline-variant'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Threshold */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Minimum TMDB Rating
                  </label>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> {minRating}.0+
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="9"
                  step="0.5"
                  value={minRating}
                  onChange={e => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-variant rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isSpinning ? 'animate-spin' : ''} />
              <span>{isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel'}</span>
            </button>

            {/* Winner Card Result */}
            {selectedResult && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-surface-variant/40 border border-primary/30 flex gap-4 items-center relative overflow-hidden"
              >
                <div className="w-16 h-24 rounded-xl overflow-hidden shrink-0 bg-surface shadow-md">
                  <img
                    src={getImageUrl(selectedResult.poster_path, 'w185')}
                    alt={selectedResult.title || selectedResult.name || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase">
                      Winner Pick!
                    </span>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      {formatRating(selectedResult.vote_average)}
                    </span>
                  </div>
                  <h4 className="font-bold text-on-surface text-base truncate">
                    {selectedResult.title || selectedResult.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {selectedResult.overview}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Link
                      to={`/${selectedResult.title ? 'movie' : 'tv'}/${selectedResult.id}`}
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1 hover:brightness-110 transition-all"
                    >
                      <Play size={12} fill="currentColor" /> Watch Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
