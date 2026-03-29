import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, ChevronDown, Film, MonitorPlay, Download, CalendarCheck, Loader2, Star } from 'lucide-react';
import SEO from '@/src/components/SEO';
import { tmdbService, getImageUrl } from '@/src/services/tmdb';
import { Movie } from '@/src/types';

const faqs = [
  {
    question: "What is ARXUN?",
    answer: "ARXUN is a cinematic discovery platform designed for film enthusiasts. We provide a curated gallery of movies and TV shows, allowing you to discover your next favorite story without the clutter of traditional streaming databases."
  },
  {
    question: "How much does ARXUN cost?",
    answer: "The platform is completely free to use. We believe in democratizing cinematic discovery for everyone."
  },
  {
    question: "Where can I watch?",
    answer: "ARXUN helps you discover content and provides information on which streaming services currently offer the titles in your region."
  },
  {
    question: "How do I cancel?",
    answer: "Since ARXUN is free to use with no commitment, there is no subscription to cancel. You can simply stop using the platform at any time."
  }
];

export default function Landing() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        const data = await tmdbService.getTrending('movie', 'day');
        setTrending(data || []);
      } catch (error) {
        console.error("Failed to fetch trending:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const seoKeywords = "watch movies online free 2026, best streaming sites 2026, watch Peaky Blinders The Immortal Man free, new on Netflix March 2026, War Machine movie stream, Project Hail Mary streaming release date, Zootopia 2 Disney Plus date, watch Daredevil Born Again Season 2, best sci-fi movies netflix 2026, where to watch oscar winners 2026, top 10 tv shows streaming today, watch bts the return documentary, hannah montana 20th anniversary stream, free movie database no ads, latest hbo max releases march, watch hamnet movie online, streaming availability tracker 2026, best medical dramas hbo max, watch daredevil born again season 2 free, new trailers on netflix this week, watch something very bad is going to happen, watch bts the comeback live arirang, best new movies on prime video march, where to watch project hail mary in theaters, watch the pitt series hbo, streaming guide march 2026, latest disney plus animation, watch peaky blinders the immortal man in 4k, new movies available to rent march, free streaming trials 2026, app to track movies 2026, free TMDB alternative app, best movie tracker reddit 2026, movie watchlist app for couples, TV show tracker with JustWatch, app to track episodes and movies, Letterboxd alternative with better UI, trakt.tv sync app for android, best aso tools 2026, movie inventory software windows 10, free dvd collection organizer app, app like letterboxd for tv shows, synced movie watchlist for partners, movie recommender ai app, free cinema library tracker, cinopsys movie shows, showly tv tracker github, movie database management software, movie checklist app with barcode, movie organizer deluxe alternative, best software to watch videos 2026, track watched movies app no ads, movie bucket list app free, best movie search assistant, movie database web design templates";

  const featuredMovie = trending[0];
  const displayMovies = trending.slice(1, 7);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden -mt-4 md:-mt-8 -mx-4 md:-mx-8 lg:-mx-10 bg-surface text-on-surface transition-colors duration-300">
      <SEO 
        title="ARXUN - Watch Movies Online Free 2026 & Best Streaming Sites" 
        description="Discover, track, and explore the best movies and TV shows online. Your ultimate 2026 streaming guide for Netflix, Disney Plus, Prime Video, and more." 
        keywords={seoKeywords}
      />
      
      {/* Primary Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-12">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Single Cinematic Background */}
            <div className="absolute inset-0 z-0">
              {featuredMovie && (
                <img 
                  src={getImageUrl(featuredMovie.backdrop_path || featuredMovie.poster_path, 'original')} 
                  alt="Background"
                  className="w-full h-full object-cover brightness-[0.4] dark:brightness-[0.3] scale-105 animate-slow-zoom"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-surface/80 via-transparent to-surface/80 hidden md:block"></div>
            </div>
          </>
        )}

        <div className="relative z-10 max-w-4xl px-6 text-center mt-auto md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 text-white drop-shadow-2xl">
              Unlimited Worlds.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">One Platform.</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              Discover thousands of movies and TV shows from every genre. Curated for the auteur in you. Ready to watch?
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto items-center justify-center">
              <Link to="/home" className="w-full md:w-auto bg-primary text-on-primary font-display font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 uppercase tracking-widest">
                <Play size={20} fill="currentColor" />
                Start Exploring
              </Link>
            </div>
            <p className="mt-6 text-xs text-gray-400 font-sans tracking-widest uppercase font-bold">
              Free For All Discoverers • No Commitment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Trending Now</h2>
            <Link to="/home" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 uppercase tracking-widest">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 pb-6 no-scrollbar snap-x">
              {displayMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link to={`/movie/${movie.id}`} className="flex-none w-40 md:w-auto group cursor-pointer snap-start block">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-surface-container border border-outline-variant/20 shadow-md">
                      <img 
                        src={getImageUrl(movie.poster_path, 'w500')} 
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center gap-1 text-primary mb-1">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-bold text-white">{movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <p className="text-white text-xs line-clamp-2 font-medium">{movie.overview}</p>
                      </div>
                    </div>
                    <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors line-clamp-1 text-on-surface">{movie.title || movie.name}</h3>
                    <p className="font-sans text-xs text-on-surface-variant">{(movie.release_date || movie.first_air_date)?.split('-')[0]}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 md:py-24 px-6 md:px-12 bg-surface-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-black mb-4 tracking-tight text-on-surface">Why Join ARXUN?</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Film, title: "Unlimited Access", desc: "Access to thousands of films and series across all genres and languages without any restrictions." },
              { icon: MonitorPlay, title: "Seamless Streaming", desc: "Watch on your TV, laptop, phone, or tablet. Our platform adapts to any screen size perfectly." },
              { icon: Download, title: "Offline Downloads", desc: "Take your stories with you. Save titles for offline viewing on the go, anywhere in the world." },
              { icon: CalendarCheck, title: "Flexible Plans", desc: "Experience ultimate freedom with no commitments. ARXUN is free to use for cinematic lovers." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-surface p-8 rounded-3xl border border-outline-variant/20 hover:border-primary/40 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-on-surface">{feature.title}</h3>
                <p className="font-sans text-on-surface-variant leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-12 text-center text-on-surface">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/20 transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-display text-lg font-bold text-on-surface">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-primary transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-on-surface-variant font-sans border-t border-outline-variant/20 pt-4 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
