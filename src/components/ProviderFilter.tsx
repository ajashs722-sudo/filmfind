import React from 'react';
import { Tv, Check, Flame, Film, Sparkles } from 'lucide-react';

interface ProviderFilterProps {
  selectedProvider: string;
  onSelectProvider: (providerId: string) => void;
}

const providers = [
  { id: 'all', name: 'All Services' },
  { id: 'netflix', name: 'Netflix' },
  { id: 'disney', name: 'Disney+' },
  { id: 'prime', name: 'Prime Video' },
  { id: 'apple', name: 'Apple TV+' },
  { id: 'hbo', name: 'Max (HBO)' },
];

export default function ProviderFilter({ selectedProvider, onSelectProvider }: ProviderFilterProps) {
  return (
    <div className="bg-surface-variant/20 border border-outline-variant/20 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Tv size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-surface leading-tight">Where to Watch</h4>
          <p className="text-[10px] text-on-surface-variant font-medium">Filter streaming library availability</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {providers.map(p => {
          const isSelected = selectedProvider === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectProvider(p.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-[1.03]'
                  : 'bg-surface/50 text-on-surface-variant border-outline-variant/30 hover:border-primary/40 hover:text-on-surface hover:bg-surface/90'
              }`}
            >
              {isSelected && <Check size={12} className="animate-pulse" />}
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
