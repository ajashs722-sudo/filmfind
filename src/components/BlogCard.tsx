import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from './Image';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-surface rounded-3xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-500 group h-full flex flex-col"
    >
      <Link to={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <Image 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          type="movie"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            {post.category}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author}</span>
          </div>
        </div>
        
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-display font-semibold mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-on-surface-variant text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
          {post.excerpt}
        </p>
        
        <Link 
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-primary font-bold hover:underline text-sm group/link"
        >
          Read More
          <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default React.memo(BlogCard);
