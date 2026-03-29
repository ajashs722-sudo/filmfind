import React from 'react';
import { Movie } from '@/src/types';
import MovieCard from './MovieCard';
import { Button } from './ui/Button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentRowProps {
  title: string;
  items: Movie[];
  type?: 'movie' | 'tv';
}

const ContentRow = ({ title, items, type }: ContentRowProps) => {
  if (!items || items.length === 0) return null;

  const viewAllPath = type === 'movie' ? '/movies' : type === 'tv' ? '/tv' : '/';

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-on-surface">
          {title}
        </h2>
        <Link to={viewAllPath}>
          <Button variant="text" size="sm" className="gap-1 group">
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x">
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <MovieCard item={item} type={type} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(ContentRow);
