import { MotionValue } from 'framer-motion';

export interface FloatingImageProps {
  src: string;
  scrollYProgress: MotionValue<number>;
  triggerRange: [number, number]; // [start, end] of the animation lifecycle
  direction: 'left' | 'right';
  className?: string;
  zIndex?: number;
}
