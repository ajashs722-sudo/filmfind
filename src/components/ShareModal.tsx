import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
  image?: string;
}

export default React.memo(function ShareModal({ isOpen, onClose, title, url, description, image }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Format the message for sharing
  const formattedMessage = `*${title}*\n\n${description || ''}\n\nRead more\n\n*Page link:* ${url}\n${image ? `*Image link:* ${image}` : ''}`;
  const encodedMessage = encodeURIComponent(formattedMessage);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: 'Telegram',
      icon: MessageCircle,
      color: 'bg-[#0088cc]',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      href: `https://api.whatsapp.com/send?text=${encodedMessage}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600',
      href: `mailto:?subject=${encodedTitle}&body=${encodedMessage}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#1A1C1E] p-6 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Share</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-110",
                    link.color
                  )}>
                    <link.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Copy Link
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={url}
                  className="w-full rounded-xl bg-black/40 border border-white/10 py-3 pl-4 pr-12 text-sm text-gray-300 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
