import React from 'react';
import { motion } from 'framer-motion';

interface MaskedTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  triggerKey: number; // Used to restart animation when slide changes
}

export const MaskedText: React.FC<MaskedTextProps> = ({ children, delay = 0, className, triggerKey }) => {
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        key={triggerKey}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-110%" }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for "pop" effect
          delay: delay
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};