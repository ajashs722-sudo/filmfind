import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Info, Sparkles, TrendingUp, Star, History, Dices, ChevronRight, ChevronLeft, Film, Compass, Tv, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Movie } from '@/src/types';
import ContentRow from '@/src/components/ContentRow';
import Image from '@/src/components/Image';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { cn, formatRating, formatYear } from '@/src/lib/utils';
import SEO from '@/src/components/SEO';
import WatchSpinnerModal from '@/src/components/WatchSpinnerModal';
import ProviderFilter from '@/src/components/ProviderFilter';
import MoodPicker from '@/src/components/MoodPicker';
import { seoService } from '@/src/services/seoService';

const LOADING_STEPS = [
  "Opening Cinematic Portals...",
  "Curating Personalized Reels...",
  "Assembling Star Casts...",
  "Preparing the Stage..."
];

export default function Home() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTv, setPopularTv] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [heroItems, setHeroItems] = useState<Movie[]>([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('all');

  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Rotate loading sub-labels for dotdev aesthetic loading feel
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStepIdx(prev => (prev + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const saved = localStorage.getItem('continue_watching');
    if (saved) {
      try {
        setContinueWatching(JSON.parse(saved));
      } catch (e) {}
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
        
        if (trendingData.length > 0) {
          setHeroItems(trendingData.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        // Smooth transition out of loading
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchData();
  }, []);

  // GSAP animations for active slides (Cinematic fade & slide reveals)
  const triggerSlideAnimations = useCallback(() => {
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current.querySelectorAll('.hero-anim-item'),
        { opacity: 0, y: 35, scale: 0.96 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.85, 
          stagger: 0.12, 
          ease: 'power4.out',
          overwrite: 'auto'
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!loading && heroItems.length > 0) {
      triggerSlideAnimations();
    }
  }, [loading, activeHeroIndex, heroItems.length, triggerSlideAnimations]);

  // Infinite slow rotation of slider
  useEffect(() => {
    if (heroItems.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % heroItems.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [heroItems]);

  const featured = heroItems[activeHeroIndex] || null;
  const topTrending = useMemo(() => trending.slice(0, 6), [trending]);

  const jsonLd = useMemo(() => {
    return seoService.generateStructuredData({}, 'website');
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <Play size={14} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary animate-pulse">
            Aluvantis FilmFind
          </h3>
          <p className="text-xs font-semibold text-on-surface-variant transition-all duration-500">
            {LOADING_STEPS[loadingStepIdx]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      <SEO 
        title="FilmFind - Discover Movies & TV Shows"
        description="Your ultimate destination for discovering movies and TV shows. Stay updated with the latest news, reviews, and trending content."
        keywords="movies, tv shows, streaming, filmfind, watch online, cinema, series, trending movies, top rated shows"
        jsonLd={jsonLd}
      />

      {/* Spectacular Centered Cinematic Hero Section ("Zeter Hero") */}
      {featured && (
        <section className="relative h-[70vh] md:h-[80vh] min-h-[520px] -mt-4 md:-mt-8 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 rounded-b-[40px] md:rounded-b-[60px] overflow-hidden bg-black border-b border-outline-variant/35 shadow-2xl">
          
          {/* Symmetrical Parallax Background Backdrop */}
          <div className="absolute inset-0" ref={heroImageRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.95, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={getImageUrl(featured.backdrop_path, 'original')}
                  alt={featured.title || featured.name || ''}
                  className="w-full h-full object-cover opacity-60"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>

            {/* Premium Radial Vignette and Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/80" />
          </div>

          {/* Symmetrical Centered Content Layer */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-24 z-20 space-y-6 max-w-5xl mx-auto" ref={heroTextRef}>
            
            {/* Top Badges */}
            <div className="hero-anim-item flex flex-wrap items-center justify-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-primary/25 backdrop-blur-xl text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/35 flex items-center gap-1.5 shadow-md">
                <Sparkles size={11} className="animate-pulse text-tertiary" />
                Curated Pick
              </span>
              {featured.vote_average > 0 && (
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl text-white text-[10px] font-extrabold flex items-center gap-1 border border-white/10 shadow-sm">
                  <Star size={11} fill="#C6A15B" className="text-primary" />
                  {featured.vote_average.toFixed(1)} TMDB
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl text-white/90 text-[10px] font-bold border border-white/10 shadow-sm uppercase tracking-wider">
                {featured.media_type === 'tv' ? 'TV Series' : 'Blockbuster'}
              </span>
            </div>

            {/* Symmetrical Large Title */}
            <h1 className="hero-anim-item text-4xl sm:text-6xl md:text-7xl font-display font-black leading-[1.05] tracking-tight text-white drop-shadow-xl max-w-4xl">
              {featured.title || featured.name}
            </h1>

            {/* Centered Overview */}
            <p className="hero-anim-item text-white/80 text-sm sm:text-base md:text-lg line-clamp-2 md:line-clamp-3 max-w-3xl leading-relaxed font-medium drop-shadow-md">
              {featured.overview}
            </p>

            {/* Premium Styled Buttons with proper icons */}
            <div className="hero-anim-item flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <Link to={`/player?id=${featured.id}&type=${featured.media_type || 'movie'}`}>
                <Button 
                  variant="filled" 
                  size="lg" 
                  className="gap-3 shadow-xl shadow-primary/20 group hover:brightness-110 active:scale-95 transition-all text-sm font-black tracking-wide"
                >
                  <Play fill="currentColor" size={18} className="transition-transform group-hover:scale-110" />
                  <span>Start Watching</span>
                </Button>
              </Link>

              <Link to={`/${featured.media_type || 'movie'}/${featured.id}`}>
                <Button 
                  variant="tonal" 
                  size="lg" 
                  className="gap-2.5 backdrop-blur-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 transition-all text-sm font-bold"
                >
                  <Info size={18} />
                  <span>Explore Details</span>
                </Button>
              </Link>

              <Button
                variant="outlined"
                size="lg"
                onClick={() => setIsSpinnerOpen(true)}
                className="gap-2.5 backdrop-blur-2xl bg-surface/40 hover:bg-surface/70 border-outline/30 hover:border-primary text-on-surface text-sm font-bold active:scale-95 transition-all"
              >
                <Dices size={18} className="text-primary" />
                <span>Decision Wheel 🎲</span>
              </Button>
            </div>
          </div>


        </section>
      )}

      {/* Watch Spinner Modal */}
      <WatchSpinnerModal
        isOpen={isSpinnerOpen}
        onClose={() => setIsSpinnerOpen(false)}
      />

      {/* Interactive MD3 Provider Filter Bar */}
      <section className="px-1">
        <ProviderFilter
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
        />
      </section>

      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl sm:text-2xl font-display font-black text-on-surface flex items-center gap-2.5">
              <History className="text-primary" size={22} />
              <span>Continue Watching</span>
            </h2>
            <button 
              className="text-xs font-bold text-error hover:underline transition-colors"
              onClick={() => {
                localStorage.removeItem('continue_watching');
                setContinueWatching([]);
              }}
            >
              Clear Records
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {continueWatching.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.season}-${item.episode}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className="flex-shrink-0 w-64 sm:w-72 group cursor-pointer"
                onClick={() => navigate(`/player?id=${item.id}&type=${item.type}&s=${item.season}&e=${item.episode}`)}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-outline-variant/30 group-hover:border-primary transition-all shadow-md bg-surface-variant">
                  <Image
                    src={getImageUrl(item.poster_path, 'w780')}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-primary text-on-primary shadow-lg">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold">
                      {item.type === 'tv' ? `S${item.season} E${item.episode}` : 'Movie'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 px-1">
                  <h3 className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    Watched {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Bento Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/15 text-primary rounded-xl flex items-center justify-center font-bold">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-on-surface tracking-tight">
                Trending Box Office
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">Most popular releases right now</p>
            </div>
          </div>

          <Link to="/movies" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
          {topTrending.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-outline-variant/30 bg-surface-variant/30",
                index === 0 ? "col-span-2 row-span-2" : "col-span-1"
              )}
            >
              <Link to={`/${item.media_type || 'movie'}/${item.id}`} className="block h-full">
                <Image
                  src={getImageUrl(index === 0 ? item.backdrop_path : item.poster_path, index === 0 ? 'original' : 'w500')}
                  alt={item.title || item.name || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 p-3.5 sm:p-5 w-full z-10 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[9px] font-extrabold uppercase tracking-wider">
                      {item.media_type?.toUpperCase()}
                    </span>
                    <span className="text-white text-[10px] font-bold flex items-center gap-0.5">
                      <Star size={10} fill="#C6A15B" className="text-primary" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <h3 className={cn(
                    "font-display font-black text-white leading-tight line-clamp-1",
                    index === 0 ? "text-xl sm:text-2xl md:text-3xl" : "text-xs sm:text-sm"
                  )}>
                    {item.title || item.name}
                  </h3>
                </div>

                {index < 3 && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white font-bold text-xs border border-white/15">
                    #{index + 1}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mood & Vibe Picker */}
      <section className="pt-4">
        <MoodPicker allMovies={trending} />
      </section>

      {/* Content Rows */}
      <div className="space-y-10">
        <ContentRow title="Popular Movies" items={popularMovies} type="movie" />
        <ContentRow title="Popular TV Shows" items={popularTv} type="tv" />
        <ContentRow title="Top Rated Classics" items={topRated} type="movie" />
      </div>
    </div>
  );
}
