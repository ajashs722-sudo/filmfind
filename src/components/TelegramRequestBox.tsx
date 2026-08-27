import React from 'react';
import { Send, Bot, ShieldCheck, MessageCircle, ExternalLink } from 'lucide-react';

interface TelegramRequestBoxProps {
  title: string;
  type?: 'movie' | 'tv';
}

export default function TelegramRequestBox({ title, type = 'movie' }: TelegramRequestBoxProps) {
  const requestUrl = `https://t.me/Aluvantis_bot?start=request_${encodeURIComponent(title)}`;

  return (
    <div className="rounded-3xl bg-gradient-to-r from-surface-variant/40 via-primary-container/20 to-surface-variant/40 p-6 border border-outline-variant/30 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary font-bold text-[11px] uppercase tracking-wider">
            <Send size={12} /> Telegram Request Service
          </div>
          <h3 className="text-xl font-display font-black text-on-surface tracking-tight">
            Can't find a high-quality stream or subtitle for "{title}"?
          </h3>
          <p className="text-xs text-on-surface-variant max-w-xl">
            Submit a direct title request to our automated bot or join our Telegram channel to get fast updates when new source links drop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <a
            href={requestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:brightness-110 transition-all shadow-md active:scale-95"
          >
            <Bot size={16} />
            <span>Request Title on Bot</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>

          <a
            href="https://t.me/Aluvantis"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/80 border border-outline-variant/40 text-on-surface font-semibold text-xs hover:bg-surface transition-all active:scale-95"
          >
            <MessageCircle size={16} className="text-primary" />
            <span>Discussion Channel</span>
          </a>

          <a
            href="https://t.me/Aluvantis_admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/80 border border-outline-variant/40 text-on-surface font-semibold text-xs hover:bg-surface transition-all active:scale-95"
          >
            <ShieldCheck size={16} className="text-tertiary" />
            <span>Admin</span>
          </a>
        </div>
      </div>
    </div>
  );
}
