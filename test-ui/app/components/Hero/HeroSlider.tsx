"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';


interface SlideData {
  id: number;
  image: string;
  topLine: string;
  middleLine: string;
  bottomLine: string;
  footerText: string;
  date: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "https://picsum.photos/600/800?random=1",
    topLine: "MUSICAL",
    middleLine: "IN THIS",
    bottomLine: "CORNER OF THE WORLD",
    footerText: "(THIS YEAR'S SELECTED WORKS)",
    date: "2025.6.25"
  },
  {
    id: 2,
    image: "https://picsum.photos/600/800?random=2",
    topLine: "PRESENTING",
    middleLine: "JAPANESE",
    bottomLine: "THEATER WORLDWIDE",
    footerText: "(ABOUT SOIL)",
    date: "2025.8.12"
  },
  {
    id: 3,
    image: "https://picsum.photos/600/800?random=3",
    topLine: "CONTEMPORARY",
    middleLine: "DANCE",
    bottomLine: "EXHIBITION 2024",
    footerText: "(UPCOMING EVENTS)",
    date: "2025.9.30"
  },
  {
    id: 4,
    image: "https://picsum.photos/600/800?random=4",
    topLine: "TRADITIONAL",
    middleLine: "ARTS",
    bottomLine: "KYOTO SYMPOSIUM",
    footerText: "(CULTURAL EXCHANGE)",
    date: "2025.11.05"
  }
];

// --- Sub-Components ---

// 1. The Masked Text Reveal
const RevealText = ({ text, delay = 0, isSerif = true, className = "" }: { text: string, delay?: number, isSerif?: boolean, className?: string }) => {
  return (
    <div className={`overflow-hidden inline-block align-top ${className}`}>
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-110%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay }}
        className={`${isSerif ? 'font-serif' : 'font-sans'}`}
      >
        {text}
      </motion.div>
    </div>
  );
};

// 2. The Animated Line
const AnimatedLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0, originX: 0 }}
    animate={{ scaleX: 1, originX: 0 }}
    exit={{ scaleX: 0, originX: 1 }}
    transition={{ duration: 0.8, ease: "easeInOut", delay }}
    className="w-full h-[1px] bg-black my-1"
  />
);

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000); // 5 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden pt-8 bg-white text-black">
      
      {/* Controls Bar */}
      <div className="w-full px-4 flex justify-between items-center mb-8 relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPlaying(!isPlaying)} className="hover:opacity-50">
            {isPlaying ? <span className="font-bold text-xs flex gap-1 items-center">( <Pause size={12} fill="black" /> )</span> : <span className="font-bold text-xs flex gap-1 items-center">( <Play size={12} fill="black" /> )</span>}
          </button>
          <div className="flex items-center gap-1">
             <div className="w-8 h-0.5 bg-black"></div>
             <MoreHorizontal size={16} className="text-gray-400" />
          </div>
        </div>
        
        {/* Central Image Container (Fixed position relative to slider area) */}
        {/* We absolutely position this here to act as the "Fixed Card" described in prompt */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-52 aspect-[4/5] z-10 rounded-lg overflow-hidden border border-black/10 bg-gray-100 shadow-xl flex items-center justify-center">
           <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.topLine}
              className="absolute inset-0  object-cover"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} // Slower, dramatic slide up
              height="108"
              width="280"
            />
          </AnimatePresence>
        </div>

        <div className="flex gap-4">
          <button onClick={handlePrev}><ChevronLeft size={20} /></button>
          <button onClick={handleNext}><ChevronRight size={20} /></button>
        </div>
      </div>
      
      {/* Main Content Area - Typography Animation */}
      <div className="w-full relative px-4 mt-[180px] md:mt-[100px] mb-auto">
        <AnimatePresence mode="wait">
          <div key={currentSlide.id} className="w-full flex flex-col items-center text-center">
             <AnimatedLine delay={0.3} />
            {/* --- Top Section --- */}
            {/* The layout is flexible: Text Left, Image Center (handled above), Text Right */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-32 items-end mb-2">
               {/* Left aligned text */}
               <div className="text-right md:text-right w-full overflow-hidden">
                  <RevealText 
                    text={currentSlide.topLine} 
                    className="text-4xl md:text-6xl tracking-tighter" 
                    delay={0.2}
                  />
               </div>
               
               {/* Right aligned text */}
               <div className="text- md:text-left w-full ml-auto">
                 <RevealText 
                    text={currentSlide.middleLine} 
                    className="text-4xl md:text-6xl tracking-tighter" 
                    delay={0.3}
                  />
               </div>
            </div>

            {/* --- Divider Line 1 --- */}
            <AnimatedLine delay={0.1} />

            {/* --- Middle Section (Large Centered Text) --- */}
            <div className="relative max-md:hidden uppercase font-title font-semibold -tracking-40 md:pt-3ptvw-xl md:h-56ptvw-xl text-center">
              <RevealText 
                text={currentSlide.bottomLine} 
                className="text-5xl md:text-6xl tracking-tighter" 
                delay={0.4}
              />
            </div>

            {/* --- Divider Line 2 --- */}
            <AnimatedLine delay={0.2} />

             {/* --- Large Centered Text Continue/Subtitle --- */}
             <div className="py-2">
              <RevealText 
                 text="WORLDWIDE" 
                 className="text-5xl md:text-6xl tracking-tighter"
                 delay={0.5} 
              />
            </div>

             {/* --- Divider Line 3 --- */}
             <AnimatedLine delay={0.3} />

            {/* --- Bottom Metadata --- */}
            <div className="py-2">
               <RevealText 
                 text={currentSlide.footerText} 
                 isSerif={false}
                 className="text-sm font-bold tracking-widest uppercase" 
                 delay={0.6}
               />
            </div>
          
          </div>
        </AnimatePresence>
      </div>

      {/* Footer Info Bar */}
      <div className="w-full px-4 pb-8">
        <div className="w-full border-t border-black pt-2 flex justify-between items-baseline mb-1">
          <AnimatePresence mode="wait">
            <motion.div 
               key={currentSlide.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="font-bold text-xl"
            >
              {currentSlide.date}
            </motion.div>
          </AnimatePresence>
          <div className="text-lg font-serif italic">About</div>
        </div>
        
        {/* Thick Bottom Bar */}
        <div className="w-full h-4 bg-black mt-1"></div>
        
        <div className="w-full flex justify-between mt-2 text-sm font-bold uppercase tracking-wider text-gray-600">
           <span>Performing Group:</span>
           <span>TOHO CO., LTD.</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;