import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Star, Calendar, Clock, ChevronLeft, ExternalLink, Youtube, Globe, Info, Share2, Image as ImageIcon, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { seoService } from '@/src/services/seoService';
import SEO from '@/src/components/SEO';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Movie, Cast, Video } from '@/src/types';
import { formatRating, formatYear, cn } from '@/src/lib/utils';
import ContentRow from '@/src/components/ContentRow';
import Image from '@/src/components/Image';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import MediaModal from '@/src/components/MediaModal';
import ShareModal from '@/src/components/ShareModal';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enhancedData, setEnhancedData] = useState<{ description: string, moodTags: string[], keywords?: string } | null>(null);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const contentRating = useMemo(() => {
    if (!movie) return '';
    const releaseDates = movie.release_dates?.results || [];
    const usRelease = releaseDates.find((r: any) => r.iso_3166_1 === 'US') || releaseDates[0];
    return usRelease?.release_dates?.[0]?.certification || '';
  }, [movie]);

  const jsonLd = useMemo(() => {
    if (!movie) return null;
    return seoService.generateStructuredData(movie, 'movie');
  }, [movie]);

  const backdrops = useMemo(() => {
    return movie?.images?.backdrops?.slice(0, 12).map((img: any, i: number) => ({
      url: getImageUrl(img.file_path, 'original'),
      id: `gallery-backdrop-${i}`
    })) || [];
  }, [movie]);

  const posters = useMemo(() => {
    return movie?.images?.posters?.slice(0, 1).map((img: any, i: number) => ({
      url: getImageUrl(img.file_path, 'original'),
      id: `gallery-poster-${i}`
    })) || [];
  }, [movie]);

  const galleryImages = useMemo(() => [...posters, ...backdrops], [posters, backdrops]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await tmdbService.getMovieDetails(id);
        setMovie(data);
        
        // Enhance content with Gemini
        const enhanced = seoService.enhanceContent(data.title, data.overview, data.genres, 'movie', data.release_date);
        setEnhancedData(enhanced);
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching movie details:', error);
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

  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="space-y-12 pb-24">
      <SEO 
        title={movie.title}
        description={enhancedData?.description || movie.overview}
        type="movie"
        image={getImageUrl(movie.poster_path, 'w500')}
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
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title || ''}
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
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title || ''}
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
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="filled" className="bg-primary text-on-primary gap-1.5 px-4 py-1.5">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{formatRating(movie.vote_average)}</span>
                </Badge>
                
                {contentRating && (
                  <Badge variant="outlined" className="border-primary/50 text-primary font-black px-3">
                    {contentRating}
                  </Badge>
                )}
                
                <div className="flex items-center gap-4 text-sm font-bold text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={18} className="text-primary" />
                    <span>{formatYear(movie.release_date)}</span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={18} className="text-primary" />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((g: any) => (
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
              <Link to={`/player?id=${movie.id}&type=movie${movie.external_ids?.imdb_id ? `&imdb=${movie.external_ids.imdb_id}` : ''}`}>
                <Button size="lg" className="gap-3 shadow-2xl shadow-primary/30">
                  <Play fill="currentColor" size={24} />
                  Watch Movie
                </Button>
              </Link>
              {movie.videos?.results?.length > 0 && (
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
              {movie.overview}
            </p>
            {movie.tagline && (
              <p className="mt-4 italic text-primary font-medium">"{movie.tagline}"</p>
            )}
          </section>

          {/* Videos/Trailers */}
          {movie.videos?.results?.length > 0 && (
            <section id="trailers">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Youtube className="text-red-500" /> Trailers & Clips
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {movie.videos.results.slice(0, 5).map((video: Video) => (
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
              <Link to={`/cast/movie/${movie.id}`}>
                <Button variant="text" size="sm" className="text-primary font-black hover:bg-primary/10">
                  View All
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
              {movie.credits?.cast?.slice(0, 12).map((person: Cast, index: number) => (
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
          {movie['watch/providers']?.results?.US && (
            <section className="bg-surface-variant/30 p-6 rounded-3xl border border-outline-variant space-y-4">
              <h3 className="text-lg font-bold">Where to Watch</h3>
              <div className="flex flex-wrap gap-4">
                {['flatrate', 'rent', 'buy'].map((type) => (
                  movie['watch/providers'].results.US[type] && (
                    <div key={type}>
                      <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">{type}</p>
                      <div className="flex gap-2">
                        {movie['watch/providers'].results.US[type].map((provider: any) => (
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
                  <p className="font-bold">{movie.status}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Original Language</p>
                  <p className="font-bold uppercase">{movie.original_language}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Budget</p>
                  <p className="font-bold">${movie.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Revenue</p>
                  <p className="font-bold">${movie.revenue?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-4">External Links</h3>
              <div className="flex flex-wrap gap-3">
                {movie.homepage && (
                  <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded-xl hover:text-primary transition-colors">
                    <Globe size={20} />
                  </a>
                )}
                {movie.external_ids?.imdb_id && (
                  <a href={`https://www.imdb.com/title/${movie.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface rounded-xl font-bold text-xs hover:text-primary transition-colors">
                    IMDb
                  </a>
                )}
              </div>
            </div>

            {/* Production Companies */}
            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-4">Production</h3>
              <div className="flex flex-wrap gap-4">
                {movie.production_companies?.slice(0, 3).map((company: any) => (
                  <div key={company.id} className="flex items-center gap-2">
                    {company.logo_path && (
                      <div className="w-8 h-8 bg-white p-1 rounded-lg">
                        <img 
                          src={getImageUrl(company.logo_path, 'w92')} 
                          alt={company.name} 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <span className="text-xs font-medium">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            {movie.keywords?.keywords?.length > 0 && (
              <div className="pt-4 border-t border-outline-variant">
                <h3 className="text-sm font-bold mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.keywords.keywords.slice(0, 10).map((keyword: any) => (
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
        items={movie.recommendations?.results || []} 
        type="movie" 
      />

      {/* Similar Movies */}
      <ContentRow 
        title="Similar Movies" 
        items={movie.similar?.results || []} 
        type="movie" 
      />

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={galleryImages}
        initialIndex={modalInitialIndex}
        title={movie.title}
      />

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={movie.title}
        description={movie.overview}
        url={window.location.href}
        image={getImageUrl(movie.poster_path, 'w500')}
      />
    </div>
  );
}
