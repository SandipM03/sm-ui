"use client";

import React from 'react';

const SoilHeader: React.FC = () => {
  const navItems = ['WORKS', 'JOURNAL', 'NEWS', 'ABOUT', 'CONTACT'];

  return (
    <header className="w-full px-4 pt-4 pb-0 flex flex-col items-center bg-white text-black">
      {/* Top Navigation Bar */}
      <div className="w-full flex justify-between items-end border-b-4 border-black pb-2 mb-2">
        <div className="font-bold text-sm tracking-widest uppercase">Home:</div>
        
        <nav className="hidden md:flex space-x-12">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-bold text-sm tracking-widest hover:opacity-50 transition-opacity">
              {item}
            </a>
          ))}
        </nav>

        <div className="font-bold text-sm tracking-widest uppercase border border-black px-2 py-0.5 cursor-pointer hover:bg-black hover:text-white transition-colors">
          Menu
        </div>
      </div>

      {/* Massive Logo */}
      <div className="w-full border-b-8 border-black leading-none flex justify-between px-2 overflow-hidden">
        <span className="font-serif text-[18vw] leading-[0.8]">S</span>
        <span className="font-serif text-[18vw] leading-[0.8]">O</span>
        <span className="font-serif text-[18vw] leading-[0.8]">I</span>
        <span className="font-serif text-[18vw] leading-[0.8]">L</span>
      </div>
    </header>
  );
};

export default SoilHeader;