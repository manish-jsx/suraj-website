'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReelViewer({ videoUrl, title, description }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  
  // Format time in MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };
  
  // Handle video play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle click on progress bar
  const handleProgressClick = (e) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const newTime = clickPos * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickPos * 100);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    
    setIsMuted(newVolume === 0);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume === 0 ? 0.5 : volume;
      setVolume(volume === 0 ? 0.5 : volume);
    } else {
      videoRef.current.muted = true;
    }
    
    setIsMuted(!isMuted);
  };
  
  // Update progress and time during playback
  useEffect(() => {
    if (!videoRef.current) return;
    
    const updateProgress = () => {
      const video = videoRef.current;
      if (!video) return;
      
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(video.currentTime);
    };
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      setDuration(videoRef.current.duration);
    };
    
    const video = videoRef.current;
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleCanPlay);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleCanPlay);
    };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
      {/* Video Player */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          src={videoUrl}
          playsInline
          preload="metadata"
          muted={isMuted}
          onClick={togglePlay}
          onEnded={() => setIsPlaying(false)}
          poster="/images/showreel-poster.jpg"
        ></video>
        
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-gray-500 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Play button overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlay}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-900 p-4">
        {/* Progress bar */}
        <div 
          ref={progressRef}
          className="relative h-2 bg-gray-700 rounded-full cursor-pointer mb-4"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute h-full bg-amber-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            {/* Play/Pause button */}
            <button onClick={togglePlay} className="text-white">
              {isPlaying ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            {/* Volume control */}
            <div className="hidden sm:flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white">
                {isMuted || volume === 0 ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3 3v-4.59l2.71 2.71a.996.996 0 101.41-1.41L4.34 3.34a.996.996 0 00-1.41.29zM19.07 4.93a10.028 10.028 0 01.28 13.79.996.996 0 01-1.41 0 .991.991 0 010-1.4 8.01 8.01 0 00-.23-11 .996.996 0 111.36-1.45zm-4 4a6.026 6.026 0 01.15 7.56.996.996 0 01-1.41.09.991.991 0 01-.09-1.4 4.025 4.025 0 00-.13-5.25.996.996 0 01.09-1.41c.39-.32.98-.29 1.39.1zM10 20.01L7 17H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h3l3-3v14.01z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                    <path d="M16.5 12A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                    <path d="M16.5 12A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 accent-amber-500"
              />
            </div>
            
            {/* Time display */}
            <div className="text-sm text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      {(title || description) && (
        <div className="p-6">
          {title && <h3 className="text-2xl font-serif mb-2">{title}</h3>}
          {description && <p className="text-gray-300">{description}</p>}
        </div>
      )}
    </div>
  );
}
