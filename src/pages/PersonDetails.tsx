import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Star, Calendar, Info, MapPin, Cake, User, Globe, Share2, Youtube, Film, Tv, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import SEO from '@/src/components/SEO';
import Image from '@/src/components/Image';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import ContentRow from '@/src/components/ContentRow';
import MediaModal from '@/src/components/MediaModal';
import ShareModal from '@/src/components/ShareModal';

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const jsonLd = useMemo(() => {
    if (!person) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": person.name,
      "description": person.biography,
      "image": getImageUrl(person.profile_path, 'h632'),
      "birthDate": person.birthday,
      "birthPlace": {
        "@type": "Place",
        "name": person.place_of_birth
      },
      "jobTitle": person.known_for_department
    };
  }, [person]);

  const galleryImages = useMemo(() => {
    return person?.images?.profiles?.map((img: any, i: number) => ({
      url: getImageUrl(img.file_path, 'h632'),
      id: `person-image-${i}`
    })) || [];
  }, [person]);

  const sortedKnownFor = useMemo(() => {
    if (!person?.combined_credits?.cast) return [];
    return [...person.combined_credits.cast]
      .sort((a: any, b: any) => b.popularity - a.popularity)
      .slice(0, 10);
  }, [person]);

  const sortedTimeline = useMemo(() => {
    if (!person?.combined_credits?.cast) return [];
    return [...person.combined_credits.cast]
      .sort((a: any, b: any) => {
        const dateA = a.release_date || a.first_air_date || '0';
        const dateB = b.release_date || b.first_air_date || '0';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 20);
  }, [person]);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await tmdbService.getPersonDetails(id.trim());
        setPerson(data);
        window.scrollTo(0, 0);
      } catch (error: any) {
        console.error('Error fetching person details for ID:', id, error);
        if (error.response && error.response.status === 404) {
          setPerson(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
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

  if (!person) return <div>Person not found</div>;

  return (
    <div className="space-y-12 pb-24">
      <SEO 
        title={person.name}
        description={person.biography?.slice(0, 160) || `Learn more about ${person.name}`}
        type="profile"
        image={getImageUrl(person.profile_path, 'h632')}
        url={window.location.href}
        jsonLd={jsonLd || undefined}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Column - Profile Image & Info */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[2/3] rounded-[40px] overflow-hidden shadow-2xl border-4 border-surface ring-1 ring-outline-variant/30 relative group cursor-pointer"
            onClick={() => openModal(0)}
          >
            <Image
              src={getImageUrl(person.profile_path, 'h632')}
              alt={person.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
               <Badge variant="tonal" className="w-full bg-white/20 backdrop-blur-md text-white border-none py-2 font-black">
                  {person.known_for_department}
               </Badge>
            </div>
          </motion.div>

          <section className="bg-surface-variant/30 p-6 rounded-3xl border border-outline-variant space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Personal Info</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-on-surface-variant flex items-center gap-2"><User size={14} /> Known For</p>
                  <p className="font-bold">{person.known_for_department}</p>
                </div>
                {person.birthday && (
                  <div>
                    <p className="text-on-surface-variant flex items-center gap-2"><Cake size={14} /> Birthday</p>
                    <p className="font-bold">{person.birthday}</p>
                  </div>
                )}
                {person.place_of_birth && (
                  <div>
                    <p className="text-on-surface-variant flex items-center gap-2"><MapPin size={14} /> Place of Birth</p>
                    <p className="font-bold">{person.place_of_birth}</p>
                  </div>
                )}
                <div>
                  <p className="text-on-surface-variant flex items-center gap-2"><TrendingUp size={14} /> Popularity</p>
                  <p className="font-bold">{person.popularity.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-4">External Links</h3>
              <div className="flex flex-wrap gap-3">
                {person.homepage && (
                  <a href={person.homepage} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface rounded-xl hover:text-primary transition-colors">
                    <Globe size={20} />
                  </a>
                )}
                {person.external_ids?.imdb_id && (
                  <a href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-surface rounded-xl font-bold text-xs hover:text-primary transition-colors">
                    IMDb
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Biography & Credits */}
        <div className="lg:col-span-3 space-y-12">
          <section className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-display font-black tracking-tight leading-tight"
            >
              {person.name}
            </motion.h1>
            
            <div className="flex flex-wrap gap-3">
              {person.also_known_as?.slice(0, 3).map((name: string, i: number) => (
                <Badge key={i} variant="tonal" className="bg-secondary-container/50 backdrop-blur-md">
                  {name}
                </Badge>
              ))}
            </div>

            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Info className="text-primary" /> Biography
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed whitespace-pre-wrap">
                {person.biography || "We don't have a biography for this person."}
              </p>
            </div>
          </section>

          {/* Gallery Section */}
          {galleryImages.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
                <ImageIcon className="text-primary" /> Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {galleryImages.slice(0, 12).map((img: any, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => openModal(index)}
                    className="aspect-[2/3] rounded-2xl overflow-hidden border border-outline-variant shadow-md cursor-pointer group relative"
                  >
                    <Image
                      src={img.url}
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Known For / Credits */}
          {person.combined_credits?.cast?.length > 0 && (
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-black flex items-center gap-3">
                    <Film className="text-primary" /> Known For
                  </h2>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {sortedKnownFor.map((item: any, index: number) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/${item.media_type}/${item.id}`)}
                      >
                        <div className="aspect-[2/3] rounded-3xl overflow-hidden mb-3 border border-outline-variant group-hover:border-primary transition-all shadow-md">
                          <Image
                            src={getImageUrl(item.poster_path, 'w342')}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-xs font-black line-clamp-1 group-hover:text-primary transition-colors">{item.title || item.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">{item.character}</p>
                      </motion.div>
                    ))}
               </div>
            </section>
          )}

          {/* Full Timeline */}
          {person.combined_credits?.cast?.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-display font-black flex items-center gap-3">
                <Calendar className="text-primary" /> Acting Timeline
              </h2>
              <div className="bg-surface-variant/20 rounded-3xl border border-outline-variant overflow-hidden">
                {sortedTimeline.map((item: any, i: number) => (
                    <div 
                      key={`${item.id}-${i}`}
                      className="flex items-center gap-6 p-4 hover:bg-surface-variant/40 transition-colors border-b border-outline-variant/30 last:border-0 cursor-pointer"
                      onClick={() => navigate(`/${item.media_type}/${item.id}`)}
                    >
                      <span className="text-sm font-black text-primary w-12 flex-shrink-0">
                        {item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date).getFullYear() : '—'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.title || item.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">
                          <span className="opacity-60">as</span> {item.character || 'Self'}
                        </p>
                      </div>
                      <Badge variant="tonal" className="text-[10px] uppercase tracking-widest px-2 h-5">
                        {item.media_type}
                      </Badge>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={galleryImages}
        initialIndex={modalInitialIndex}
        title={person.name}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={person.name}
        description={person.biography?.slice(0, 200) + (person.biography?.length > 200 ? '...' : '')}
        url={window.location.href}
        image={getImageUrl(person.profile_path, 'h632')}
      />
    </div>
  );
}
