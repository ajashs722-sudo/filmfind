import React, { useState } from 'react';
import { Share2, Copy, Check, Send, Instagram, Sparkles, Film, Star } from 'lucide-react';
import { Movie } from '@/src/types';
import { getImageUrl } from '@/src/services/tmdb';
import { formatRating } from '@/src/lib/utils';

interface WatchlistCardExporterProps {
  watchlist: Movie[];
}

export default function WatchlistCardExporter({ watchlist }: WatchlistCardExporterProps) {
  const [copied, setCopied] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  const topItems = watchlist.slice(0, 4);

  const handleCopyText = () => {
    const titleList = watchlist.map((m, i) => `${i + 1}. ${m.title || m.name} (${m.vote_average ? m.vote_average.toFixed(1) : 'NR'}★)`).join('\n');
    const shareText = `🎬 My Aluvantis FilmFind Watchlist (${watchlist.length} Titles):\n\n${titleList}\n\n🍿 Discover & watch on https://t.me/Aluvantis`;
    
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const titleList = watchlist.map((m, i) => `${i + 1}. ${m.title || m.name}`).join('\n');
    const text = `🍿 Check out my Aluvantis FilmFind Watchlist:\n\n${titleList}\n\nJoin @Aluvantis`;
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/Aluvantis')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2500);
  };

  if (watchlist.length === 0) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-surface-variant/50 via-surface to-primary-container/30 border border-primary/20 p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} /> Social Watchlist Card
          </div>
          <h3 className="text-xl font-display font-black text-on-surface tracking-tight">
            Export & Share Your Watchlist
          </h3>
          <p className="text-xs text-on-surface-variant">
            Generate a custom Aluvantis card to share with friends on Telegram or Instagram
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/80 border border-outline-variant/40 text-on-surface font-bold text-xs hover:bg-surface transition-all active:scale-95"
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Summary!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:brightness-110 transition-all shadow-md active:scale-95"
          >
            <Send size={16} />
            <span>Share to Telegram</span>
          </button>
        </div>
      </div>

      {/* Visual Card Preview */}
      <div className="p-5 rounded-2xl bg-background/80 border border-outline-variant/30 backdrop-blur-md relative z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center font-bold text-on-primary text-xs">
              A
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block leading-none">Aluvantis</span>
              <span className="text-sm font-bold text-on-surface leading-none">FilmFind Watchlist</span>
            </div>
          </div>
          <span className="text-xs font-black text-primary px-2.5 py-1 rounded-full bg-primary/10">
            {watchlist.length} Saved Titles
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {topItems.map((item, idx) => (
            <div key={item.id || idx} className="space-y-1.5 group">
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-surface-variant relative shadow-sm">
                <img
                  src={getImageUrl(item.poster_path, 'w185')}
                  alt={item.title || item.name || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-background/90 text-[10px] font-bold text-primary flex items-center gap-0.5">
                  <Star size={10} fill="currentColor" />
                  {formatRating(item.vote_average)}
                </div>
              </div>
              <p className="text-xs font-bold text-on-surface truncate">
                {item.title || item.name}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-on-surface-variant/80">
          <span>Official Channel: @Aluvantis</span>
          <span>Bot: @Aluvantis_bot</span>
        </div>
      </div>
    </div>
  );
}
