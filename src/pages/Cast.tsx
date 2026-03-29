import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Users, Star, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import Image from '@/src/components/Image';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/lib/utils';

export default function CastPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !type) return;
      setLoading(true);
      try {
        const [detailsData, creditsData] = await Promise.all([
          type === 'movie' ? tmdbService.getMovieDetails(id) : tmdbService.getTvShowDetails(id),
          type === 'movie' ? tmdbService.getMovieCredits(id) : tmdbService.getTvShowCredits(id)
        ]);
        setDetails(detailsData);
        setCast(creditsData.cast || []);
        setCrew(creditsData.crew || []);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching cast data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  const activeList = useMemo(() => {
    return activeTab === 'cast' ? cast : crew;
  }, [activeTab, cast, crew]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-6">
        <Button 
          variant="text" 
          onClick={() => navigate(-1)}
          className="gap-2 text-on-surface-variant"
        >
          <ChevronLeft size={20} /> Back to {details?.title || details?.name}
        </Button>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 md:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-outline-variant/30 flex-shrink-0">
            <Image
              src={getImageUrl(details?.poster_path, 'w185')}
              alt={details?.title || details?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight">
              Full Cast & Crew
            </h1>
            <p className="text-on-surface-variant text-lg font-medium">
              {details?.title || details?.name} ({formatYear(details?.release_date || details?.first_air_date)})
            </p>
            <div className="flex items-center gap-3">
              <Badge variant="tonal" className="bg-primary/10 text-primary font-black">
                {cast.length} Cast
              </Badge>
              <Badge variant="tonal" className="bg-secondary/10 text-secondary font-black">
                {crew.length} Crew
              </Badge>
              <div className="flex items-center gap-1 text-sm font-bold text-on-surface-variant">
                <Star size={14} className="text-primary" fill="currentColor" />
                {formatRating(details?.vote_average)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-surface-variant/20 rounded-2xl w-fit border border-outline-variant/30">
          <Button 
            variant={activeTab === 'cast' ? 'tonal' : 'text'} 
            onClick={() => setActiveTab('cast')}
            className={cn("rounded-xl px-8", activeTab === 'cast' && "bg-primary text-on-primary")}
          >
            Cast ({cast.length})
          </Button>
          <Button 
            variant={activeTab === 'crew' ? 'tonal' : 'text'} 
            onClick={() => setActiveTab('crew')}
            className={cn("rounded-xl px-8", activeTab === 'crew' && "bg-primary text-on-primary")}
          >
            Crew ({crew.length})
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8"
        >
          {activeList.map((person, index) => (
            <motion.div
              key={`${person.id}-${person.job || person.character}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 20) * 0.05 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/person/${person.id}`)}
            >
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden mb-4 border border-outline-variant group-hover:border-primary transition-all shadow-lg">
                <Image
                  src={getImageUrl(person.profile_path, 'w342')}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                   <Button variant="tonal" size="sm" className="w-full gap-2 bg-white/20 backdrop-blur-md text-white border-none">
                      <Info size={14} /> Details
                   </Button>
                </div>
              </div>
              <div className="space-y-1 px-2">
                <h3 className="font-black text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {person.name}
                </h3>
                <p className="text-[11px] text-on-surface-variant font-bold line-clamp-2 leading-tight">
                  {activeTab === 'cast' ? person.character : person.job}
                </p>
                {activeTab === 'crew' && (
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest">
                    {person.department}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

function formatRating(rating: number = 0) {
  return rating.toFixed(1);
}

function formatYear(date: string = '') {
  return date ? new Date(date).getFullYear() : 'N/A';
}
