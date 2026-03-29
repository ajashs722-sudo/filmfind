import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getImageUrl } from '@/src/services/tmdb';
import { cn } from '@/src/lib/utils';
import Image from './Image';

interface PersonCardProps {
  item: any;
  className?: string;
}

const PersonCard = ({ item, className }: PersonCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={cn("group relative flex-shrink-0", className || "w-40 md:w-48")}
    >
      <Link to={`/person/${item.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-[28px] overflow-hidden bg-surface-variant shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 border border-outline-variant/30">
          <Image
            src={getImageUrl(item.profile_path, 'w342')}
            alt={item.name || ''}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        
        <div className="mt-4 px-2">
          <h3 className="text-sm font-display font-bold line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
            {item.name}
          </h3>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1.5">
            {item.known_for_department || 'Actor'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(PersonCard);
