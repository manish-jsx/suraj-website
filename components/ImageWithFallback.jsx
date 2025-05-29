'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setImgSrc('/images/placeholder-workshop.jpg');
      setError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || "Image"}
      onError={handleError}
      {...props}
    />
  );
}
