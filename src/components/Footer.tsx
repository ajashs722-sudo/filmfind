import React from 'react';
import { Instagram, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PlayCircle className="text-on-primary" size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold leading-none mb-0.5">Arxun</span>
              <h2 className="text-2xl font-display font-black tracking-tight text-primary leading-none">
                FilmFind
              </h2>
            </div>
          </Link>
          <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
            Your ultimate destination for discovering movies and TV shows. 
            Stay updated with the latest news, reviews, and trending content.
          </p>
          <div className="flex gap-4 mt-8 text-on-surface-variant">
            <a href="https://x.com/arxunFilmfind" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-variant/30 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com/arxunstudio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-variant/30 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-display font-black text-on-surface mb-6 uppercase tracking-wider text-sm">Navigation</h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
            <li><Link to="/tv" className="hover:text-primary transition-colors">TV Shows</Link></li>
            <li><Link to="/upcoming" className="hover:text-primary transition-colors">Coming Soon</Link></li>
            <li><Link to="/blog" className="hover:text-primary transition-colors font-bold text-primary">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-black text-on-surface mb-6 uppercase tracking-wider text-sm">Collections</h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><Link to="/collections/trending" className="hover:text-primary transition-colors">Trending</Link></li>
            <li><Link to="/collections/top-rated" className="hover:text-primary transition-colors">Top Rated</Link></li>
            <li><Link to="/collections/popular" className="hover:text-primary transition-colors">Popular</Link></li>
            <li><Link to="/cast-search" className="hover:text-primary transition-colors">Actors</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-black text-on-surface mb-6 uppercase tracking-wider text-sm">Legal</h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="text-center pt-12 border-t border-outline-variant/30">
        <div className="flex justify-center gap-6 mb-6 text-sm text-on-surface-variant">
          <Link to="/welcome" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link>
        </div>
        <p className="text-on-surface-variant text-sm">
          &copy; {new Date().getFullYear()} FilmFind. All rights reserved.
        </p>
        <p className="text-on-surface-variant/40 text-xs mt-3 flex items-center justify-center gap-1">
          Data provided by <span className="font-bold text-primary">TMDB</span>.
        </p>
      </div>
    </footer>
  );
}
