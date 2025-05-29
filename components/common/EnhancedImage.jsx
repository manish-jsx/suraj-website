'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getFallbackImage } from '@/utils/imageFallbacks';

/**
 * Enhanced Image component with automatic fallbacks
 * 
 * Extends Next.js Image component with:
 * - Automatic fallback handling
 * - Error handling
 */
export default function EnhancedImage({
  src,
  alt,
  width,
  height,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  
  /**
   * Handle image error
   */
  const handleError = () => {
    if (!hasErrored) {
      // Try the fallback only once to avoid infinite loops
      setImgSrc(getFallbackImage(src));
      setHasErrored(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      {...props}
      onError={handleError}
    />
  );
}
