import React from 'react';
import SEO from '@/src/components/SEO';

export default function DMCA() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO 
        title="DMCA Policy" 
        description="Digital Millennium Copyright Act (DMCA) Policy for FilmFind" 
        keywords="DMCA, copyright, takedown request, filmfind copyright"
      />
      <h1 className="text-4xl font-display font-black tracking-tight">DMCA Policy</h1>
      <div className="prose prose-invert max-w-none text-on-surface-variant">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">1. Copyright Infringement Notification</h2>
        <p>FilmFind respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website, FilmFind will respond expeditiously to claims of copyright infringement committed using the FilmFind service.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">2. How to File a DMCA Notice</h2>
        <p>If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing the following DMCA Notice of Alleged Infringement and delivering it to FilmFind's Designated Copyright Agent.</p>
        
        <p className="mt-4">Upon receipt of the Notice as described below, FilmFind will take whatever action, in its sole discretion, it deems appropriate, including removal of the challenged material from the Site.</p>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">3. Required Information</h2>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Identify the copyrighted work that you claim has been infringed.</li>
          <li>Identify the material or link you claim is infringing (or the subject of infringing activity) and that access to which is to be disabled, including at a minimum, if applicable, the URL of the link shown on the Site where such material may be found.</li>
          <li>Provide your mailing address, telephone number, and, if available, email address.</li>
          <li>Include both of the following statements in the body of the Notice:
            <ul className="list-circle pl-6 mt-2">
              <li>"I hereby state that I have a good faith belief that the disputed use of the copyrighted material is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)."</li>
              <li>"I hereby state that the information in this Notice is accurate and, under penalty of perjury, that I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right under the copyright that is allegedly infringed."</li>
            </ul>
          </li>
          <li>Provide your full legal name and your electronic or physical signature.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">4. Designated Copyright Agent</h2>
        <p>Deliver this Notice, with all items completed, to FilmFind's Designated Copyright Agent at:</p>
        <p className="mt-2 text-primary font-bold"><a href="mailto:mirhamd112@gmail.com" className="hover:underline">mirhamd112@gmail.com</a></p>
      </div>
    </div>
  );
}
