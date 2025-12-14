"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const SadayBanner: React.FC = () => {
  const text = "SADAY";
  const letters = text.split("");

  // Animation variants for the letters
  // The 'hidden' state places the letter 100% to the left (outside the mask)
  // The 'visible' state moves it to 0% (center of the mask)
  const letterVariants = {
    hidden: { x: "-105%" },
    visible: (i: number) => ({
      x: "0%",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a premium "slide" feel
        delay: i * 0.1, // Stagger effect
      },
    }),
  };

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* 
        Container Aspect Ratio 
        Based on user request: aspect-[1400/195] ~ 7.18
        We use padding-bottom trick or aspect-ratio utility to maintain this shape.
      */}
      <div className="relative w-full aspect-[1400/195] flex items-center justify-between select-none">
        
        {/* 
          Video Background Layer 
          Positioned absolutely to sit behind text.
          Centered vertically.
        */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 w-full pointer-events-none mix-blend-multiply">
            {/* 
                User provided video. 
                Added mix-blend-multiply to make the white background of the video transparent 
                if the page background is white, or just to blend nicer.
            */}
            <video 
                className="block w-full h-auto object-cover max-md:hidden opacity-80" 
                autoPlay 
                muted 
                playsInline 
                loop
            >
                <source src="https://soil-net.jp/wp-content/themes/soil2025/assets/video/SOIL_h264_big_250612-100.mp4" type="video/mp4" />
            </video>
        </div>

        {/* 
            Dotted line fallback for mobile (since video is hidden on max-md) 
            This ensures the design integrity remains on small screens.
        */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[1px] md:hidden z-0">
             <div className="w-full border-t-2 border-dotted border-black/80"></div>
        </div>

        {/* 
          Text Layer 
          Flex container distributing letters evenly.
          z-10 to stay above video.
        */}
        <div className="relative z-10 flex justify-between w-full px-[2%] mix-blend-normal">
          {letters.map((letter, index) => (
            <div 
                key={index} 
                className="overflow-hidden" // Crucial: This masks the letter entrance
            >
              <motion.span
                custom={index}
                variants={letterVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className="block font-serif text-black leading-none"
                style={{
                    // Responsive font sizing based on viewport width to match the aspect ratio
                    fontSize: '13vw', 
                    lineHeight: 0.85
                }}
              >
                {letter}
              </motion.span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};