import React, { useRef } from 'react';
import { Movie } from '@/src/types';
import MovieCard from './MovieCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ContentRowProps {
  title: string;
  items: Movie[];
  type?: 'movie' | 'tv';
}

const ContentRow = ({ title, items, type }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const viewAllPath = type === 'movie' ? '/movies' : type === 'tv' ? '/tv' : '/';

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-10 space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight text-on-surface flex items-center gap-2">
          <span>{title}</span>
        </h2>

        <div className="flex items-center gap-2">
          {/* Arrow Buttons */}
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-surface-variant/40 hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-all border border-outline-variant/20 active:scale-90"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-surface-variant/40 hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-all border border-outline-variant/20 active:scale-90"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>

          <Link
            to={viewAllPath}
            className="ml-2 text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-all"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
      >
        {items.map((item, idx) => (
          <motion.div
            key={`${item.id}-${idx}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="snap-start"
          >
            <MovieCard item={item} type={type} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(ContentRow);
