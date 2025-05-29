'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Before", 
  afterLabel = "After", 
  height = 400
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  
  // Handle mouse and touch events
  const handlePointerDown = (e) => {
    setIsDragging(true);
    handlePointerMove(e);
  };
  
  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    // Get container dimensions
    const rect = containerRef.current.getBoundingClientRect();
    
    // Get pointer position
    let clientX;
    if (e.type.includes('mouse')) {
      clientX = e.clientX;
    } else if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
    } else {
      return;
    }
    
    // Calculate position percentage
    const position = ((clientX - rect.left) / rect.width) * 100;
    
    // Clamp position between 0 and 100
    const clampedPosition = Math.min(Math.max(position, 0), 100);
    
    setSliderPosition(clampedPosition);
  };
  
  const handlePointerUp = () => {
    setIsDragging(false);
  };
  
  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchend', handlePointerUp);
    } else {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative rounded-lg overflow-hidden cursor-pointer select-none"
      style={{ height: `${height}px` }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      {/* After Image (Full Width) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1500210872423-af9c2242785b?q=80&w=1000";
          }}
        />
      </div>
      
      {/* Before Image (Clipped Width) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative h-full w-full">
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            style={{ objectPosition: `0% 50%` }}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000";
            }}
          />
        </div>
      </div>
      
      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            <path d="M15.41 16.59L20 12l-4.59-4.59L14 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
        {afterLabel}
      </div>
    </div>
  );
}
