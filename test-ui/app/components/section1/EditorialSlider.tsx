"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, MoreHorizontal } from 'lucide-react';
import { PROJECTS } from './projects';
import { MaskedText } from './MaskedTextProps';
import { cn } from '../../../lib/utils';


export const EditorialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000); // 5 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const currentProject = PROJECTS[currentIndex];

  // Animation variants
  const lineVariant = {
    hidden: { scaleX: 0, originX: 0 },
    visible: (customDelay: number) => ({
      scaleX: 1,
      originX: 0,
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        delay: customDelay 
      }
    }),
    exit: { 
      scaleX: 0, 
      originX: 1, 
      transition: { duration: 0.5, ease: "easeInOut" } 
    }
  };

  // Image animation variants: New image slides up from bottom
  const imageContainerVariants = {
    initial: { clipPath: 'inset(100% 0 0 0)' },
    animate: { 
      clipPath: 'inset(0% 0 0 0)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 } 
    },
    exit: { 
        // We don't animate clipPath on exit to keep the old image visible 
        // until the new one covers it, or we could slide it up.
        // For the "stack" effect mentioned, we often just let the new one cover.
        // However, standard framer-motion exit removes the element.
        // Let's make the exiting image stay static or move slightly.
        y: "-20%",
        opacity: 0,
        transition: { duration: 1 }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col pt-8">
      
      {/* --- Top Controls --- */}
      <div className="w-full px-6 flex justify-between items-center text-xs font-mono uppercase tracking-widest mb-12">
        <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
               ( <button onClick={() => setIsPlaying(!isPlaying)} className="hover:opacity-50 transition-opacity">
                {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              </button> )
            </span>
            <div className="flex items-center gap-1 opacity-50">
               <div className="w-8 h-[2px] bg-black"></div>
               <MoreHorizontal size={12} />
            </div>
        </div>

        {/* --- Image Stage (Absolute Center) --- */}
        {/* We place the image fixed in the center visually relative to this container */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10 w-45 md:w-60 aspect-[2/3] rounded-lg overflow-hidden shadow-xl bg-gray-100">
             <AnimatePresence mode="popLayout" initial={false}>
                <motion.img 
                  key={currentProject.id}
                  src={currentProject.image}
                  alt={currentProject.middleText}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-20%", opacity: 0.5 }}
                  transition={{ 
                    duration: 1.0, 
                    ease: [0.16, 1, 0.3, 1] // Custom "Expo" ease
                  }}
                />
            </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={handlePrev} className="hover:opacity-50 transition-opacity"><ChevronLeft size={16} /></button>
           <button onClick={handleNext} className="hover:opacity-50 transition-opacity"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col justify-center relative px-4 md:px-12 mt-20">
        
        {/* LINE 1 */}
        <motion.div 
          key={`line1-${currentIndex}`}
          variants={lineVariant}
          custom={0}
          initial="hidden"
          animate="visible"
          className="w-full h-[1px] bg-black/90 origin-left"
        />

        {/* TEXT ROW 1 (Split Left/Right) */}
        <div className="h-[12vh] md:h-[16vh] flex items-center justify-between relative">
            {/* Left Part */}
            <div className="flex-1 text-right pr-4 md:pr-[140px]">
                <MaskedText 
                    triggerKey={currentIndex} 
                    delay={0.1} 
                    className="text-4xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tight"
                >
                    {currentProject.topTextLeft}
                </MaskedText>
            </div>
            
            {/* Gap for Image */}
            <div className="w-[180px] md:w-[240px] shrink-0" />

            {/* Right Part */}
            <div className="flex-1 text-left pl-4 md:pl-[140px]">
                <MaskedText 
                    triggerKey={currentIndex} 
                    delay={0.2} 
                    className="text-4xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tight"
                >
                    {currentProject.topTextRight}
                </MaskedText>
            </div>
        </div>

        {/* LINE 2 */}
        <motion.div 
          key={`line2-${currentIndex}`}
          variants={lineVariant}
          custom={0.1}
          initial="hidden"
          animate="visible"
          className="w-full h-[1px] bg-black/90 origin-left"
        />

        {/* TEXT ROW 2 (Center) */}
        <div className="h-[12vh] md:h-[16vh] flex items-center justify-center">
             <MaskedText 
                triggerKey={currentIndex} 
                delay={0.3} 
                className="text-5xl md:text-8xl lg:text-9xl font-serif leading-none tracking-tight text-center"
            >
                {currentProject.middleText}
            </MaskedText>
        </div>

        {/* LINE 3 */}
        <motion.div 
          key={`line3-${currentIndex}`}
          variants={lineVariant}
          custom={0.2}
          initial="hidden"
          animate="visible"
          className="w-full h-[1px] bg-black/90 origin-left"
        />

        {/* TEXT ROW 3 (Center) */}
        <div className="h-[12vh] md:h-[16vh] flex items-center justify-center">
            <MaskedText 
                triggerKey={currentIndex} 
                delay={0.4} 
                className="text-5xl md:text-8xl lg:text-9xl font-serif leading-none tracking-tight text-center"
            >
                {currentProject.bottomText}
            </MaskedText>
        </div>

        {/* LINE 4 */}
        <motion.div 
          key={`line4-${currentIndex}`}
          variants={lineVariant}
          custom={0.3}
          initial="hidden"
          animate="visible"
          className="w-full h-[1px] bg-black/90 origin-left"
        />

        {/* SUBTITLE (Center) */}
        <div className="py-6 flex justify-center">
             <MaskedText 
                triggerKey={currentIndex} 
                delay={0.6} 
                className="text-sm md:text-base font-mono uppercase tracking-widest text-gray-600"
            >
                {currentProject.subtitle}
            </MaskedText>
        </div>

      </div>

      {/* --- Footer Info --- */}
      <div className="px-4 md:px-12 pb-8 mt-auto">
        <motion.div 
          key={`line5-${currentIndex}`}
          variants={lineVariant}
          custom={0.4}
          initial="hidden"
          animate="visible"
          className="w-full h-[2px] bg-black mb-4 origin-left"
        />
        
        <div className="flex justify-between items-end overflow-hidden">
             <MaskedText triggerKey={currentIndex} delay={0.7} className="font-bold text-xl md:text-2xl font-sans">
                {currentProject.date}
             </MaskedText>
             
             {/* Performing Group Info - Left aligned in middle or right? Based on image, seems spread */}
             <div className="hidden md:block absolute left-12 bottom-8">
                 <MaskedText triggerKey={currentIndex} delay={0.7} className="font-bold text-xl md:text-2xl font-sans">
                    Performing Group: {currentProject.performingGroup}
                </MaskedText>
             </div>

             <MaskedText triggerKey={currentIndex} delay={0.8} className="font-bold text-xl md:text-2xl font-sans text-right">
                {currentProject.company}
             </MaskedText>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-4 bg-black mt-2 relative overflow-hidden">
             <motion.div 
                key={currentIndex}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-0 bg-gray-600 mix-blend-screen"
             />
             {/* Static black bar is background, animate a lighter overlay or vice versa? 
                 The image shows a thick black bar. Let's assume it fills up.
             */}
        </div>
      </div>

    </div>
  );
};