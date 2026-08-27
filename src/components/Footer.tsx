import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Instagram, Send, Bot, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-12 pt-8 pb-6 bg-surface-variant/30 border-t border-outline/20 rounded-t-[28px] md:rounded-t-[36px] shadow-xl relative overflow-hidden backdrop-blur-md"
    >
      {/* Background Accent Blur */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Community Banner Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-8 rounded-2xl bg-surface/50 border border-outline/15 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <PlayCircle className="text-on-primary" size={18} />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold leading-none block">Aluvantis Community</span>
              <span className="text-sm font-bold text-on-surface">Connect with us on Telegram & Instagram</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a 
              href="https://t.me/Aluvantis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 text-primary hover:bg-primary hover:text-on-primary font-bold transition-all"
            >
              <Send size={13} />
              <span>@Aluvantis</span>
            </a>

            <a 
              href="https://t.me/Aluvantis_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/15 text-secondary hover:bg-secondary hover:text-on-secondary font-bold transition-all"
            >
              <Bot size={13} />
              <span>@Aluvantis_bot</span>
            </a>

            <a 
              href="https://t.me/Aluvantis_admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary/15 text-tertiary hover:bg-tertiary hover:text-on-tertiary font-bold transition-all"
            >
              <ShieldCheck size={13} />
              <span>@Aluvantis_admin</span>
            </a>

            <a 
              href="https://www.instagram.com/aluvantis?igsh=MWI5Z2N3bjdjYnNwYw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/80 border border-outline/20 text-on-surface hover:border-primary font-bold transition-all"
            >
              <Instagram size={13} className="text-tertiary" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Main Links Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-xs text-on-surface-variant">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Aluvantis</span>
              <span className="text-base font-display font-black text-primary">FilmFind</span>
            </Link>
            <p className="text-on-surface-variant/80 leading-relaxed text-[13px]">
              Cinematic discovery hub for trending movies and TV series.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <span className="font-bold text-on-surface text-xs uppercase tracking-wider block mb-2.5">Navigation</span>
            <ul className="space-y-1.5">
              <li><Link to="/home" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
              <li><Link to="/tv" className="hover:text-primary transition-colors">TV Shows</Link></li>
              <li><Link to="/upcoming" className="hover:text-primary transition-colors">Upcoming</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <span className="font-bold text-on-surface text-xs uppercase tracking-wider block mb-2.5">Collections</span>
            <ul className="space-y-1.5">
              <li><Link to="/collections/trending" className="hover:text-primary transition-colors">Trending Now</Link></li>
              <li><Link to="/collections/popular" className="hover:text-primary transition-colors">Popular</Link></li>
              <li><Link to="/collections/top-rated" className="hover:text-primary transition-colors">Top Rated</Link></li>
              <li><Link to="/collections/marvel" className="hover:text-primary transition-colors">Marvel</Link></li>
            </ul>
          </div>

          {/* Legal & Contacts */}
          <div>
            <span className="font-bold text-on-surface text-xs uppercase tracking-wider block mb-2.5">Support & Legal</span>
            <ul className="space-y-1.5">
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA Notice</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Minimal Copyright Bar */}
        <div className="pt-4 border-t border-outline/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-on-surface-variant/70">
          <p>© {new Date().getFullYear()} Aluvantis FilmFind. All rights reserved.</p>
          <div className="flex items-center gap-3 font-medium">
            <a href="https://t.me/Aluvantis" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Telegram</a>
            <span>•</span>
            <a href="https://www.instagram.com/aluvantis?igsh=MWI5Z2N3bjdjYnNwYw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
