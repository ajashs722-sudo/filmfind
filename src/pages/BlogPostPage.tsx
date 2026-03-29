import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import SEO from '../components/SEO';
import { Calendar, User, ArrowLeft, Tag, Share2, Check, Play, Info, ExternalLink, Globe, ZoomIn } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { tmdbService, getImageUrl } from '../services/tmdb';
import ContentRow from '../components/ContentRow';
import Image from '../components/Image';
import MediaModal from '../components/MediaModal';
import ShareModal from '../components/ShareModal';
import { Movie } from '../types';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [relatedMedia, setRelatedMedia] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const post = blogPosts.find(p => p.slug === slug);

  const jsonLd = React.useMemo(() => {
    if (!post) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": [post.image],
      "datePublished": post.date,
      "author": [{
        "@type": "Person",
        "name": post.author
      }],
      "description": post.excerpt
    };
  }, [post]);

  const { galleryImages, watchProviders, externalIds } = React.useMemo(() => {
    const backdrops = movieDetails?.images?.backdrops || [];
    const posters = movieDetails?.images?.posters || [];
    const gallery = [...backdrops, ...posters].slice(0, 12);
    const providers = movieDetails?.['watch/providers']?.results?.US?.flatrate || [];
    const extIds = movieDetails?.external_ids || {};
    return { galleryImages: gallery, watchProviders: providers, externalIds: extIds };
  }, [movieDetails]);

  useEffect(() => {
    if (post) {
      const fetchData = async () => {
        try {
          // Fetch main movie details if movieId exists
          if (post.movieId) {
            const details = await tmdbService.getMovieDetails(post.movieId);
            setMovieDetails(details);
          }

          // Fetch related media
          if (post.relatedMediaIds) {
            const results = await Promise.all(
              post.relatedMediaIds.map(id => tmdbService.getMovieDetails(id.toString()))
            );
            setRelatedMedia(results);
          }
        } catch (error) {
          console.error('Error fetching blog post data:', error);
        }
      };
      fetchData();
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-display font-black mb-4">Post Not Found</h1>
        <p className="text-on-surface-variant mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog">
          <Button variant="primary">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <article className="max-w-4xl mx-auto pb-24 px-4">
      <SEO 
        title={post.title}
        description={post.excerpt}
        type="article"
        image={post.image}
        url={window.location.href}
        jsonLd={jsonLd}
      />
      
      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>
      
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
            {post.category}
          </span>
          <div className="h-1 w-1 bg-outline rounded-full" />
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <Calendar size={16} />
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight tracking-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between py-6 border-y border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-on-surface leading-none mb-1">{post.author}</p>
              <p className="text-xs text-on-surface-variant">Author</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full gap-2"
              onClick={handleShare}
            >
              <Share2 size={18} />
              Share
            </Button>
          </div>
        </div>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-video rounded-[32px] overflow-hidden mb-12 shadow-2xl border border-outline-variant/30"
      >
        <Image 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
          type="movie"
        />
      </motion.div>

      {movieDetails && (
        <div className="flex flex-wrap gap-4 mb-12">
          <Link to={`/movie/${movieDetails.id}`} className="flex-1 min-w-[160px]">
            <Button className="w-full gap-2 rounded-2xl py-6 text-lg font-bold shadow-lg shadow-primary/20">
              <Play size={20} fill="currentColor" />
              Watch Now
            </Button>
          </Link>
          <Link to={`/movie/${movieDetails.id}`} className="flex-1 min-w-[160px]">
            <Button variant="outline" className="w-full gap-2 rounded-2xl py-6 text-lg font-bold border-2">
              <Info size={20} />
              Details
            </Button>
          </Link>
        </div>
      )}
      
      <div className="prose prose-lg prose-invert max-w-none mb-12">
        <div 
          className="blog-content text-on-surface-variant leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {galleryImages.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setIsModalOpen(true);
                }}
                className="relative aspect-video rounded-2xl overflow-hidden border border-outline-variant/30 shadow-md cursor-pointer group"
              >
                <Image 
                  src={getImageUrl(img.file_path, 'w780')} 
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          <MediaModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            images={galleryImages.map((img: any) => ({
              url: getImageUrl(img.file_path, 'original'),
              id: img.file_path
            }))}
            initialIndex={selectedImageIndex}
            title={post.title}
          />
        </section>
      )}

      {watchProviders.length > 0 && (
        <section className="mb-16 p-8 bg-surface-variant/20 rounded-[32px] border border-outline-variant/30">
          <h2 className="text-2xl font-display font-bold mb-6">Where to Watch</h2>
          <div className="flex flex-wrap gap-6">
            {watchProviders.map((provider: any) => (
              <div key={provider.provider_id} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                  <Image src={getImageUrl(provider.logo_path, 'w154')} alt={provider.provider_name} />
                </div>
                <span className="text-xs font-medium text-on-surface-variant text-center max-w-[80px]">
                  {provider.provider_name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {movieDetails && (
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6">External Links</h2>
          <div className="flex flex-wrap gap-4">
            {movieDetails.homepage && (
              <a 
                href={movieDetails.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-surface rounded-2xl border border-outline-variant/30 hover:bg-surface-variant/20 transition-colors"
              >
                <Globe size={20} className="text-primary" />
                <span className="font-bold">Official Website</span>
                <ExternalLink size={16} className="opacity-50" />
              </a>
            )}
            {externalIds.imdb_id && (
              <a 
                href={`https://www.imdb.com/title/${externalIds.imdb_id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-surface rounded-2xl border border-outline-variant/30 hover:bg-surface-variant/20 transition-colors"
              >
                <span className="font-black text-primary italic">IMDb</span>
                <span className="font-bold">View on IMDb</span>
                <ExternalLink size={16} className="opacity-50" />
              </a>
            )}
          </div>
        </section>
      )}
      
      <footer className="pt-10 border-t border-outline-variant/30 space-y-12">
        <div className="flex flex-wrap gap-3 items-center">
          <Tag size={20} className="text-primary" />
          {post.tags.map(tag => (
            <span 
              key={tag}
              className="px-4 py-1.5 bg-surface-variant/30 rounded-full text-sm font-medium text-on-surface-variant hover:bg-primary/20 hover:text-primary transition-all cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {relatedMedia.length > 0 && (
          <div className="pt-12">
            <ContentRow 
              title="Related Content" 
              items={relatedMedia} 
              type="movie" 
            />
          </div>
        )}
      </footer>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={post.title}
        description={post.excerpt}
        url={window.location.href}
        image={post.image}
      />
    </article>
  );
}
