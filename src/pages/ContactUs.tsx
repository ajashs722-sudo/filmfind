import React from 'react';
import SEO from '@/src/components/SEO';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO 
        title="Contact Us" 
        description="Get in touch with the FilmFind team" 
        keywords="contact filmfind, support, help, email filmfind"
      />
      
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">Contact Us</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
          Have a question, feedback, or need support? We're here to help. Reach out to us using the information below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface-variant/30 p-8 rounded-[32px] border border-outline-variant/30 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold">Email Us</h2>
          <p className="text-on-surface-variant">For general inquiries, support, and DMCA notices.</p>
          <a 
            href="mailto:mirhamd112@gmail.com" 
            className="text-xl font-bold text-primary hover:underline mt-4 inline-block"
          >
            mirhamd112@gmail.com
          </a>
        </div>

        <div className="bg-surface-variant/30 p-8 rounded-[32px] border border-outline-variant/30 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container mb-2">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-2xl font-bold">Feedback</h2>
          <p className="text-on-surface-variant">We value your feedback to improve FilmFind. Send us your thoughts!</p>
          <a 
            href="mailto:mirhamd112@gmail.com?subject=FilmFind Feedback" 
            className="text-xl font-bold text-primary hover:underline mt-4 inline-block"
          >
            Send Feedback
          </a>
        </div>
      </div>
    </div>
  );
}
