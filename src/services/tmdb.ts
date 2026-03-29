import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = 'original') => 
  path ? `${IMAGE_BASE_URL}/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';

export const tmdbService = {
  getTrending: async (type: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day') => {
    const { data } = await tmdb.get(`/trending/${type}/${timeWindow}`);
    return data.results;
  },

  getPopularMovies: async (page = 1) => {
    const { data } = await tmdb.get('/movie/popular', { params: { page } });
    return data.results;
  },

  getTopRatedMovies: async (page = 1) => {
    const { data } = await tmdb.get('/movie/top_rated', { params: { page } });
    return data.results;
  },

  getUpcomingMovies: async (page = 1) => {
    const { data } = await tmdb.get('/movie/upcoming', { params: { page } });
    return data.results;
  },

  getPopularTvShows: async (page = 1) => {
    const { data } = await tmdb.get('/tv/popular', { params: { page } });
    return data.results;
  },

  getTopRatedTvShows: async (page = 1) => {
    const { data } = await tmdb.get('/tv/top_rated', { params: { page } });
    return data.results;
  },

  getMovieDetails: async (id: string | number) => {
    const { data } = await tmdb.get(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits,recommendations,similar,images,external_ids,release_dates,watch/providers' }
    });
    return data;
  },

  getTvShowDetails: async (id: string | number) => {
    const { data } = await tmdb.get(`/tv/${id}`, {
      params: { append_to_response: 'videos,credits,recommendations,similar,images,external_ids,content_ratings,watch/providers' }
    });
    return data;
  },

  searchMulti: async (query: string, page = 1) => {
    const { data } = await tmdb.get('/search/multi', { params: { query, page } });
    return data.results;
  },

  searchMovies: async (query: string, page = 1, year?: string) => {
    const params: any = { query, page };
    if (year) params.primary_release_year = year;
    const { data } = await tmdb.get('/search/movie', { params });
    return data.results;
  },

  searchTv: async (query: string, page = 1, year?: string) => {
    const params: any = { query, page };
    if (year) params.first_air_date_year = year;
    const { data } = await tmdb.get('/search/tv', { params });
    return data.results;
  },

  searchPerson: async (query: string, page = 1) => {
    const { data } = await tmdb.get('/search/person', { params: { query, page } });
    return data.results;
  },

  getGenres: async (type: 'movie' | 'tv') => {
    const { data } = await tmdb.get(`/genre/${type}/list`);
    return data.genres;
  },

  getDiscover: async (type: 'movie' | 'tv', params: any = {}) => {
    const { data } = await tmdb.get(`/discover/${type}`, { params });
    return data.results;
  },

  getTvSeasonDetails: async (id: string | number, seasonNumber: number | string) => {
    const { data } = await tmdb.get(`/tv/${id}/season/${seasonNumber}`);
    return data;
  },

  getPersonDetails: async (id: string | number) => {
    const { data } = await tmdb.get(`/person/${id}`, {
      params: { append_to_response: 'combined_credits,external_ids,images' }
    });
    return data;
  },

  getMovieCredits: async (id: string | number) => {
    const { data } = await tmdb.get(`/movie/${id}/credits`);
    return data;
  },

  getTvShowCredits: async (id: string | number) => {
    const { data } = await tmdb.get(`/tv/${id}/credits`);
    return data;
  }
};
