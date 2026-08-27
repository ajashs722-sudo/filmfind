import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Film, Play, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '@/src/types';
import SEO from '@/src/components/SEO';
import Image from '@/src/components/Image';
import { getImageUrl } from '@/src/services/tmdb';
import { formatRating, formatYear } from '@/src/lib/utils';
import WatchlistCardExporter from '@/src/components/WatchlistCardExporter';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aluvantis_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (err) {
        console.error('Watchlist parse error:', err);
      }
    }
  }, []);

  const handleRemove = (id: number) => {
    const updated = watchlist.filter(item => item.id !== id);
    setWatchlist(updated);
    localStorage.setItem('aluvantis_watchlist', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all titles from your watchlist?')) {
      setWatchlist([]);
      localStorage.removeItem('aluvantis_watchlist');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <SEO
        title="My Watchlist - Aluvantis FilmFind"
        description="Your personal cinema collection on Aluvantis FilmFind. Save, track, and share your favorite movies and TV shows."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark size={16} /> Saved Cinema
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-on-surface tracking-tight">
            My Watchlist
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved in your local library
          </p>
        </div>

        {watchlist.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-error/10 text-error hover:bg-error/20 font-bold text-xs transition-all self-start sm:self-auto"
          >
            <Trash2 size={16} />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-surface-variant/40 text-primary flex items-center justify-center mx-auto">
            <Bookmark size={32} />
          </div>
          <h3 className="text-xl font-bold text-on-surface">Your Watchlist is Empty</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Explore movies and TV shows across Aluvantis, click the Bookmark button on any title to save it for later!
          </p>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:brightness-110 transition-all shadow-md"
          >
            <Film size={16} /> Explore Trending Titles
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Export Card Box */}
          <WatchlistCardExporter watchlist={watchlist} />

          {/* Grid of Saved Movies */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {watchlist.map(item => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-surface-variant/30 border border-outline-variant/20 overflow-hidden flex flex-col hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="aspect-[2/3] relative overflow-hidden bg-surface-variant">
                  <Image
                    src={getImageUrl(item.poster_path, 'w342')}
                    alt={item.title || item.name || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                      onClick={() => handleRemove(item.id)}
                      title="Remove from Watchlist"
                      className="p-1.5 rounded-full bg-background/80 text-error hover:bg-error hover:text-on-error transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-on-surface text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title || item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium mt-0.5">
                      <span className="flex items-center gap-1 text-primary">
                        <Star size={12} fill="currentColor" />
                        {formatRating(item.vote_average)}
                      </span>
                      <span>•</span>
                      <span>{formatYear(item.release_date || item.first_air_date)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/${item.title ? 'movie' : 'tv'}/${item.id}`}
                    className="w-full py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Play size={12} fill="currentColor" /> Watch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
