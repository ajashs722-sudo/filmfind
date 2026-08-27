import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Film, 
  Tv, 
  Search, 
  Calendar, 
  Menu, 
  X,
  User,
  PlayCircle,
  Sun,
  Moon,
  TrendingUp,
  Star,
  Flame,
  BookOpen,
  Bookmark,
  Sparkles,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Footer from './Footer';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/movies', icon: Film, label: 'Movies' },
  { path: '/tv', icon: Tv, label: 'TV Shows' },
  { path: '/watchlist', icon: Bookmark, label: 'Watchlist' },
  { path: '/upcoming', icon: Calendar, label: 'Upcoming' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/cast-search', icon: User, label: 'Cast' },
  { path: '/collections/trending', icon: TrendingUp, label: 'Trending' },
  { path: '/collections/top-rated', icon: Star, label: 'Top Rated' },
  { path: '/collections/popular', icon: Flame, label: 'Popular' },
  { path: '/blog', icon: BookOpen, label: 'Blog' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col lg:flex-row font-sans selection:bg-primary/30 selection:text-primary relative overflow-x-hidden">
      
      {/* Desktop Side Navigation Rail */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface/95 backdrop-blur-2xl border-r border-outline-variant/30 sticky top-0 h-screen z-30 shadow-xl transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-20 mb-2">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-gradient-to-tr from-primary to-tertiary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 cursor-pointer"
          >
            <PlayCircle className="text-on-primary" size={24} />
          </motion.div>
          <Link to="/home" className="flex flex-col justify-center group">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold leading-none mb-1 group-hover:text-primary transition-colors">
              Aluvantis
            </span>
            <h1 className="text-2xl font-display font-black tracking-tight text-primary leading-none">
              FilmFind
            </h1>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden font-medium text-sm",
                  isActive 
                    ? "text-on-secondary-container font-bold" 
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30"
                )}
              >
                <div className="relative z-10 flex items-center justify-center">
                  <Icon 
                    size={20} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-primary scale-110" : "group-hover:scale-110 group-hover:text-primary"
                    )} 
                  />
                </div>
                <span className="relative z-10 tracking-wide block">{item.label}</span>
                
                {/* Active Indicator Backdrop */}
                {isActive && (
                  <motion.div 
                    layoutId="desktop-nav-active"
                    className="absolute inset-0 bg-secondary-container/80 backdrop-blur-md rounded-2xl border border-primary/20 z-0 shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions / Theme Toggle */}
        <div className="p-4 border-t border-outline-variant/20 space-y-3 bg-surface/50">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-on-surface-variant bg-surface-variant/20 hover:bg-surface-variant/40 border border-outline-variant/20 transition-all text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun size={18} className="text-tertiary" /> : <Moon size={18} className="text-primary" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              Toggle
            </span>
          </button>

          <div className="flex items-center gap-3 p-3 bg-surface-variant/30 rounded-2xl border border-outline-variant/20">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-on-surface truncate">Aluvantis User</p>
              <p className="text-[10px] text-on-surface-variant truncate">Guest Session</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top App Bar */}
      <header className={cn(
        "lg:hidden flex items-center justify-between px-4 py-3.5 sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b",
        scrolled ? "bg-surface/90 border-outline-variant/30 shadow-lg" : "bg-surface/60 border-transparent"
      )}>
        <Link to="/home" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <PlayCircle size={20} className="text-on-primary" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold leading-none mb-0.5">Aluvantis</span>
            <span className="font-display font-black text-lg text-primary tracking-tight leading-none">FilmFind</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link 
            to="/watchlist"
            className="p-2.5 rounded-full hover:bg-surface-variant/40 text-on-surface-variant hover:text-primary transition-all"
            title="My Watchlist"
          >
            <Bookmark size={20} />
          </Link>
          <Link 
            to="/search"
            className="p-2.5 rounded-full hover:bg-surface-variant/40 text-on-surface-variant hover:text-primary transition-all"
            title="Search"
          >
            <Search size={20} />
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-surface-variant/40 text-on-surface-variant hover:text-primary transition-all"
            title="Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-tertiary" /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-[80%] max-w-[340px] bg-surface border-r border-outline-variant/30 lg:hidden p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
                      <PlayCircle size={22} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold block leading-none">Aluvantis</span>
                      <span className="text-xl font-display font-black text-primary leading-none">FilmFind</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-surface-variant/40 text-on-surface-variant hover:text-on-surface"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                          isActive 
                            ? "bg-primary text-on-primary shadow-md shadow-primary/20" 
                            : "text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface"
                        )}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-outline-variant/20 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-variant/30 border border-outline-variant/20">
                  <div className="w-9 h-9 rounded-xl bg-tertiary/20 text-tertiary flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-on-surface truncate">Aluvantis Community</p>
                    <p className="text-[10px] text-on-surface-variant truncate">@Aluvantis</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 relative flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-4 sm:p-6 md:p-8 lg:p-10 pb-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        
        <Footer />
      </main>
    </div>
  );
}
