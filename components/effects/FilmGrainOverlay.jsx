'use client';

import { useEffect, useRef } from 'react';

export default function FilmGrainOverlay({ opacity = 0.05 }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrame;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const renderGrain = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer32 = new Uint32Array(imageData.data.buffer);
      const len = buffer32.length;
      
      let i = 0;
      
      // Generate random noise
      while (i < len) {
        // Random variation in grain intensity
        const intensity = Math.floor(Math.random() * 255);
        
        // RGBA value for white with random intensity
        buffer32[i++] = (intensity << 24) | // alpha
                        (intensity << 16) | // red
                        (intensity << 8) |  // green
                        intensity;          // blue
      }
      
      ctx.putImageData(imageData, 0, 0);
      animationFrame = requestAnimationFrame(renderGrain);
    };
    
    window.addEventListener('resize', resize);
    resize();
    renderGrain();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [opacity]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none mix-blend-overlay"
      aria-hidden="true"
    />
  );
}
