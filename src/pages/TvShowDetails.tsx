import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Star, Calendar, ChevronLeft, Tv, ExternalLink, Youtube, Globe, Info, Share2, Image as ImageIcon, Users, Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { seoService } from '@/src/services/seoService';
import SEO from '@/src/components/SEO';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Cast, Video } from '@/src/types';
import { formatRating, formatYear, cn } from '@/src/lib/utils';
import ContentRow from '@/src/components/ContentRow';
import Image from '@/src/components/Image';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import MediaModal from '@/src/components/MediaModal';
import ShareModal from '@/src/components/ShareModal';

export default function TvShowDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enhancedData, setEnhancedData] = useState<{ description: string, moodTags: string[], keywords?: string } | null>(null);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const contentRating = useMemo(() => {
    if (!show) return '';
    const ratings = show.content_ratings?.results || [];
    const usRating = ratings.find((r: any) => r.iso_3166_1 === 'US') || ratings[0];
    return usRating?.rating || '';
  }, [show]);

  const jsonLd = useMemo(() => {
    if (!show) return null;
    return seoService.generateStructuredData(show, 'tv');
  }, [show]);

  const backdrops = useMemo(() => {
    return show?.images?.backdrops?.slice(0, 12).map((img: any, i: number) => ({
      url: getImageUrl(img.file_path, 'original'),
      id: `gallery-backdrop-${i}`
    })) || [];
  }, [show]);

  const posters = useMemo(() => {
    return show?.images?.posters?.slice(0, 1).map((img: any, i: number) => ({
      url: getImageUrl(img.file_path, 'original'),
      id: `gallery-poster-${i}`
    })) || [];
  }, [show]);

  const galleryImages = useMemo(() => [...posters, ...backdrops], [posters, backdrops]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await tmdbService.getTvShowDetails(id);
        setShow(data);

        // Enhance content with Gemini
        const enhanced = seoService.enhanceContent(data.name, data.overview, data.genres, 'tv', data.first_air_date);
        setEnhancedData(enhanced);
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching TV show details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const openModal = (index: number) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!show) return <div>TV Show not found</div>;

  return (
    <div className="space-y-12 pb-24">
      <SEO 
        title={show.name}
        description={enhancedData?.description || show.overview}
        type="tv"
        image={getImageUrl(show.poster_path, 'w500')}
        url={window.location.href}
        jsonLd={jsonLd || undefined}
        keywords={enhancedData?.keywords}
      />
      <div className="flex items-center justify-between px-2">
        <Button 
          variant="text" 
          onClick={() => navigate(-1)}
          className="gap-2 text-on-surface-variant"
        >
          <ChevronLeft size={20} /> Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="text" 
            size="icon" 
            className="text-on-surface-variant"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </Button>
          <Button variant="text" size="icon" className="text-on-surface-variant">
            <Info size={20} />
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative h-[65vh] rounded-[40px] overflow-hidden shadow-2xl group border border-outline-variant/20">
        <div className="absolute inset-0 cursor-pointer" onClick={() => openModal(posters.length)}>
          <Image
            src={getImageUrl(show.backdrop_path, 'original')}
            alt={show.name || ''}
            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full flex flex-col md:flex-row items-end gap-10 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:block w-56 aspect-[2/3] rounded-[32px] overflow-hidden shadow-2xl border-4 border-surface ring-1 ring-outline-variant/30 cursor-pointer"
            onClick={() => openModal(0)}
          >
            <Image
              src={getImageUrl(show.poster_path, 'w500')}
              alt={show.name || ''}
              className="w-full h-full"
            />
          </motion.div>
          
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-tight">
                {show.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="filled" className="bg-primary text-on-primary gap-1.5 px-4 py-1.5">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{formatRating(show.vote_average)}</span>
                </Badge>
                
                {contentRating && (
                  <Badge variant="outlined" className="border-primary/50 text-primary font-black px-3">
                    {contentRating}
                  </Badge>
                )}
                
                <div className="flex items-center gap-4 text-sm font-bold text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={18} className="text-primary" />
                    <span>{formatYear(show.first_air_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tv size={18} className="text-primary" />
                    <span>{show.number_of_seasons} Seasons</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {show.genres?.map((g: any) => (
                    <Badge key={g.id} variant="tonal" className="bg-secondary-container/50 backdrop-blur-md">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 pt-4"
            >
              <Link to={`/player?id=${show.id}&type=tv${show.external_ids?.imdb_id ? `&imdb=${show.external_ids.imdb_id}` : ''}`}>
                <Button size="lg" className="gap-3 shadow-2xl shadow-primary/30">
                  <Play fill="currentColor" size={24} />
                  Watch Now
                </Button>
              </Link>
              {show.videos?.results?.length > 0 && (
                <Button 
                  variant="tonal" 
                  size="lg" 
                  className="gap-3 backdrop-blur-md bg-white/10 text-white"
                  onClick={() => {
                    document.getElementById('trailers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Youtube size={24} />
                  Trailer
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview & Cast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {show.overview}
            </p>
            {show.tagline && (
              <p className="mt-4 italic text-primary font-medium">"{show.tagline}"</p>
            )}
          </section>

          {/* Videos/Trailers */}
          {show.videos?.results?.length > 0 && (
            <section id="trailers">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Youtube className="text-red-500" /> Trailers & Clips
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {show.videos.results.slice(0, 5).map((video: Video) => (
                  <div key={video.id} className="flex-shrink-0 w-72 space-y-2">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-outline-variant">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        className="w-full h-full"
                        title={video.name}
                        allowFullScreen
                      />
                    </div>
                    <p className="text-xs font-bold line-clamp-1">{video.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cast Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-black flex items-center gap-3">
                <Users className="text-primary" /> Top Cast
              </h2>
              <Link to={`/cast/tv/${show.id}`}>
                <Button variant="text" size="sm" className="text-primary font-black hover:bg-primary/10">
                  View All
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
              {show.credits?.cast?.slice(0, 12).map((person: Cast, index: number) => (
                <motion.div 
                  key={person.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-shrink-0 w-32 group cursor-pointer"
                  onClick={() => navigate(`/person/${person.id}`)}
                >
                  <div className="relative aspect-square rounded-full overflow-hidden mb-3 border-2 border-outline-variant group-hover:border-primary transition-all shadow-lg">
                    <Image
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black line-clamp-1 group-hover:text-primary transition-colors">{person.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">{person.character}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Seasons Section */}
          <section>
            <h2 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
              <Layers className="text-primary" /> Seasons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {show.seasons?.filter((s: any) => s.season_number > 0).map((season: any) => (
                <motion.div 
                  key={season.id} 
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/player?id=${show.id}&type=tv&s=${season.season_number}&e=1`)}
                  className="flex gap-4 p-4 bg-surface-variant/20 rounded-[24px] border border-outline-variant hover:border-primary/50 transition-all group cursor-pointer"
                >
                  <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={getImageUrl(season.poster_path, 'w185')}
                      alt={season.name || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-1">
                    <h3 className="font-black text-lg group-hover:text-primary transition-colors">{season.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="tonal" className="text-[10px] py-0 px-2 h-5">
                        {season.episode_count} Episodes
                      </Badge>
                      <span className="text-xs text-on-surface-variant font-bold">{formatYear(season.air_date)}</span>
                    </div>
                    {season.overview && (
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {season.overview}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Gallery Section */}
          {backdrops.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
                <ImageIcon className="text-primary" /> Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {backdrops.slice(0, 6).map((img: any, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openModal(index + posters.length)}
                    className="aspect-video rounded-2xl overflow-hidden border border-outline-variant shadow-md cursor-pointer group relative"
                  >
                    <Image
                      src={img.url}
                      alt="Backdrop"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {/* Watch Providers */}
          {show['watch/providers']?.results?.US && (
            <section className="bg-surface-variant/30 p-6 rounded-3xl border border-outline-variant space-y-4">
              <h3 className="text-lg font-bold">Where to Watch</h3>
              <div className="flex flex-wrap gap-4">
                {['flatrate', 'rent', 'buy'].map((type) => (
                  show['watch/providers'].results.US[type] && (
                    <div key={type}>
                      <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">{type}</p>
                      <div className="flex gap-2">
                        {show['watch/providers'].results.US[type].map((provider: any) => (
                          <Image
                            key={provider.provider_id}
                            src={getImageUrl(provider.logo_path, 'w92')}
                            alt={provider.provider_name}
                            className="w-10 h-10 rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          <section className="bg-surface-variant/30 p-6 rounded-3xl border border-outline-variant space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Information</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-on-surface-variant">Status</p>
                  <p className="font-bold">{show.status}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Type</p>
                  <p className="font-bold">{show.type}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Original Language</p>
                  <p className="font-bold uppercase">{show.original_language}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Total Seasons</p>
                  <p className="font-bold">{show.number_of_seasons}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Total Episodes</p>
                  <p className="font-bold">{show.number_of_episodes}</p>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-4">External Links</h3>
              <div className="flex flex-wrap gap-3">
                {show.homepage && (
                  <a href={show.homepage} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded-xl hover:text-primary transition-colors">
                    <Globe size={20} />
                  </a>
                )}
                {show.external_ids?.imdb_id && (
                  <a href={`https://www.imdb.com/title/${show.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface rounded-xl font-bold text-xs hover:text-primary transition-colors">
                    IMDb
                  </a>
                )}
              </div>
            </div>

            {/* Networks */}
            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-4">Networks</h3>
              <div className="flex flex-wrap gap-4">
                {show.networks?.map((network: any) => (
                  <div key={network.id} className="flex items-center gap-2">
                    {network.logo_path && (
                      <div className="h-6 bg-white p-1 rounded-md">
                        <img 
                          src={getImageUrl(network.logo_path, 'w92')} 
                          alt={network.name} 
                          className="h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    {!network.logo_path && <span className="text-xs font-medium">{network.name}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            {show.keywords?.results?.length > 0 && (
              <div className="pt-4 border-t border-outline-variant">
                <h3 className="text-sm font-bold mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {show.keywords.results.slice(0, 10).map((keyword: any) => (
                    <Badge key={keyword.id} variant="tonal" className="text-[10px] py-0.5 px-2">
                      {keyword.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Recommendations */}
      <ContentRow 
        title="Recommended for You" 
        items={show.recommendations?.results || []} 
        type="tv" 
      />

      {/* Similar Shows */}
      <ContentRow 
        title="Similar Shows" 
        items={show.similar?.results || []} 
        type="tv" 
      />

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={galleryImages}
        initialIndex={modalInitialIndex}
        title={show.name}
      />

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={show.name}
        description={show.overview}
        url={window.location.href}
        image={getImageUrl(show.poster_path, 'w500')}
      />
    </div>
  );
}
