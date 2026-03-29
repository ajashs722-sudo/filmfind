import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Info, Sparkles, TrendingUp, Star, Calendar, Clock, History, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Movie } from '@/src/types';
import ContentRow from '@/src/components/ContentRow';
import Image from '@/src/components/Image';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { cn, formatRating, formatYear } from '@/src/lib/utils';
import SEO from '@/src/components/SEO';

import { seoService } from '@/src/services/seoService';

export default function Home() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTv, setPopularTv] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('continue_watching');
    if (saved) {
      setContinueWatching(JSON.parse(saved));
    }

    const fetchData = async () => {
      try {
        const [trendingData, popularM, popularT, topR] = await Promise.all([
          tmdbService.getTrending('all'),
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTvShows(),
          tmdbService.getTopRatedMovies(),
        ]);

        setTrending(trendingData);
        setPopularMovies(popularM);
        setPopularTv(popularT);
        setTopRated(topR);
        
        // Pick a random featured item from trending
        if (trendingData.length > 0) {
          setFeatured(trendingData[Math.floor(Math.random() * Math.min(trendingData.length, 5))]);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const topTrending = useMemo(() => trending.slice(0, 7), [trending]);

  const jsonLd = useMemo(() => {
    return seoService.generateStructuredData({}, 'website');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-12">
      <SEO 
        title="FilmFind - Discover Movies & TV Shows"
        description="Your ultimate destination for discovering movies and TV shows. Stay updated with the latest news, reviews, and trending content."
        keywords="movies, tv shows, streaming, filmfind, watch online, cinema, series, trending movies, top rated shows"
        jsonLd={jsonLd}
      />
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[60vh] md:h-[75vh] -mt-4 md:-mt-8 -mx-4 md:-mx-8 lg:-mx-10 mb-12 overflow-hidden group rounded-b-[48px] shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(featured.backdrop_path, 'original')}
              alt={featured.title || featured.name || ''}
              className="w-full h-full object-cover transition-transform duration-[15s] ease-out group-hover:scale-110"
              loading="eager"
            />
            {/* MD3 Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10" />
            
            {/* Ambient Glow */}
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full z-10" />
          </div>

          <div className="absolute bottom-0 left-0 p-6 md:p-16 lg:p-20 w-full max-w-5xl space-y-6 md:space-y-8 z-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 md:space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="filled" className="bg-primary/20 text-primary border border-primary/30 backdrop-blur-xl px-4 py-1.5 rounded-full">
                  <Sparkles size={14} className="mr-2 animate-pulse" />
                  Featured {featured.media_type === 'tv' ? 'Series' : 'Movie'}
                </Badge>
                {featured.vote_average > 0 && (
                  <Badge variant="tonal" className="bg-black/40 text-white backdrop-blur-xl border border-white/10 rounded-full">
                    <Star size={12} className="mr-1.5 fill-yellow-400 text-yellow-400" />
                    {featured.vote_average.toFixed(1)}
                  </Badge>
                )}
                <Badge variant="tonal" className="bg-black/40 text-white backdrop-blur-xl border border-white/10 rounded-full">
                  {formatYear(featured.release_date || featured.first_air_date)}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
                {featured.title || featured.name}
              </h1>
              
              <p className="text-white/80 text-base md:text-xl line-clamp-2 md:line-clamp-3 max-w-2xl leading-relaxed font-medium drop-shadow-lg">
                {featured.overview}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={`/player?id=${featured.id}&type=${featured.media_type || 'movie'}`}>
                <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-2xl gap-3 shadow-2xl shadow-primary/40 group/btn bg-primary text-on-primary hover:scale-105 transition-all">
                  <Play fill="currentColor" size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-black uppercase tracking-tight">Watch Now</span>
                </Button>
              </Link>
              <Link to={`/${featured.media_type || 'movie'}/${featured.id}`}>
                <Button variant="tonal" size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-2xl gap-3 backdrop-blur-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all">
                  <Info size={24} />
                  <span className="text-lg font-bold">Details</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section className="px-4 md:px-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-black flex items-center gap-3">
              <History className="text-primary" /> Continue Watching
            </h2>
            <Button 
              variant="text" 
              size="sm" 
              className="text-primary font-black"
              onClick={() => {
                localStorage.removeItem('continue_watching');
                setContinueWatching([]);
              }}
            >
              Clear All
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {continueWatching.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.season}-${item.episode}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-72 group cursor-pointer"
                onClick={() => navigate(`/player?id=${item.id}&type=${item.type}&s=${item.season}&e=${item.episode}`)}
              >
                <div className="relative aspect-video rounded-[24px] overflow-hidden border border-outline-variant group-hover:border-primary transition-all shadow-lg">
                  <Image
                    src={getImageUrl(item.poster_path, 'w780')}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Button variant="tonal" size="sm" className="w-full gap-2 bg-white/20 backdrop-blur-md border-none text-white">
                      <Play size={16} fill="currentColor" /> Resume
                    </Button>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="tonal" className="bg-black/40 backdrop-blur-md text-white border-none font-black">
                      {item.type === 'tv' ? `S${item.season} E${item.episode}` : 'Movie'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="font-black text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">
                    Watched {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Bento Trending Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-container rounded-2xl flex items-center justify-center text-on-secondary-container shadow-inner">
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight">Trending Now</h2>
              <p className="text-sm text-on-surface-variant font-medium">Most watched content this week</p>
            </div>
          </div>
          <Link to="/movies" className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all">
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {topTrending.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-outline-variant/30",
                index === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"
              )}
            >
              <Link to={`/${item.media_type || 'movie'}/${item.id}`} className="block h-full">
                <Image
                  src={getImageUrl(index === 0 ? item.backdrop_path : item.poster_path, index === 0 ? 'original' : 'w500')}
                  alt={item.title || item.name || ''}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="filled" className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full">
                      {item.media_type?.toUpperCase()}
                    </Badge>
                    <span className="text-white/80 text-[10px] font-bold flex items-center gap-1">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <h3 className={cn(
                    "font-display font-black text-white leading-tight line-clamp-2",
                    index === 0 ? "text-2xl md:text-3xl" : "text-sm md:text-base"
                  )}>
                    {item.title || item.name}
                  </h3>
                </div>

                {/* Rank Number for top 3 */}
                {index < 3 && (
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 z-10">
                    <span className="text-white font-display font-black text-xl italic">#{index + 1}</span>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="space-y-16">
        <ContentRow title="Popular Movies" items={popularMovies} type="movie" />
        <ContentRow title="Popular TV Shows" items={popularTv} type="tv" />
        <ContentRow title="Top Rated Classics" items={topRated} type="movie" />
      </div>
    </div>
  );
}
