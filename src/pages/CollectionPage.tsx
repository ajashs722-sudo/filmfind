import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbService } from '@/src/services/tmdb';
import { seoService } from '@/src/services/seoService';
import SEO from '@/src/components/SEO';
import MovieCard from '@/src/components/MovieCard';
import { motion } from 'motion/react';

export default function CollectionPage() {
  const { type } = useParams<{ type: string }>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enhancedData, setEnhancedData] = useState<{ description: string, moodTags: string[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        let title = '';
        let description = '';

        switch (type) {
          case 'trending':
            data = await tmdbService.getTrending('movie');
            title = 'Trending Movies';
            description = 'Discover the most popular and trending movies right now.';
            break;
          case 'top-rated':
            data = await tmdbService.getTopRatedMovies();
            title = 'Top Rated Movies';
            description = 'Explore the highest-rated movies of all time.';
            break;
          default:
            data = await tmdbService.getPopularMovies();
            title = 'Popular Movies';
            description = 'Check out the most popular movies.';
        }

        setItems(data);
        const enhanced = seoService.enhanceCollection(title, description);
        setEnhancedData(enhanced);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      <SEO 
        title={type ? type.replace('-', ' ') : 'Movies'}
        description={enhancedData?.description || 'Explore our movie collection.'}
        type="website"
        url={window.location.href}
      />
      <div className="px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-display font-black mb-8 capitalize tracking-tight text-on-surface">
          {type?.replace('-', ' ')}
        </h1>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index % 20 * 0.05 }}
            >
              <MovieCard item={item} type="movie" className="w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
