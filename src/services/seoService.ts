export const seoService = {
  enhanceContent: (title: string, overview: string, genres: any[], type: 'movie' | 'tv' = 'movie', releaseDate?: string) => {
    const genreNames = genres?.map((g: any) => g.name).join(', ') || 'Movies';
    const year = releaseDate ? releaseDate.split('-')[0] : new Date().getFullYear();
    
    // Algoritmik tavsif
    const description = `Watch ${title} (${year}) in HD. ${genreNames} ${type === 'movie' ? 'movie' : 'TV show'}. ${overview.substring(0, 120)}... Find where to stream ${title} online for free on FilmFind.`;
    
    // Algoritmik mood teglar
    const moodTags = mapGenresToMoods(genres || []);
    
    // Generate comprehensive keywords
    const baseKeywords = [
      title,
      `watch ${title}`,
      `${title} ${year}`,
      `${title} full ${type === 'movie' ? 'movie' : 'episodes'}`,
      `stream ${title}`,
      `${title} online free`,
      `${title} HD`,
      `where to watch ${title}`,
      `is ${title} on netflix`,
      `${title} cast`,
      `${title} ending explained`,
      `${title} review`,
      ...genreNames.split(', ').map(g => `${g} ${type === 'movie' ? 'movies' : 'shows'}`)
    ];
    
    const keywords = baseKeywords.join(', ');

    return { description, moodTags, keywords };
  },
  
  enhanceCollection: (title: string, description: string) => {
    // Simple deterministic enhancement
    const keywords = `${title}, best ${title.toLowerCase()}, watch ${title.toLowerCase()}, top rated movies, trending movies, stream movies online, free hd movies, where to watch movies, movie recommendations`;
    return {
      description: `${title}: ${description.substring(0, 100)}... Discover the best picks on FilmFind. Watch in HD online.`,
      moodTags: ['Popular', 'Must-watch', 'Engaging', 'Cinematic', 'Recommended'],
      keywords
    };
  },

  generateStructuredData: (item: any, type: 'movie' | 'tv' | 'website' | 'article') => {
    const siteUrl = process.env.APP_URL || window.location.origin;
    
    if (type === 'website') {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "FilmFind",
        "url": siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
    }

    const isMovie = type === 'movie';
    const itemUrl = `${siteUrl}/${type}/${item.id}`;
    
    return [
      {
        "@context": "https://schema.org",
        "@type": isMovie ? "Movie" : "TVSeries",
        "name": item.title || item.name,
        "image": item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : undefined,
        "description": item.overview,
        "dateCreated": item.release_date || item.first_air_date,
        "aggregateRating": item.vote_average ? {
          "@type": "AggregateRating",
          "ratingValue": item.vote_average,
          "bestRating": "10",
          "ratingCount": item.vote_count || 1
        } : undefined,
        "genre": item.genres?.map((g: any) => g.name) || [],
        "url": itemUrl
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": isMovie ? "Movies" : "TV Shows",
            "item": `${siteUrl}/${isMovie ? 'movies' : 'tv'}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": item.title || item.name,
            "item": itemUrl
          }
        ]
      }
    ];
  }
};

function mapGenresToMoods(genres: any[]) {
  if (!genres || genres.length === 0) return ['Popular', 'Must-watch'];
  const genre = genres[0].name.toLowerCase();
  if (genre.includes('action')) return ['Exciting', 'Fast-paced', 'Adrenaline', 'Action-packed'];
  if (genre.includes('comedy')) return ['Funny', 'Lighthearted', 'Feel-good', 'Entertaining'];
  if (genre.includes('horror')) return ['Scary', 'Suspenseful', 'Creepy', 'Chilling'];
  if (genre.includes('drama')) return ['Emotional', 'Thought-provoking', 'Intense', 'Compelling'];
  return ['Popular', 'Must-watch', 'Engaging'];
}
