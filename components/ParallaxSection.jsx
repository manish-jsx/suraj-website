'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxSection({ children, bgColor = 'bg-gradient-to-b from-black to-gray-900/50' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  
  return (
    <section ref={ref} className={`relative overflow-hidden ${bgColor}`}>
      <motion.div
        style={{
          y,
          scale: scaleProgress,
          opacity: opacityProgress
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(255,184,0,0.08),_transparent_60%)]"></div>
      </div>
    </section>
  );
}
