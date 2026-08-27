import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie } from '@/src/types';
import { getImageUrl } from '@/src/services/tmdb';
import { cn, formatRating, formatYear } from '@/src/lib/utils';
import Image from './Image';

interface MovieCardProps {
  item: Movie;
  type?: 'movie' | 'tv';
  className?: string;
  key?: React.Key;
}

const MovieCard = ({ item, type, className }: MovieCardProps) => {
  const mediaType = type || item.media_type || 'movie';
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aluvantis_watchlist');
    if (saved) {
      try {
        const list: Movie[] = JSON.parse(saved);
        setIsBookmarked(list.some(m => m.id === item.id));
      } catch (e) {}
    }
  }, [item.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem('aluvantis_watchlist');
    let list: Movie[] = saved ? JSON.parse(saved) : [];

    if (isBookmarked) {
      list = list.filter(m => m.id !== item.id);
      setIsBookmarked(false);
    } else {
      list.push(item);
      setIsBookmarked(true);
    }

    localStorage.setItem('aluvantis_watchlist', JSON.stringify(list));
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn("group relative flex-shrink-0 w-36 sm:w-44 md:w-48 cursor-pointer", className)}
    >
      <Link to={`/${mediaType}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-2xl md:rounded-3xl overflow-hidden bg-surface-variant/40 shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 border border-outline-variant/20">
          <Image
            src={getImageUrl(item.poster_path, 'w342')}
            alt={title || ''}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
          
          {/* Top Rating & Bookmark Pill Row */}
          <div className="absolute top-2.5 right-2.5 left-2.5 z-10 flex items-center justify-between pointer-events-none">
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-primary text-[10px] font-bold flex items-center gap-1 border border-white/10 shadow-sm pointer-events-auto">
              <Star size={10} fill="currentColor" />
              <span>{formatRating(item.vote_average)}</span>
            </div>

            <button
              onClick={toggleBookmark}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={cn(
                "p-1.5 rounded-full backdrop-blur-md transition-all border pointer-events-auto active:scale-90 shadow-sm",
                isBookmarked 
                  ? "bg-primary text-on-primary border-primary" 
                  : "bg-black/50 text-white/90 hover:text-primary border-white/10 hover:bg-black/80"
              )}
            >
              <Bookmark size={12} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Hover Play Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 md:p-4">
            <div className="w-full py-2 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
              <Play size={13} fill="currentColor" />
              <span>Watch Details</span>
            </div>
          </div>
        </div>
        
        {/* Card Metadata */}
        <div className="mt-3 px-1 space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold line-clamp-1 text-on-surface group-hover:text-primary transition-colors tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant">
            <span>{formatYear(date)}</span>
            <span>•</span>
            <span className="uppercase text-primary font-bold">{mediaType === 'movie' ? 'Movie' : 'TV Series'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(MovieCard);
