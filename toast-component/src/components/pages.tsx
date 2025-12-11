import React, { useEffect, useRef } from 'react';

import InfiniteGallery from './ui/InfiniteGallery';
import gsap from 'gsap';

// Extended asset list for the gallery
const IMAGES = [
  "https://picsum.photos/id/1027/800/1200", 
  "https://picsum.photos/id/1012/800/1200", 
  "https://picsum.photos/id/338/800/1200",  
  "https://picsum.photos/id/64/800/1200",
  "https://picsum.photos/id/100/800/1200",
  "https://picsum.photos/id/200/800/1200",
  "https://picsum.photos/id/300/800/1200",
  "https://picsum.photos/id/400/800/1200",
];

const Pages: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Animation for the text introduction
    if (textRef.current && containerRef.current) {
      const tl = gsap.timeline();

      // Ensure initial state
      gsap.set(textRef.current, { 
        y: 50, 
        opacity: 0, 
        filter: "blur(10px)" 
      });

      // Animate in
      tl.to(textRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "power3.out",
        delay: 0.5
      });
    }
  }, []);

  return (
    <div className="relative w-full bg-mai-bg text-mai-text min-h-screen overflow-hidden">
      

      {/* 3D Gallery Background */}
      <div className="absolute inset-0 z-0">
        <InfiniteGallery
          images={IMAGES}
          className="h-full w-full"
          fadeSettings={{
            fadeIn: { start: 0.1, end: 0.25 },
            fadeOut: { start: 0.7, end: 0.9 },
          }}
          blurSettings={{
            blurIn: { start: 0.0, end: 0.2 },
            blurOut: { start: 0.8, end: 1.0 },
            maxBlur: 10.0,
          }}
        />
      </div>

      {/* Text Overlay Layer */}
      <div 
        ref={containerRef}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center px-6 md:px-20"
      >
        <div ref={textRef} className="max-w-5xl text-center mix-blend-multiply">
           <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-mai-text drop-shadow-lg">
            We are a collective of builders, thinkers, and creators working to design technology that <span className="text-mai-accent italic">earns trust</span>, amplifies human potential, and makes life meaningfully better.
           </h2>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="fixed bottom-10 left-0 right-0 text-center pointer-events-none z-20">
         <p className="font-mono text-xs uppercase tracking-widest opacity-60">Scroll to explore</p>
      </div>

    </div>
  );
};

export default Pages;
