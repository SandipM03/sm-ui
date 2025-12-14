"use client";
import React from 'react';
import { SadayBanner } from './SadayBanner';
import { EditorialSlider } from '../section1/EditorialSlider';

const Header: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Header / Nav Mockup for context */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none mix-blend-difference text-white">
        <div className="text-sm font-bold tracking-widest uppercase">Brand</div>
        <div className="text-sm font-bold tracking-widest uppercase">Menu</div>
      </nav>

      {/* Main Container */}
      <main className="w-full max-w-[1600px] mx-auto flex flex-col gap-12">
        
        {/* The Requested Component */}
        <section className="w-full relative">
          <SadayBanner />
        </section>

        {/* Content below to show how it sits in a page */}
        {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 opacity-60">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif">The Concept</h2>
            <p className="text-sm leading-relaxed max-w-md">
              The animation utilizes a masked reveal technique. Each character resides within its own overflow-hidden container, sliding into view from a negative x-coordinate. This creates a sharp, architectural movement synced with the background motion.
            </p>
          </div>
          <div className="space-y-4 md:text-right">
             <h2 className="text-2xl font-serif">Visual Direction</h2>
            <p className="text-sm leading-relaxed ml-auto max-w-md">
              Inspired by brutalist web design and editorial typography. The high-contrast serif typeface pairs with the raw video texture to create a sense of elegance and modernity.
            </p>
          </div>
        </section> */}
                {/* <div className="antialiased bg-white text-black overflow-x-hidden">
                    <section>
                        
                        <EditorialSlider />
                        
                        
                        <div className="max-w-6xl mx-auto px-6 py-24">
                        <p className="text-gray-400 text-sm font-mono text-center">
                            SCROLL DOWN FOR MORE CONTENT
                        </p>
                        <div className="h-screen"></div>
                        </div>
                    </section>
                </div> */}
      </main>
    </div>
  );
};

export default Header;