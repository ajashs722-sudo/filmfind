import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { tmdbService } from '@/src/services/tmdb';
import PersonCard from '@/src/components/PersonCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function CastSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [genderFilter, setGenderFilter] = useState<number | null>(null); // 1: female, 2: male

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await tmdbService.getTrending('all', 'day');
        setResults(data);
      } catch (error) {
        console.error('Error fetching trending people:', error);
      }
    };

    if (!query.trim()) {
      fetchTrending();
    }
  }, [query]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const data = await tmdbService.searchPerson(query);
          console.log('Search results:', data);
          setResults(data);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const filteredResults = useMemo(() => {
    return results.filter(p => genderFilter === null || p.gender === genderFilter);
  }, [results, genderFilter]);

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-4">
        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <SearchIcon className="text-primary group-focus-within:scale-110 transition-transform" size={24} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actors..."
            className="w-full pl-16 pr-16 py-5 bg-surface-variant/20 border border-outline-variant/30 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-surface-variant/40 focus:border-primary transition-all text-xl font-medium placeholder:text-on-surface-variant/50 shadow-sm"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-6 flex items-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={() => setGenderFilter(null)} className={cn("px-4 py-2 rounded-full", genderFilter === null ? "bg-primary text-on-primary" : "bg-surface-variant")}>All</button>
        <button onClick={() => setGenderFilter(1)} className={cn("px-4 py-2 rounded-full", genderFilter === 1 ? "bg-primary text-on-primary" : "bg-surface-variant")}>Female</button>
        <button onClick={() => setGenderFilter(2)} className={cn("px-4 py-2 rounded-full", genderFilter === 2 ? "bg-primary text-on-primary" : "bg-surface-variant")}>Male</button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {filteredResults.map((person) => (
              <motion.div key={person.id}>
                <PersonCard item={person} className="w-full" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
