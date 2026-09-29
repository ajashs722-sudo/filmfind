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
  Compass,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Footer from './Footer';
import QuickSearchModal from './QuickSearchModal';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/movies', icon: Film, label: 'Movies' },
  { path: '/tv', icon: Tv, label: 'TV Shows' },
  { path: '/collections/trending', icon: TrendingUp, label: 'Trending' },
  { path: '/collections/top-rated', icon: Star, label: 'Top Rated' },
  { path: '/upcoming', icon: Calendar, label: 'Upcoming' },
  { path: '/cast-search', icon: User, label: 'Cast' },
  { path: '/blog', icon: BookOpen, label: 'Blog' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const location = useLocation();

  const updateWatchlistCount = useCallback(() => {
    try {
      const saved = localStorage.getItem('aluvantis_watchlist');
      if (saved) {
        const list = JSON.parse(saved);
        setWatchlistCount(Array.isArray(list) ? list.length : 0);
      } else {
        setWatchlistCount(0);
      }
    } catch {
      setWatchlistCount(0);
    }
  }, []);

  useEffect(() => {
    updateWatchlistCount();
    window.addEventListener('storage', updateWatchlistCount);
    // Poll briefly to catch same-tab updates
    const interval = setInterval(updateWatchlistCount, 1500);
    return () => {
      window.removeEventListener('storage', updateWatchlistCount);
      clearInterval(interval);
    };
  }, [updateWatchlistCount]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
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

  // Scroll listener for iOS 26 liquid glass dynamic morphing navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolledNow = window.scrollY > 25;
      setScrolled(isScrolledNow);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme application
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Keyboard shortcut for Cmd+K / / search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans selection:bg-primary/30 selection:text-primary relative overflow-x-hidden">
      
      {/* 
        ══════════════════════════════════════════════════════════════════
        iOS 26 LIQUID GLASS DYNAMIC MORPHING NAVBAR
        - Top of page: Low-blurred crystal liquid glass full-width bar
        - Scrolled: Morphs into a floating iOS 26 liquid glass capsule bar
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="fixed top-0 inset-x-0 z-50 pointer-events-none flex justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <header
          className={cn(
            "pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between relative overflow-hidden",
            scrolled
              ? "w-[94%] max-w-6xl mt-2.5 sm:mt-4 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full sm:rounded-2xl md:rounded-full bg-surface/80 dark:bg-[#14201F]/85 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_16px_45px_rgba(0,0,0,0.42),0_0_24px_rgba(198,161,91,0.12)] ring-1 ring-white/10"
              : "w-full max-w-full px-4 sm:px-8 py-3.5 sm:py-4.5 rounded-none bg-surface/40 dark:bg-[#14201F]/40 backdrop-blur-md border-b border-outline-variant/15 dark:border-white/[0.06] shadow-none"
          )}
        >
          {/* Liquid Glass Top Specular Light Reflection Rim */}
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 dark:via-white/20 to-transparent pointer-events-none" />

          {/* Left: Brand Wordmark & Icon */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link to="/home" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 6 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md",
                  scrolled 
                    ? "w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-primary to-tertiary text-on-primary shadow-primary/20" 
                    : "w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-primary to-tertiary text-on-primary shadow-primary/25"
                )}
              >
                <PlayCircle size={scrolled ? 18 : 20} />
              </motion.div>
              <div className="flex flex-col justify-center">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-on-surface-variant font-extrabold leading-none mb-0.5 group-hover:text-primary transition-colors">
                  Aluvantis
                </span>
                <span className={cn(
                  "font-display font-black tracking-tight text-primary leading-none transition-all duration-300",
                  scrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                )}>
                  FilmFind
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 px-2 py-1 bg-surface-variant/20 dark:bg-black/20 rounded-full border border-outline-variant/15 dark:border-white/5 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative",
                    isActive 
                      ? "text-primary dark:text-primary font-black shadow-sm" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40"
                  )}
                >
                  <Icon size={14} className={isActive ? "text-primary" : "opacity-75"} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-liquid-pill"
                      className="absolute inset-0 bg-primary/15 dark:bg-primary/20 rounded-full border border-primary/30 shadow-inner -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Quick Actions (Spotlight Search, Watchlist, Theme Toggle, Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Quick Search Spotlight Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full transition-all duration-300 border text-xs font-semibold group",
                scrolled
                  ? "bg-surface-variant/30 hover:bg-surface-variant/60 text-on-surface-variant hover:text-on-surface border-outline-variant/20"
                  : "bg-surface-variant/25 hover:bg-surface-variant/50 text-on-surface-variant hover:text-on-surface border-outline-variant/15"
              )}
              title="Search (⌘K)"
            >
              <Search size={15} className="group-hover:text-primary transition-colors text-primary" />
              <span className="hidden md:inline font-medium">Search...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-surface-variant/50 border border-outline-variant/30 text-[9px] font-mono font-bold text-on-surface-variant/80">
                ⌘K
              </kbd>
            </button>

            {/* Watchlist Quick Button with Live Counter */}
            <Link
              to="/watchlist"
              className={cn(
                "relative p-2 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 border flex items-center gap-1.5 text-xs font-bold",
                location.pathname === '/watchlist'
                  ? "bg-primary text-on-primary border-primary shadow-sm shadow-primary/25"
                  : "bg-surface-variant/20 hover:bg-surface-variant/40 text-on-surface-variant hover:text-primary border-outline-variant/20"
              )}
              title="My Watchlist"
            >
              <Bookmark size={16} fill={location.pathname === '/watchlist' ? "currentColor" : "none"} />
              <span className="hidden sm:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-extrabold leading-tight",
                  location.pathname === '/watchlist'
                    ? "bg-on-primary text-primary"
                    : "bg-primary text-on-primary"
                )}>
                  {watchlistCount}
                </span>
              )}
            </Link>

            {/* Theme Switcher Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface-variant/20 hover:bg-surface-variant/40 text-on-surface-variant hover:text-primary border border-outline-variant/20 transition-all active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} className="text-tertiary" /> : <Moon size={17} className="text-primary" />}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
      </div>

      {/* Quick Search Spotlight Modal */}
      <QuickSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Mobile Drawer / Bottom Sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-[70] w-[82%] max-w-[340px] bg-surface/95 dark:bg-[#14201F]/95 backdrop-blur-2xl border-l border-outline-variant/30 lg:hidden p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center text-on-primary font-bold shadow-md shadow-primary/20">
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
                  
                  <NavLink
                    to="/watchlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                      isActive 
                        ? "bg-primary text-on-primary shadow-md shadow-primary/20" 
                        : "text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <Bookmark size={18} />
                      <span>Watchlist</span>
                    </div>
                    {watchlistCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-black">
                        {watchlistCount}
                      </span>
                    )}
                  </NavLink>
                </nav>
              </div>

              <div className="pt-6 border-t border-outline-variant/20 space-y-3">
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-on-surface-variant bg-surface-variant/20 hover:bg-surface-variant/40 border border-outline-variant/20 transition-all text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun size={18} className="text-tertiary" /> : <Moon size={18} className="text-primary" />}
                    <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    Switch
                  </span>
                </button>

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
      <main className="flex-1 min-w-0 relative flex flex-col justify-between pt-20 sm:pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-4 sm:p-6 md:p-8 lg:p-10 pb-12"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        
        <Footer />
      </main>
    </div>
  );
}
