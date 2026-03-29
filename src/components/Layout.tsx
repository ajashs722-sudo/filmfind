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
  Bell,
  PlayCircle,
  Sun,
  Moon,
  TrendingUp,
  Star,
  Flame,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Footer from './Footer';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/movies', icon: Film, label: 'Movies' },
  { path: '/tv', icon: Tv, label: 'TV Shows' },
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
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'auto';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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
    <div className="min-h-screen bg-background text-on-background flex flex-col lg:flex-row font-sans selection:bg-primary/30 selection:text-primary">
      {/* Desktop Navigation Rail / Drawer */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-outline-variant sticky top-0 h-screen transition-all duration-500 ease-in-out z-30">
        <div className="flex items-center gap-3 px-6 h-20 mb-4">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <PlayCircle className="text-on-primary" size={24} />
          </motion.div>
          <Link to="/welcome" className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold leading-none mb-0.5">Arxun</span>
            <h1 className="text-2xl font-display font-black tracking-tight text-primary leading-none">
              FilmFind
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-[28px] transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container font-bold" 
                  : "hover:bg-surface-variant/40 text-on-surface-variant hover:text-on-surface"
              )}
            >
              <div className="relative z-10">
                <item.icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-500",
                    location.pathname === item.path ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
              </div>
              <span className="text-sm tracking-wide block relative z-10">{item.label}</span>
              
              {/* MD3 Active Indicator Background */}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-secondary-container z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/30 space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-[28px] text-on-surface-variant hover:bg-surface-variant/40 transition-all group"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            <span className="text-sm font-medium block">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <div className="flex items-center gap-3 px-4 py-4 bg-surface-variant/20 rounded-3xl mt-4">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold shadow-sm">
              <User size={20} />
            </div>
            <div className="block overflow-hidden">
              <p className="text-xs font-bold truncate">Guest User</p>
              <p className="text-[10px] text-on-surface-variant truncate">Sign in to sync</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className={cn(
        "lg:hidden flex items-center justify-between p-4 md:px-8 md:py-6 sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-surface/80 backdrop-blur-xl border-b border-outline-variant shadow-sm" : "bg-transparent"
      )}>
        <Link to="/welcome" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <PlayCircle size={20} className="text-on-primary" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold leading-none mb-0.5">Arxun</span>
            <span className="font-display font-black text-xl text-primary tracking-tight leading-none">FilmFind</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link 
            to="/search"
            className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant"
          >
            <Search size={20} />
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-transform active:scale-90"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)' }}
              className="fixed inset-y-0 left-0 z-50 w-[70%] max-w-[400px] bg-surface lg:hidden pt-20 md:pt-24 p-4 md:p-6 flex flex-col overflow-y-auto shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <nav className="space-y-1 md:space-y-2 flex-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-medium transition-all",
                      isActive 
                        ? "bg-secondary-container text-on-secondary-container shadow-md" 
                        : "text-on-surface-variant hover:bg-surface-variant/30"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            
            <div className="p-4 md:p-6 bg-surface-variant/20 rounded-2xl md:rounded-[32px] border border-outline-variant/30 mt-4 md:mt-auto">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-black text-lg md:text-xl">
                  G
                </div>
                <div>
                  <p className="font-bold text-base md:text-lg">Guest User</p>
                  <p className="text-xs md:text-sm text-on-surface-variant">Sign in for more features</p>
                </div>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 md:p-8 lg:p-10 pb-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Footer />
      </main>
    </div>
  );
}
