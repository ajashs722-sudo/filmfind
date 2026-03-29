import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, Download, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/src/lib/utils';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string; id?: string }[];
  initialIndex?: number;
  title?: string;
}

export default function MediaModal({ isOpen, onClose, images, initialIndex = 0, title }: MediaModalProps) {
  const [scale, setScale] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const currentImage = images[currentIndex];

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key, navigate on arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setScale(1);
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, currentIndex, images.length]);

  const handleClose = useCallback(() => {
    setScale(1);
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setScale(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setScale(1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleDragEnd = useCallback((e: any, info: PanInfo) => {
    // Swipe to dismiss if dragging down significantly
    if (info.offset.y > 100 && scale === 1) {
      handleClose();
    }
    // Swipe left/right to navigate if not zoomed
    if (scale === 1) {
      if (info.offset.x < -50) {
        handleNext();
      } else if (info.offset.x > 50) {
        handlePrev();
      }
    }
  }, [scale, handleClose, handleNext, handlePrev]);

  const handleShare = useCallback(async () => {
    if (!currentImage) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Gallery Image',
          url: currentImage.url,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError' && err.message !== 'Share canceled') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      navigator.clipboard.writeText(currentImage.url);
      alert('Image link copied to clipboard!');
    }
  }, [currentImage, title]);

  if (!currentImage) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl aspect-video md:aspect-auto max-h-full flex flex-col items-center justify-center z-10"
          >
            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-lg drop-shadow-md">{title || 'Gallery Image'}</h3>
                <p className="text-white/60 text-xs font-medium">{currentIndex + 1} of {images.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="tonal" 
                  size="icon" 
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                </Button>
                <Button variant="tonal" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full" onClick={() => window.open(currentImage.url, '_blank')}>
                  <Download size={20} />
                </Button>
                <Button variant="tonal" size="icon" className="bg-primary text-on-primary rounded-full shadow-lg" onClick={handleClose}>
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <Button 
                variant="tonal" 
                size="icon" 
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full hidden md:flex"
                onClick={handlePrev}
              >
                <ChevronLeft size={24} />
              </Button>
            )}
            {currentIndex < images.length - 1 && (
              <Button 
                variant="tonal" 
                size="icon" 
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full hidden md:flex"
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </Button>
            )}

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage.url}
                  src={currentImage.url}
                  alt={title || 'Gallery'}
                  className="max-w-full max-h-[80vh] object-contain cursor-move"
                  layoutId={currentImage.id || "modal-image"}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, scale }}
                  exit={{ opacity: 0, x: -20 }}
                  drag
                  dragConstraints={scale > 1 ? { left: -300, right: 300, top: -300, bottom: 300 } : { left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={scale === 1 ? 0.8 : 0.1}
                  onDragEnd={handleDragEnd}
                  onDoubleClick={() => setScale(s => s > 1 ? 1 : 2)}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              </AnimatePresence>
            </div>

            {/* Bottom Controls & Filmstrip */}
            <div className="mt-6 flex flex-col items-center gap-4 w-full">
               <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
                  <Button 
                    variant="text" 
                    size="icon" 
                    className="text-white hover:bg-white/10 rounded-full disabled:opacity-50"
                    onClick={() => setScale(s => Math.max(1, s - 0.5))}
                    disabled={scale <= 1}
                  >
                    <ZoomOut size={20} />
                  </Button>
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  <Button 
                    variant="text" 
                    size="icon" 
                    className="text-white hover:bg-white/10 rounded-full disabled:opacity-50"
                    onClick={() => setScale(s => Math.min(4, s + 0.5))}
                    disabled={scale >= 4}
                  >
                    <ZoomIn size={20} />
                  </Button>
               </div>
               
               {/* Filmstrip */}
               {images.length > 1 && (
                 <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-hide">
                   {images.map((img, idx) => (
                     <button
                       key={idx}
                       onClick={() => {
                         setScale(1);
                         setCurrentIndex(idx);
                       }}
                       className={cn(
                         "relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                         idx === currentIndex ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
                       )}
                     >
                       <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     </button>
                   ))}
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
