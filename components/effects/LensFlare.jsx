'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LensFlare() {
  const flareRef = useRef(null);
  
  useEffect(() => {
    if (!flareRef.current) return;
    
    const moveFlare = (e) => {
      if (!flareRef.current) return;
      
      // Get the document dimensions
      const docWidth = document.documentElement.clientWidth;
      const docHeight = document.documentElement.clientHeight;
      
      // Calculate positions relative to the center of the screen
      const centerX = docWidth / 2;
      const centerY = docHeight / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate the distance from center as a percentage
      const distanceX = (centerX - mouseX) / centerX;
      const distanceY = (centerY - mouseY) / centerY;
      
      // Calculate the position for the flare (with some dampening)
      const flareX = centerX + (distanceX * centerX * 0.5);
      const flareY = centerY + (distanceY * centerY * 0.5);
      
      // Apply position
      flareRef.current.style.left = `${flareX}px`;
      flareRef.current.style.top = `${flareY}px`;
    };
    
    document.addEventListener('mousemove', moveFlare);
    
    return () => {
      document.removeEventListener('mousemove', moveFlare);
    };
  }, []);
  
  return (
    <>
      <div 
        ref={flareRef}
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 md:opacity-40 z-10"
        style={{
          width: '500px',
          height: '500px',
          transition: 'opacity 0.3s ease-out'
        }}
      >
        {/* Lens Flare Center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,174,0,0.2) 0%, rgba(255,255,255,0) 70%)',
          }}
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Lens Flare Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
          style={{
            border: '1px solid rgba(255,174,0,0.1)',
            boxShadow: '0 0 60px rgba(255,174,0,0.1)'
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            border: '1px solid rgba(255,174,0,0.05)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Flare Dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400/30"
            style={{
              left: `${50 + Math.cos(i * (Math.PI * 2) / 5) * 45}%`,
              top: `${50 + Math.sin(i * (Math.PI * 2) / 5) * 45}%`,
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </>
  );
}
