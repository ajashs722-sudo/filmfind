import React from 'react';
import SEO from '@/src/components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO 
        title="Privacy Policy" 
        description="Privacy Policy for FilmFind" 
        keywords="privacy policy, filmfind privacy, data protection"
      />
      <h1 className="text-4xl font-display font-black tracking-tight">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none text-on-surface-variant">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when using FilmFind. This may include your email address, usage data, and preferences when you interact with our services.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect FilmFind and our users.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">3. Third-Party Services</h2>
        <p>FilmFind uses the TMDB API to fetch movie and TV show data. We do not control the privacy practices of TMDB. Please refer to their privacy policy for more information.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:mirhamd112@gmail.com" className="text-primary hover:underline">mirhamd112@gmail.com</a></p>
      </div>
    </div>
  );
}
