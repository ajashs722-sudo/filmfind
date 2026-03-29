import React, { memo } from 'react';
import { Genre } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelect: (genreId: number | null) => void;
}

const GenreFilter = memo(function GenreFilter({ genres, selectedGenre, onSelect }: GenreFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border",
          selectedGenre === null
            ? "bg-secondary-container text-on-secondary-container border-secondary-container shadow-md"
            : "bg-surface-variant/20 text-on-surface-variant border-outline-variant hover:bg-surface-variant/40"
        )}
      >
        All Genres
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id)}
          className={cn(
            "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border",
            selectedGenre === genre.id
              ? "bg-secondary-container text-on-secondary-container border-secondary-container shadow-md"
              : "bg-surface-variant/20 text-on-surface-variant border-outline-variant hover:bg-surface-variant/40"
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
});

export default GenreFilter;
