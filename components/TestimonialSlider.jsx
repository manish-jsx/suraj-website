'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "Working with this cinematographer transformed our vision into something beyond our imagination. The lighting techniques and framing choices elevated our entire production.",
    author: "Sarah Johnson",
    role: "Film Director",
    project: "The Silent Hour",
    avatar: "/images/testimonials/avatar-1.jpg",
    rating: 5
  },
  {
    id: 2,
    quote: "An exceptional eye for detail and technical expertise. Every frame feels like a carefully composed photograph, telling our story through light and shadow.",
    author: "Michael Chen",
    role: "Executive Producer",
    project: "Brand Campaign: Revitalize",
    avatar: "/images/testimonials/avatar-2.jpg",
    rating: 5
  },
  {
    id: 3,
    quote: "The ability to work within our budget constraints while still delivering stunning imagery speaks to both the creativity and professionalism. Truly a master of the craft.",
    author: "Priya Patel",
    role: "Creative Director",
    project: "Echoes of Tomorrow",
    avatar: "/images/testimonials/avatar-3.jpg",
    rating: 5
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const sliderRef = useRef(null);
  const interval = useRef(null);
  
  // Auto-advance the slider
  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [currentIndex]);
  
  const startAutoSlide = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    
    interval.current = setInterval(() => {
      handleNext();
    }, 6000);
  };
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Custom easing
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Custom easing
      },
    }),
  };

  // Generate star rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const testimonial = testimonials[currentIndex];

  return (
    <div ref={sliderRef} className="relative max-w-5xl mx-auto px-4 py-8">
      <div className="relative py-8 min-h-[320px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="testimonial-card"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-amber-500/30 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=random`;
                    }}
                  />
                </div>
                <h4 className="text-lg font-medium">{testimonial.author}</h4>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
                <p className="text-amber-500 text-sm mt-1">{testimonial.project}</p>
                <div className="flex mt-2">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <blockquote className="testimonial-quote">
                  <p className="text-xl md:text-2xl leading-relaxed">"{testimonial.quote}"</p>
                </blockquote>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-amber-500' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={handleNext}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
