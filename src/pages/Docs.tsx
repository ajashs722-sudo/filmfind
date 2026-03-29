import React from 'react';
import SEO from '@/src/components/SEO';
import { Book, Code, Database, Globe, Search, HelpCircle } from 'lucide-react';

export default function Docs() {
  const seoKeywords = "watch movies online free 2026, best streaming sites 2026, watch Peaky Blinders The Immortal Man free, new on Netflix March 2026, War Machine movie stream, Project Hail Mary streaming release date, Zootopia 2 Disney Plus date, watch Daredevil Born Again Season 2, best sci-fi movies netflix 2026, where to watch oscar winners 2026, top 10 tv shows streaming today, watch bts the return documentary, hannah montana 20th anniversary stream, free movie database no ads, latest hbo max releases march, watch hamnet movie online, streaming availability tracker 2026, best medical dramas hbo max, watch daredevil born again season 2 free, new trailers on netflix this week, watch something very bad is going to happen, watch bts the comeback live arirang, best new movies on prime video march, where to watch project hail mary in theaters, watch the pitt series hbo, streaming guide march 2026, latest disney plus animation, watch peaky blinders the immortal man in 4k, new movies available to rent march, free streaming trials 2026, app to track movies 2026, free TMDB alternative app, best movie tracker reddit 2026, movie watchlist app for couples, TV show tracker with JustWatch, app to track episodes and movies, Letterboxd alternative with better UI, trakt.tv sync app for android, best aso tools 2026, movie inventory software windows 10, free dvd collection organizer app, app like letterboxd for tv shows, synced movie watchlist for partners, movie recommender ai app, free cinema library tracker, cinopsys movie shows, showly tv tracker github, movie database management software, movie checklist app with barcode, movie organizer deluxe alternative, best software to watch videos 2026, track watched movies app no ads, movie bucket list app free, best movie search assistant, movie database web design templates";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <SEO 
        title="Documentation & Streaming Guide 2026" 
        description="FilmFind Documentation, API Reference, and comprehensive streaming guide for 2026. Find release dates, streaming availability, and more." 
        keywords={seoKeywords}
      />
      
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">Documentation & SEO Guide</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
          Learn how FilmFind works, explore our architecture, and discover the ultimate streaming guide for 2026.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface-variant/20 p-8 rounded-[32px] border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
              <Database size={24} />
            </div>
            <h2 className="text-2xl font-bold">Data Source</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            FilmFind is powered by the TMDB (The Movie Database) API. We fetch real-time data for movies, TV shows, cast members, and trending content. All metadata, posters, and backdrops are provided by TMDB.
          </p>
        </div>

        <div className="bg-surface-variant/20 p-8 rounded-[32px] border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-secondary-container rounded-2xl flex items-center justify-center text-on-secondary-container">
              <Code size={24} />
            </div>
            <h2 className="text-2xl font-bold">Tech Stack</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Built with React 18, Vite, and Tailwind CSS. We utilize Framer Motion for fluid animations and React Router for seamless client-side navigation. The UI follows Material Design 3 principles.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8 border-b border-outline-variant/30 pb-4">
          <Search size={32} className="text-primary" />
          <h2 className="text-3xl font-display font-black">Streaming Guide & FAQ 2026</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              When is Zootopia 2 coming to Disney Plus?
            </h3>
            <p className="text-on-surface-variant">Zootopia 2 is scheduled to release on Disney Plus on March 11, 2026, at 12:01 a.m. PT.</p>
          </div>

          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              What is the release date for War Machine on Netflix?
            </h3>
            <p className="text-on-surface-variant">War Machine, the original sci-fi action thriller starring Alan Ritchson, releases on Netflix on March 6, 2026. It has a runtime of 107 minutes.</p>
          </div>

          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              When will Project Hail Mary be available on streaming?
            </h3>
            <p className="text-on-surface-variant">Project Hail Mary is an Amazon MGM Studios production and will be exclusive to Prime Video, likely 45-90 days after its March 20, 2026 theatrical release. It was filmed specifically for IMAX formats.</p>
          </div>

          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              Is Daredevil: Born Again Season 2 releasing all at once?
            </h3>
            <p className="text-on-surface-variant">No, the eight episodes release weekly on Tuesdays, with a double premiere on March 24, 2026, exclusively on Disney+. It is a direct continuation of the three-season Netflix run.</p>
          </div>

          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              Where can I watch Peaky Blinders: The Immortal Man for free?
            </h3>
            <p className="text-on-surface-variant">The movie requires a Netflix subscription and is available in 4K with Dolby Vision and Dolby Atmos. However, the original series is free on BBC iPlayer in the UK (requires a VPN outside the UK).</p>
          </div>

          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              Is Hamnet streaming on Netflix or Hulu?
            </h3>
            <p className="text-on-surface-variant">No, Hamnet, starring Jessie Buckley and Paul Mescal, is a Peacock exclusive starting March 6, 2026. It is Rated R for thematic elements.</p>
          </div>

          <div className="bg-surface-variant/10 p-6 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              What is the BTS: THE RETURN documentary about?
            </h3>
            <p className="text-on-surface-variant">It covers the recording of their album ARIRANG in Los Angeles and their comeback preparations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
