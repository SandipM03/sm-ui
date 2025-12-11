import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { FloatingImageProps } from '../../../types';

export const FloatingImage: React.FC<FloatingImageProps> = ({
  src,
  scrollYProgress,
  triggerRange,
  direction,
  className = "",
  zIndex = 10
}) => {
  const [start, end] = triggerRange;
  const mid = start + (end - start) / 2;

  // 1. Opacity: Fade in quickly, stay visible, fade out at very end
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  // 2. Blur: Start blurry, become sharp in middle, blur out at end
  const blurValue = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.1, end],
    ["20px", "0px", "0px", "10px"]
  );
  const filter = useTransform(blurValue, (v) => `blur(${v})`);

  // 3. Scale: Start slightly small, grow as it moves
  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [0.6, 1.2]
  );

  // 4. X Position: Start near center, move outwards
  // direction 'left' means moves to negative X
  const xDistance = direction === 'left' ? -800 : 800;
  
  // We want it to start slightly offset from center (so they don't overlap perfectly)
  const initialOffset = direction === 'left' ? -50 : 50; 

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [initialOffset, xDistance]
  );

  // 5. Y Position: slight parallax upward movement
  const y = useTransform(
    scrollYProgress,
    [start, end],
    [100, -100]
  );

  return (
    <motion.div
      style={{
        opacity,
        filter,
        scale,
        x,
        y,
        zIndex,
      }}
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] overflow-hidden shadow-2xl ${className}`}
    >
      <img 
        src={src} 
        alt="Team Member" 
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
      />
    </motion.div>
  );
};
