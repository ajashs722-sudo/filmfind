import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie } from '@/src/types';
import { getImageUrl } from '@/src/services/tmdb';
import { cn, formatRating, formatYear } from '@/src/lib/utils';
import Image from './Image';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

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

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={cn("group relative flex-shrink-0", className || "w-40 md:w-48")}
    >
      <Link to={`/${mediaType}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-[28px] overflow-hidden bg-surface-variant shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 border border-outline-variant/30">
          <Image
            src={getImageUrl(item.poster_path, 'w342')}
            alt={title || ''}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="filled" size="sm" className="bg-surface/80 backdrop-blur-md text-primary gap-1 border border-primary/20">
              <Star size={10} fill="currentColor" />
              <span>{formatRating(item.vote_average)}</span>
            </Badge>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
            <Button size="sm" className="w-full gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Play size={14} fill="currentColor" />
              Details
            </Button>
          </div>
        </div>
        
        <div className="mt-4 px-2">
          <h3 className="text-sm font-display font-bold line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
              {formatYear(date)}
            </span>
            <div className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              {mediaType === 'movie' ? 'Movie' : 'TV Series'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(MovieCard);
