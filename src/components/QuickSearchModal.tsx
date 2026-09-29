import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Film, Tv, User, ArrowRight, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Movie } from '@/src/types';
import { formatRating, formatYear } from '@/src/lib/utils';
import Image from '@/src/components/Image';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await tmdbService.searchMulti(query);
        setResults(data.slice(0, 8));
        setActiveIndex(0);
      } catch (e) {
        console.error('Quick search error:', e);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (item: Movie) => {
    onClose();
    if (item.media_type === 'person') {
      navigate(`/person/${item.id}`);
    } else {
      navigate(`/${item.media_type || 'movie'}/${item.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 md:p-12 bg-black/65 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-surface/90 dark:bg-[#14201F]/90 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.5),0_0_30px_rgba(198,161,91,0.15)] overflow-hidden flex flex-col relative before:absolute before:inset-x-8 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/20 dark:border-white/10 bg-surface-variant/20">
            <Search className="text-primary shrink-0" size={22} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, TV shows, actors, directors..."
              className="w-full bg-transparent text-on-surface text-base sm:text-lg font-medium placeholder:text-on-surface-variant/50 focus:outline-none"
            />
            {loading ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            ) : query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            ) : null}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-variant/50 border border-outline-variant/30 text-[10px] font-mono font-bold text-on-surface-variant shadow-inner">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 divide-y divide-outline-variant/10 scrollbar-none">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const title = item.title || item.name;
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
                const imagePath = item.poster_path || item.profile_path || item.backdrop_path;
                const date = item.release_date || item.first_air_date;
                const isSelected = activeIndex === idx;

                return (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary/15 dark:bg-primary/20 text-on-surface border border-primary/30 shadow-sm' 
                        : 'hover:bg-surface-variant/30 text-on-surface-variant'
                    }`}
                  >
                    <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-xl overflow-hidden bg-surface-variant/40 shrink-0 border border-outline-variant/20 shadow-sm">
                      {imagePath ? (
                        <Image
                          src={getImageUrl(imagePath, 'w185')}
                          alt={title || ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40 bg-surface-variant">
                          <Film size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[9px] font-extrabold uppercase tracking-wider">
                          {mediaType === 'tv' ? 'TV Show' : mediaType === 'person' ? 'Person' : 'Movie'}
                        </span>
                        {item.vote_average ? (
                          <span className="text-[11px] font-bold text-primary flex items-center gap-0.5">
                            <Star size={11} fill="currentColor" />
                            {formatRating(item.vote_average)}
                          </span>
                        ) : null}
                        {date && (
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {formatYear(date)}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-on-surface truncate">
                        {title}
                      </h4>
                      <p className="text-xs text-on-surface-variant/80 line-clamp-1 mt-0.5">
                        {item.overview || item.known_for_department || 'Cinematic title'}
                      </p>
                    </div>

                    <div className="shrink-0 pl-2">
                      <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant opacity-40'}`}>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : query.trim() && !loading ? (
              <div className="py-12 text-center text-on-surface-variant space-y-2">
                <p className="text-sm font-bold text-on-surface">No cinematic matches found</p>
                <p className="text-xs">Try searching for another movie title, actor, or genre</p>
              </div>
            ) : (
              <div className="py-8 px-4 text-center text-on-surface-variant space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Quick Search</p>
                <p className="text-xs text-on-surface-variant/80 max-w-sm mx-auto">
                  Type any film name, television series, or actor to instantly preview and stream.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {['Inception', 'Breaking Bad', 'Interstellar', 'The Dark Knight', 'Stranger Things'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 rounded-full bg-surface-variant/30 hover:bg-primary/20 hover:text-primary border border-outline-variant/20 text-xs font-semibold transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-outline-variant/15 bg-surface-variant/10 flex items-center justify-between text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-3">
              <span>Navigate with <kbd className="px-1.5 py-0.5 rounded bg-surface-variant/50 border border-outline-variant/20 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-surface-variant/50 border border-outline-variant/20 font-mono">↓</kbd></span>
              <span>Open with <kbd className="px-1.5 py-0.5 rounded bg-surface-variant/50 border border-outline-variant/20 font-mono">↵</kbd></span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="text-primary hover:underline font-bold"
            >
              Advanced Search →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
