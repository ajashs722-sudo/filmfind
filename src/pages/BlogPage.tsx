import React from 'react';
import { motion } from 'motion/react';
import { blogPosts } from '../data/blogData';
import { BlogPost } from '../types';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';

export default function BlogPage() {
  return (
    <div className="space-y-16 pb-32 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
      <SEO 
        title="Blog - FilmFind"
        description="Latest movie news, reviews, and cinematic analysis. Stay updated with the world of cinema."
        url={window.location.href}
      />
      
      <header className="space-y-8 pt-12 md:pt-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-1 w-12 bg-primary rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Cinematic Insights</span>
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          className="text-5xl sm:text-7xl lg:text-9xl font-display font-black tracking-tighter leading-[0.85] text-on-surface"
        >
          Deep <span className="text-primary">Dives</span> Into <br className="hidden md:block" /> The <span className="italic font-serif font-light opacity-60">Screen</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-on-surface-variant text-xl md:text-2xl max-w-3xl font-medium opacity-70 leading-relaxed tracking-tight"
        >
          Exploring the intersection of storytelling, technology, and culture. From technical analysis to industry trends.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
        {blogPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
