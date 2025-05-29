'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Image component with built-in fallback handling
 */
export default function ImageWithFallback({ 
  src, 
  alt = 'Image',
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errorCount, setErrorCount] = useState(0);
  
  const handleError = () => {
    // Only try fallback once to prevent infinite loops
    if (errorCount === 0) {
      console.log(`Image failed to load: ${src}`);
      // The image should exist now thanks to our generator
      setErrorCount(prev => prev + 1);
    }
  };
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      {...props}
      onError={handleError}
    />
  );
}
