import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Info, 
  Server, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  Settings,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  SkipForward,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tmdbService } from '@/src/services/tmdb';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import ContentRow from '@/src/components/ContentRow';
import { cn } from '@/src/lib/utils';

const SERVERS = [
  { id: 'vidsrc', name: 'VidSrc.to', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://vidsrc.to/embed/movie/${imdb || id}` : `https://vidsrc.to/embed/tv/${imdb || id}/${s}/${e}` 
  },
  { id: 'vidsrcpro', name: 'VidSrc.pro', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://vidsrc.pro/embed/movie/${imdb || id}` : `https://vidsrc.pro/embed/tv/${imdb || id}/${s}/${e}` 
  },
  { id: 'vidsrcme', name: 'VidSrc.me', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://vidsrc.me/embed/movie?tmdb=${id}${imdb ? `&imdb=${imdb}` : ''}` : `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}${imdb ? `&imdb=${imdb}` : ''}` 
  },
  { id: 'vidsrcin', name: 'VidSrc.in', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://vidsrc.in/embed/movie/${imdb || id}` : `https://vidsrc.in/embed/tv/${imdb || id}/${s}/${e}` 
  },
  { id: '2embed', name: '2Embed', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://www.2embed.cc/embed/movie?tmdb=${id}${imdb ? `&imdb=${imdb}` : ''}` : `https://www.2embed.cc/embed/tv?tmdb=${id}&s=${s}&e=${e}${imdb ? `&imdb=${imdb}` : ''}` 
  },
  { id: 'embedsu', name: 'Embed.su', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://embed.su/embed/movie/${imdb || id}` : `https://embed.su/embed/tv/${imdb || id}/${s}/${e}` 
  },
  { id: 'smashy', name: 'SmashyStream', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://embed.smashystream.com/playere.php?tmdb=${id}${imdb ? `&imdb=${imdb}` : ''}` : `https://embed.smashystream.com/playere.php?tmdb=${id}&s=${s}&e=${e}${imdb ? `&imdb=${imdb}` : ''}` 
  },
  { id: 'multiembed', name: 'MultiEmbed', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://multiembed.mov/?video_id=${imdb || id}&tmdb=1` : `https://multiembed.mov/?video_id=${imdb || id}&tmdb=1&s=${s}&e=${e}` 
  },
  { id: 'moviesapi', name: 'MoviesAPI', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://moviesapi.club/movie/${imdb || id}` : `https://moviesapi.club/tv/${imdb || id}-${s}-${e}` 
  },
  { id: 'autoembed', name: 'AutoEmbed', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://player.autoembed.cc/embed/movie/${imdb || id}` : `https://player.autoembed.cc/embed/tv/${imdb || id}/${s}/${e}` 
  },
  { id: 'blackvid', name: 'BlackVid', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://blackvid.space/embed?tmdb=${id}${imdb ? `&imdb=${imdb}` : ''}` : `https://blackvid.space/embed?tmdb=${id}&season=${s}&episode=${e}${imdb ? `&imdb=${imdb}` : ''}` 
  },
  { id: 'showbox', name: 'ShowBox', url: (id: string, type: string, s?: string, e?: string, imdb?: string) => 
    type === 'movie' ? `https://www.showbox.media/video-player?tmdb=${id}${imdb ? `&imdb=${imdb}` : ''}` : `https://www.showbox.media/video-player?tmdb=${id}&season=${s}&episode=${e}${imdb ? `&imdb=${imdb}` : ''}` 
  },
];

export default function Player() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';
  const season = searchParams.get('s') || '1';
  const episode = searchParams.get('e') || '1';
  const imdb = searchParams.get('imdb') || undefined;
  
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [details, setDetails] = useState<any>(null);
  const [failedServers, setFailedServers] = useState<Set<string>>(new Set());
  const [serverStats, setServerStats] = useState<Record<string, { success: number, failure: number }>>(() => {
    const saved = localStorage.getItem('server_stats');
    return saved ? JSON.parse(saved) : {};
  });
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const [seasonData, setSeasonData] = useState<any>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [triedCount, setTriedCount] = useState(0);

  // Save progress
  useEffect(() => {
    if (id && details) {
      const progress = JSON.parse(localStorage.getItem('continue_watching') || '[]');
      const newItem = {
        id,
        type,
        season,
        episode,
        title: details.title || details.name,
        poster_path: details.poster_path,
        timestamp: Date.now()
      };
      
      const filtered = progress.filter((item: any) => item.id !== id);
      const updated = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem('continue_watching', JSON.stringify(updated));
    }
  }, [id, type, season, episode, details]);

  const sortedServers = React.useMemo(() => {
    return [...SERVERS].sort((a, b) => {
      const statsA = serverStats[a.id] || { success: 0, failure: 0 };
      const statsB = serverStats[b.id] || { success: 0, failure: 0 };
      
      const ratioA = statsA.success / (statsA.success + statsA.failure || 1);
      const ratioB = statsB.success / (statsB.success + statsB.failure || 1);
      
      if (ratioA !== ratioB) return ratioB - ratioA;
      return statsB.success - statsA.success;
    });
  }, [serverStats]);

  const currentServer = sortedServers[currentServerIndex];
  const totalServers = sortedServers.length;

  const handleNextServer = useCallback(() => {
    const serverId = currentServer.id;
    setFailedServers(prev => new Set(prev).add(serverId));
    
    // Update stats
    setServerStats(prev => {
      const newStats = {
        ...prev,
        [serverId]: {
          success: prev[serverId]?.success || 0,
          failure: (prev[serverId]?.failure || 0) + 1
        }
      };
      localStorage.setItem('server_stats', JSON.stringify(newStats));
      return newStats;
    });

    const nextIndex = (currentServerIndex + 1) % sortedServers.length;
    
    // If we've tried all servers, show a final error
    if (failedServers.size >= sortedServers.length - 1) {
      setShowErrorOverlay(true);
      return;
    }

    setCurrentServerIndex(nextIndex);
    setTriedCount(prev => prev + 1);
    setIsIframeLoading(true);
    setShowErrorOverlay(false);
  }, [currentServerIndex, currentServer.id, failedServers.size, sortedServers.length]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = type === 'movie' 
          ? await tmdbService.getMovieDetails(id) 
          : await tmdbService.getTvShowDetails(id);
        setDetails(data);
        if (type === 'tv' && data.seasons) {
          setSeasons(data.seasons.filter((s: any) => s.season_number > 0));
        }
      } catch (error) {
        console.error('Error fetching details for player:', error);
      }
    };
    fetchDetails();
  }, [id, type]);

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (type === 'tv' && id && season) {
        try {
          const data = await tmdbService.getTvSeasonDetails(id, season);
          setSeasonData(data);
        } catch (error) {
          console.error('Error fetching season details:', error);
        }
      }
    };
    fetchSeasonDetails();
  }, [id, type, season]);

  useEffect(() => {
    // Reset loading state when server changes
    setIsIframeLoading(true);
    setShowErrorOverlay(false);

    // Set a timeout to show error overlay if iframe takes too long (15s)
    const timeout = setTimeout(() => {
      setShowErrorOverlay(true);
    }, 15000);

    setLoadTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentServerIndex]);

  const handleIframeLoad = useCallback(() => {
    setIsIframeLoading(false);
    if (loadTimeout) clearTimeout(loadTimeout);

    // Update success stats
    const serverId = currentServer.id;
    setServerStats(prev => {
      const newStats = {
        ...prev,
        [serverId]: {
          success: (prev[serverId]?.success || 0) + 1,
          failure: prev[serverId]?.failure || 0
        }
      };
      localStorage.setItem('server_stats', JSON.stringify(newStats));
      return newStats;
    });
  }, [currentServer.id, loadTimeout]);

  if (!id) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
      <AlertCircle size={64} className="text-error mb-4" />
      <h2 className="text-2xl font-bold mb-2">Invalid Content ID</h2>
      <p className="text-on-surface-variant mb-6">We couldn't find the content you're looking for.</p>
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-64px)] -m-4 md:-m-8 bg-background overflow-hidden">
      {/* Player Header - MD3 Top App Bar style */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-surface-variant/50 rounded-full transition-all active:scale-90"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="font-display font-black text-base md:text-lg line-clamp-1 max-w-[180px] md:max-w-xl tracking-tight">
              {details?.title || details?.name || 'Loading...'}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="tonal" className="text-[10px] py-0 px-2 h-4.5 bg-primary/10 text-primary border-none font-black uppercase tracking-widest">
                {type.toUpperCase()}
              </Badge>
              <div className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${failedServers.has(currentServer.id) ? 'bg-error shadow-[0_0_8px_rgba(255,68,68,0.5)]' : 'bg-success shadow-[0_0_8px_rgba(76,175,80,0.5)] animate-pulse'}`} />
                {currentServer.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {type === 'tv' && seasonData?.episodes && (
            <Button 
              variant="tonal" 
              size="sm" 
              className="hidden md:flex gap-2 bg-primary/10 text-primary border-none"
              onClick={() => {
                const nextEp = parseInt(episode) + 1;
                const hasNext = seasonData.episodes.some((e: any) => e.episode_number === nextEp);
                if (hasNext) {
                  navigate(`/player?id=${id}&type=tv&s=${season}&e=${nextEp}`);
                } else {
                  const nextSeason = parseInt(season) + 1;
                  const hasNextSeason = seasons.some((s: any) => s.season_number === nextSeason);
                  if (hasNextSeason) {
                    navigate(`/player?id=${id}&type=tv&s=${nextSeason}&e=1`);
                  }
                }
              }}
            >
              <SkipForward size={18} /> Next Episode
            </Button>
          )}
          
          <div className="hidden xl:flex items-center gap-2 bg-surface-variant/20 p-2 rounded-full border border-outline-variant/30">
            {sortedServers.map((server, index) => {
              const stats = serverStats[server.id] || { success: 0, failure: 0 };
              const isFailed = failedServers.has(server.id);
              const isActive = currentServer.id === server.id;
              
              return (
                <button
                  key={server.id}
                  onClick={() => {
                    setCurrentServerIndex(index);
                    setIsIframeLoading(true);
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border-2",
                    isActive 
                      ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105" 
                      : isFailed
                      ? "bg-error/10 text-error border-error/20 opacity-50 grayscale"
                      : "hover:bg-surface-variant/60 text-on-surface-variant border-transparent hover:border-outline-variant"
                  )}
                >
                  {isFailed ? (
                    <XCircle size={14} className="text-error" />
                  ) : isActive ? (
                    <CheckCircle2 size={14} className="text-on-primary" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                  )}
                  <span>{server.name}</span>
                  {stats.success > 0 && !isFailed && (
                    <span className={cn(
                      "ml-1 px-1.5 py-0.5 rounded-md text-[8px] font-black",
                      isActive ? "bg-on-primary/20 text-on-primary" : "bg-primary/10 text-primary"
                    )}>
                      {stats.success}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
        </div>
      </header>

      {/* Main Player Area */}
      <main className="flex-1 bg-black relative flex flex-col overflow-y-auto">
        <div className="relative w-full aspect-video md:aspect-auto md:flex-1 min-h-[240px] md:min-h-0 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            {isIframeLoading && !showErrorOverlay && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <Play size={24} className="absolute inset-0 m-auto text-primary animate-pulse" />
                </div>
                <p className="mt-6 text-sm font-medium text-white/60 tracking-widest uppercase">Initializing Stream...</p>
                <p className="mt-2 text-[10px] text-white/40">Connecting to {currentServer.name}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <iframe
            key={`${currentServer.id}-${id}-${season}-${episode}-${imdb}`}
            src={currentServer.url(id!, type, season, episode, imdb)}
            className={`w-full h-full transition-opacity duration-700 ${isIframeLoading ? 'opacity-0' : 'opacity-100'}`}
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            onLoad={handleIframeLoad}
          />

          {/* Error/Slow Load Overlay */}
          <AnimatePresence>
            {showErrorOverlay && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
              >
                <div className="max-w-md w-full bg-surface p-8 rounded-[32px] border border-outline-variant shadow-2xl text-center space-y-6">
                  <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert size={32} />
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-2">Playback Issue Detected</h2>
                    <p className="text-sm text-on-surface-variant">
                      The current server (<span className="font-bold text-on-surface">{currentServer.name}</span>) is taking too long to respond or might be offline.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Badge variant="tonal" className="bg-surface-variant text-[10px] font-black">
                        TRIED {triedCount + 1} OF {totalServers} SERVERS
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full h-14 rounded-2xl font-bold text-base"
                      onClick={handleNextServer}
                    >
                      Try Next Server <ArrowRight size={20} className="ml-2" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-14 rounded-2xl font-bold text-base"
                      onClick={() => {
                        setIsIframeLoading(true);
                        setShowErrorOverlay(false);
                        // Refresh current iframe by toggling loading
                        setTimeout(() => setIsIframeLoading(false), 100);
                      }}
                    >
                      <RefreshCw size={20} className="mr-2" /> Retry Current
                    </Button>
                  </div>

                  <p className="text-[10px] text-on-surface-variant/60">
                    Tip: Some servers work better in specific regions. If all fail, try clearing your browser cache.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Server Selection Rail (Mobile/Tablet) */}
        <div className="xl:hidden p-6 bg-surface border-t border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Server size={18} className="text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant block">Streaming Sources</span>
                <span className="text-xs font-bold text-on-surface">{totalServers} Free Servers Available</span>
              </div>
            </div>
            <Badge variant="tonal" className="bg-secondary-container/30 text-on-secondary-container text-[10px] font-black px-3 py-1 rounded-full">
              AUTO-FAILOVER ON
            </Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {sortedServers.map((server, index) => {
              const stats = serverStats[server.id] || { success: 0, failure: 0 };
              const isFailed = failedServers.has(server.id);
              const isActive = currentServer.id === server.id;

              return (
                <button
                  key={server.id}
                  onClick={() => {
                    setCurrentServerIndex(index);
                    setIsIframeLoading(true);
                  }}
                  className={cn(
                    "flex-shrink-0 px-6 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-3 border-2",
                    isActive 
                      ? "bg-primary text-on-primary border-primary shadow-xl shadow-primary/20 scale-105" 
                      : isFailed
                      ? "bg-error/10 text-error border-error/20 opacity-50"
                      : "bg-surface-variant/30 text-on-surface-variant border-outline-variant/30 hover:bg-surface-variant/60"
                  )}
                >
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    isActive ? "bg-on-primary animate-pulse" : isFailed ? "bg-error" : "bg-primary/30"
                  )} />
                  <div className="flex flex-col items-start leading-none">
                    <span>{server.name}</span>
                    {stats.success > 0 && (
                      <span className={cn(
                        "text-[8px] mt-1 font-medium opacity-70",
                        isActive ? "text-on-primary" : "text-on-surface-variant"
                      )}>
                        {stats.success} SUCCESSES
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 p-5 bg-primary/5 rounded-[32px] border border-primary/10 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldAlert size={20} className="text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface">Enjoy an Ad-Free Experience</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Our servers provide free content but may include ads. For the best experience, we recommend using an <span className="text-primary font-black underline">AdBlocker extension</span> (like uBlock Origin) or the <span className="text-primary font-black underline">Brave Browser</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/30">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-primary" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant">
                {totalServers} High-Speed Servers Available
              </p>
            </div>
          </div>
        </div>

        {/* Episode Selector for TV Shows */}
        {type === 'tv' && details && (
          <div className="bg-surface border-t border-outline-variant p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-display font-black flex items-center gap-2">
                    <Play size={20} className="text-primary" />
                    {details.name}
                  </h2>
                  <Badge variant="tonal" className="bg-primary/10 text-primary font-black">
                    S{season} E{episode}
                  </Badge>
                </div>
                <p className="text-sm text-on-surface-variant font-medium">
                  {seasonData?.episodes?.find((e: any) => e.episode_number === parseInt(episode))?.name && (
                    <span className="opacity-80">"{seasonData.episodes.find((e: any) => e.episode_number === parseInt(episode)).name}"</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="tonal" 
                  size="sm" 
                  className="md:hidden flex-1 gap-2"
                  onClick={() => {
                    const nextEp = parseInt(episode) + 1;
                    const hasNext = seasonData.episodes.some((e: any) => e.episode_number === nextEp);
                    if (hasNext) {
                      navigate(`/player?id=${id}&type=tv&s=${season}&e=${nextEp}`);
                    }
                  }}
                >
                  <SkipForward size={18} /> Next
                </Button>
                <select 
                  value={season}
                  onChange={(e) => navigate(`/player?id=${id}&type=tv&s=${e.target.value}&e=1`)}
                  className="bg-surface-variant/50 text-on-surface border border-outline-variant rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                >
                  {seasons.map((s: any) => (
                    <option key={s.id} value={s.season_number}>
                      Season {s.season_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {seasonData?.episodes?.map((ep: any) => (
                <button
                  key={ep.id}
                  onClick={() => navigate(`/player?id=${id}&type=tv&s=${season}&e=${ep.episode_number}`)}
                  className={`flex-shrink-0 w-48 group text-left space-y-2 transition-all active:scale-95 ${
                    parseInt(episode) === ep.episode_number ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${
                    parseInt(episode) === ep.episode_number ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent'
                  }`}>
                    <img
                      src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : 'https://via.placeholder.com/300x169?text=No+Preview'}
                      alt={ep.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {parseInt(episode) === ep.episode_number && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="px-1">
                    <p className={`text-xs font-bold line-clamp-1 ${parseInt(episode) === ep.episode_number ? 'text-primary' : 'text-on-surface'}`}>
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium">{ep.runtime || 'N/A'} min</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Similar Content */}
        {details && (
          <div className="bg-surface border-t border-outline-variant p-4 md:p-8">
            <ContentRow 
              title={`Similar ${type === 'movie' ? 'Movies' : 'TV Shows'}`}
              items={details.similar?.results || []}
              type={type as any}
            />
          </div>
        )}
      </main>

      {/* Footer Info - MD3 style */}
      <footer className="hidden md:flex items-center justify-between px-10 py-5 bg-surface border-t border-outline-variant/30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <div className="w-8 h-8 bg-surface-variant/40 rounded-full flex items-center justify-center">
              <Info size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Streaming Info</span>
              <span className="text-[11px] font-medium">Switch servers if you encounter buffering. AdBlockers are highly recommended.</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-outline-variant/30" />
          
          <div className="flex items-center gap-3 text-on-surface-variant">
            <div className="w-8 h-8 bg-surface-variant/40 rounded-full flex items-center justify-center">
              <Server size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Server Status</span>
              <span className="text-[11px] font-medium">{totalServers} active servers available for this content.</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(76,175,80,0.5)] animate-pulse" />
            <span className="text-[10px] font-black text-success uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
