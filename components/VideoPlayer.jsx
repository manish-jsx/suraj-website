'use client';

import { useState, useRef, useEffect } from 'react';
import { getRandomPlaceholderVideo } from '@/lib/sanity';
import { motion } from 'framer-motion';

export default function VideoPlayer({ videoUrl, thumbnailUrl, title, autoPlay = false, muted = true, loop = false, showFilmGrain = true }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  
  // Use fallback video if videoUrl doesn't exist
  const effectiveVideoUrl = videoUrl || fallbackUrl;
  
  useEffect(() => {
    if (!videoUrl) {
      setFallbackUrl(getRandomPlaceholderVideo());
    }
  }, [videoUrl]);
  
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Update play state when video ends
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
      }
    };
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoPlay) {
        videoElement.play().catch(e => {
          console.log("Autoplay prevented by browser", e);
          setIsPlaying(false);
        });
      }
    };
    
    const handleError = () => {
      console.error("Video error, using fallback");
      setFallbackUrl(getRandomPlaceholderVideo());
    };
    
    if (videoElement) {
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);
      
      return () => {
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [autoPlay, loop]);

  // Effective thumbnail URL (use a placeholder if not provided)
  const effectiveThumbnailUrl = thumbnailUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000';

  return (
    <div 
      className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer" 
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={effectiveVideoUrl}
        preload="metadata"
        className="w-full h-full object-cover"
        playsInline
        muted={muted}
        loop={loop}
      />
      
      {showFilmGrain && (
        <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-20 z-10">
          <div className="w-full h-full film-grain"></div>
        </div>
      )}
      
      {/* Thumbnail overlay until video is playing */}
      {!isPlaying && (
        <div className="absolute inset-0">
          <img 
            src={effectiveThumbnailUrl} 
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000';
            }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}
      
      {/* Play/Pause button */}
      <motion.button 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center transition-opacity ${isPlaying && !showControls ? 'opacity-0' : 'opacity-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: isPlaying && !showControls ? 0 : 0.8 }}
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        )}
      </motion.button>
      
      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Video title overlay */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-white text-sm md:text-base font-medium">{title}</h3>
        </div>
      )}
    </div>
  );
}
