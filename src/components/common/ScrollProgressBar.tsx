import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Slim, high-performance scroll progress bar positioned at the top of the viewport.
 * Tracks user scroll progression smoothly using spring physics.
 */
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring physics for fluid progress bar response
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent">
      {/* Background track subtle glow */}
      <motion.div
        id="scroll-progress-indicator"
        className="h-full w-full bg-gradient-to-r from-[#FF6A00] via-[#FF8C33] to-[#FF6A00] origin-left shadow-[0_1px_10px_rgba(255,106,0,0.7)]"
        style={{ scaleX }}
      />
    </div>
  );
};
