'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { getRandomPlaceholderVideo } from '@/lib/sanity';

export default function CinematicHero({ showreel }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoSource, setVideoSource] = useState(showreel?.videoUrl || null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    // Initialize video
    if (!videoSource && showreel?.videoUrl) {
      setVideoSource(showreel.videoUrl);
    }
    
    // Intro animation
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo(
      titleRef.current.querySelector('.hero-title'),
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );
    
    tl.fromTo(
      titleRef.current.querySelector('.hero-subtitle'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.8"
    );
    
    tl.fromTo(
      titleRef.current.querySelector('.hero-cta'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
    
    // Handle video load
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => setVideoLoaded(true);
      const handleError = () => {
        console.error("Video failed to load, using fallback");
        setVideoError(true);
        setVideoSource(getRandomPlaceholderVideo());
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [showreel, videoSource]);
  
  // If video error occurred and we're using a fallback, re-initialize the video
  useEffect(() => {
    if (videoError && videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSource, videoError]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Video Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <div className="w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero-poster.jpg"
            onError={() => {
              setVideoError(true);
              setVideoSource(getRandomPlaceholderVideo());
            }}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
          
          {!videoLoaded && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="film-reel-loader"></div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4),_rgba(0,0,0,0.6)_100%)]"></div>
        </div>
      </motion.div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight">
            Painting Stories <span className="text-amber-400">With Light</span>
          </h1>
          <p className="hero-subtitle text-xl sm:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Award-winning cinematography that captures the essence of storytelling through the lens
          </p>
          <div className="hero-cta flex flex-wrap justify-center gap-4">
            <a href="#showreel" className="btn-primary">
              Watch Showreel
            </a>
            <a href="#projects" className="btn-secondary">
              View Projects
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "easeInOut" 
        }}
      >
        <svg className="w-6 h-12 text-white/70" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7.5" y="0.5" width="9" height="15" rx="4.5" stroke="currentColor"/>
          <circle cx="12" cy="7" r="2" fill="currentColor"/>
          <path d="M12 24L6 18H18L12 24Z" fill="currentColor"/>
        </svg>
      </motion.div>
    </section>
  );
}
