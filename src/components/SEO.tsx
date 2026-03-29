import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  type?: 'movie' | 'tv' | 'website' | 'article' | 'profile';
  image?: string;
  url?: string;
  jsonLd?: any;
  keywords?: string;
}

export default function SEO({ title, description, type = 'website', image, url, jsonLd, keywords }: SEOProps) {
  const siteUrl = process.env.APP_URL || window.location.origin;
  const absoluteImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : undefined;
  const absoluteUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : window.location.href;

  return (
    <Helmet>
      <title>{title} | FilmFind</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={absoluteUrl} />
      <link rel="alternate" hrefLang="en" href={absoluteUrl} />
      
      {/* Open Graph / Facebook / Telegram */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="FilmFind" />
      <meta property="og:locale" content="en_US" />
      {absoluteImage && (
        <>
          <meta property="og:image" content={absoluteImage} />
          <meta property="og:image:secure_url" content={absoluteImage} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720" />
          <meta property="og:image:alt" content={title} />
          <link rel="image_src" href={absoluteImage} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@filmfind" />
      <meta name="twitter:creator" content="@filmfind" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
