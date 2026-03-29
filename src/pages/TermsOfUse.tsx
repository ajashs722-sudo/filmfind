import React from 'react';
import SEO from '@/src/components/SEO';

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO 
        title="Terms of Use" 
        description="Terms of Use for FilmFind" 
        keywords="terms of use, terms of service, filmfind rules"
      />
      <h1 className="text-4xl font-display font-black tracking-tight">Terms of Use</h1>
      <div className="prose prose-invert max-w-none text-on-surface-variant">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using FilmFind, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on FilmFind's website for personal, non-commercial transitory viewing only.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">3. Disclaimer</h2>
        <p>The materials on FilmFind's website are provided on an 'as is' basis. FilmFind makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">4. Limitations</h2>
        <p>In no event shall FilmFind or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FilmFind's website.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">5. Contact</h2>
        <p>For any questions regarding these terms, please contact us at: <a href="mailto:mirhamd112@gmail.com" className="text-primary hover:underline">mirhamd112@gmail.com</a></p>
      </div>
    </div>
  );
}
