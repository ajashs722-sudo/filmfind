import fs from 'fs';
import path from 'path';
import { tmdbService } from '../src/services/tmdb';
import { blogPosts } from '../src/data/blogData';

const BASE_URL = 'https://filmfind.app'; // Replace with actual URL if needed

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  const movies = await tmdbService.getPopularMovies();
  const shows = await tmdbService.getPopularTvShows();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  for (const movie of movies) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/movie/${movie.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const show of shows) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/tv/${show.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  const collections = ['trending', 'top-rated', 'popular'];
  for (const collection of collections) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/collections/${collection}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  }

  // Blog posts
  for (const post of blogPosts) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  sitemap += `
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap();
