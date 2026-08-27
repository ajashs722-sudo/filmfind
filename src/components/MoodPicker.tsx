import React, { useState } from 'react';
import { Sparkles, Compass, Flame, Heart, Ghost, Smile, BrainCircuit } from 'lucide-react';
import { Movie } from '@/src/types';
import ContentRow from '@/src/components/ContentRow';

interface MoodPickerProps {
  allMovies: Movie[];
}

const moods = [
  { id: 'all', label: 'All Vibes', icon: Compass },
  { id: 'mind_bending', label: 'Mind-Bending', icon: BrainCircuit, genreIds: [878, 9648] },
  { id: 'adrenaline', label: 'Adrenaline Rush', icon: Flame, genreIds: [28, 12] },
  { id: 'dark_suspense', label: 'Dark & Suspense', icon: Ghost, genreIds: [27, 53, 80] },
  { id: 'feel_good', label: 'Feel-Good & Comfort', icon: Smile, genreIds: [35, 10751, 16] },
  { id: 'romance', label: 'Romantic & Passion', icon: Heart, genreIds: [10749] },
];

export default function MoodPicker({ allMovies }: MoodPickerProps) {
  const [selectedMood, setSelectedMood] = useState('all');

  const filteredMovies = React.useMemo(() => {
    if (selectedMood === 'all') return allMovies;
    const moodObj = moods.find(m => m.id === selectedMood);
    if (!moodObj || !moodObj.genreIds) return allMovies;

    return allMovies.filter(item => 
      item.genre_ids?.some(gId => moodObj.genreIds.includes(gId))
    );
  }, [allMovies, selectedMood]);

  const activeMood = moods.find(m => m.id === selectedMood);

  return (
    <div className="bg-surface-variant/10 border border-outline-variant/15 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md relative overflow-hidden">
      
      {/* Decorative Blur Dot */}
      <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-outline-variant/10">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={14} className="text-tertiary animate-pulse" />
            <span>Experience Curation</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-on-surface tracking-tight">
            How are you feeling today?
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">Let our emotional algorithm align with your vibe</p>
        </div>

        {/* Mood Chips in a gorgeous row with horizontal scrolling on mobile */}
        <div className="flex gap-2 pb-2 -mx-6 px-6 overflow-x-auto scrollbar-none lg:mx-0 lg:px-0 lg:pb-0 lg:flex-wrap shrink-0">
          {moods.map(m => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.03] border-primary'
                    : 'bg-surface/60 hover:bg-surface text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-primary/40'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-on-primary' : 'text-primary'} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <ContentRow
          title={`${activeMood?.label || 'Selected Mood'} Collection`}
          items={filteredMovies.length > 0 ? filteredMovies : allMovies}
        />
      </div>
    </div>
  );
}
