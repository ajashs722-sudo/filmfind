import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { createServer as createViteServer } from 'vite';
import { blogPosts } from './src/data/blogData';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '5b21a35404d508572ed50064ebce4a97';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  // Detect the actual host URL dynamically
  app.use((req, res, next) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    // Use dynamic detection to ensure absolute URLs match the current environment (dev vs shared)
    const detectedUrl = `${protocol}://${host}`;
    (req as any).fullUrl = detectedUrl;
    next();
  });

  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    const currentAppUrl = (req as any).fullUrl;
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|facebook|embed|telegram|whatsapp|twitter|slack|discord/i.test(userAgent);

    try {
      let template: string;
      if (!isProd) {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
      }

      // Default values
      let title = 'CineStream MD3 - Premium Streaming';
      let description = 'A premium movie and TV show streaming platform built with Material Design 3 and TMDB API.';
      let image = 'https://picsum.photos/seed/cinestream/1280/720'; // Fallback image
      let pageUrl = `${currentAppUrl}${url.split('?')[0]}`;
      let ogType = 'website';

      // Check if it's a blog post route
      const blogMatch = url.match(/\/blog\/([^/?#]+)/);
      const movieMatch = url.match(/\/movie\/(\d+)/);
      const tvMatch = url.match(/\/tv\/(\d+)/);
      const personMatch = url.match(/\/person\/(\d+)/);

      if (blogMatch) {
        const slug = blogMatch[1];
        const post = blogPosts.find(p => p.slug === slug);
        if (post) {
          title = `${post.title} | CineStream`;
          description = post.excerpt;
          ogType = 'article';
          // Use a larger image for social sharing if it's a TMDB image
          let postImage = post.image;
          if (postImage.includes('image.tmdb.org')) {
            postImage = postImage.replace('/w780/', '/w1280/');
          }
          image = postImage.startsWith('http') ? postImage : `${currentAppUrl}${postImage}`;
        }
      } else if (movieMatch) {
        const id = movieMatch[1];
        try {
          const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: { api_key: TMDB_API_KEY }
          });
          const movie = response.data;
          title = `${movie.title} (${new Date(movie.release_date).getFullYear()}) | CineStream`;
          description = movie.overview;
          ogType = 'video.movie';
          if (movie.backdrop_path) {
            image = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
          } else if (movie.poster_path) {
            image = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
          }
        } catch (err) {
          console.error('Error fetching movie for meta tags:', id);
        }
      } else if (tvMatch) {
        const id = tvMatch[1];
        try {
          const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
            params: { api_key: TMDB_API_KEY }
          });
          const tv = response.data;
          title = `${tv.name} (${new Date(tv.first_air_date).getFullYear()}) | CineStream`;
          description = tv.overview;
          ogType = 'video.tv_show';
          if (tv.backdrop_path) {
            image = `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`;
          } else if (tv.poster_path) {
            image = `https://image.tmdb.org/t/p/w780${tv.poster_path}`;
          }
        } catch (err) {
          console.error('Error fetching TV show for meta tags:', id);
        }
      } else if (personMatch) {
        const id = personMatch[1];
        try {
          const response = await axios.get(`${TMDB_BASE_URL}/person/${id}`, {
            params: { api_key: TMDB_API_KEY }
          });
          const person = response.data;
          title = `${person.name} | CineStream`;
          description = person.biography || `Learn more about ${person.name}`;
          ogType = 'profile';
          if (person.profile_path) {
            image = `https://image.tmdb.org/t/p/h632${person.profile_path}`;
          }
        } catch (err) {
          console.error('Error fetching person for meta tags:', id);
        }
      }

      // Inject meta tags
      const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:site_name" content="CineStream" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@cinestream" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
      `.trim();

      // Robust replacement using regex
      let html = template;
      
      // 1. Add OG prefix to html tag
      html = html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (attrs.includes('prefix=')) return match;
        return `<html${attrs} prefix="og: http://ogp.me/ns#">`;
      });

      // 2. Remove existing title
      html = html.replace(/<title>.*?<\/title>/gi, '');

      // 3. Inject meta tags at the beginning of head
      html = html.replace(/<head>/i, `<head>\n    ${metaTags}`);

      // Set headers for bots to prevent caching during testing
      if (isBot) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (!isProd) vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e instanceof Error ? e.message : String(e));
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
