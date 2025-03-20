
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { HeroImage } from '@/lib/data';

interface HeroSliderProps {
  images: HeroImage[];
  interval?: number;
}


const HeroSlider: React.FC<HeroSliderProps> = ({ images = [], interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval, isPlaying]);

  if (!images || images.length === 0) {
    return <div className="h-[600px] flex items-center justify-center text-white">No images available</div>;
  }

  return (
    <div className="relative overflow-hidden h-[600px] group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-champagne/30 to-warmSand/30 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${images[currentIndex]?.url || ''})` }}
          />
          <div className="absolute inset-0 bg-black/20 z-20" />
          
          <div className="relative h-full flex items-center z-30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-6xl font-light tracking-tight text-white mb-6"
                >
                  {images[currentIndex]?.title || "Welcome"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-white/90 mb-8"
                >
                  {images[currentIndex]?.subtitle || "Explore our collection"}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


export default HeroSlider;