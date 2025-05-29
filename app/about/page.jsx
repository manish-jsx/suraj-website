'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutPage() {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effect for image
    gsap.fromTo(
      imageRef.current,
      { y: 0 },
      {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
    
    // Modified text reveal animation - ensure elements return to visible state
    const textElements = textRef.current.querySelectorAll('p, h2, h3');
    
    // Set initial state to make sure elements exist in the DOM
    gsap.set(textElements, { opacity: 0, y: 50 });
    
    gsap.to(textElements, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        // Make animation run only once
        once: true
      }
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-16 reveal-text">About</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-5 lg:col-span-4 relative h-[50vh] md:h-[80vh]" ref={imageRef}>
            <div className="sticky top-32 w-full h-full flex flex-col">
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image 
                  src="/images/profile_photo.jpeg" 
                  alt="Cinematographer portrait" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Social Media and Contact Links */}
              <div className="mt-6 bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-amber-400">Connect With Me</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="mailto:contact@cinematographer.com" className="flex items-center text-white hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span className="text-sm">Email</span>
                  </Link>
                  
                  <Link href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.815c.27 0 .44-.06.5-.165.062-.104.095-.404.095-.9V10.52c0-.386-.023-.63-.068-.736a.434.434 0 0 0-.107-.135v.005zm-2.13-1.972c-.868 0-1.247.745-1.247 2.235 0 .712.123 1.258.37 1.638.248.38.605.57 1.075.57.802 0 1.203-.738 1.203-2.214 0-1.514-.414-2.23-1.244-2.23h-.157zm-10.17 9.995V4.686h19.568v12.925H2.01z"></path>
                    </svg>
                    <span className="text-sm">IMDb</span>
                  </Link>
                  
                  <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.247-.67.636-1.278 1.153-1.772A4.88 4.88 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.352-.3.882-.344 1.857-.047 1.054-.059 1.37-.059 4.04 0 2.668.012 2.985.059 4.04.045.975.207 1.504.344 1.856.182.467.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.345 1.054.046 1.37.058 4.04.058 2.67 0 2.987-.012 4.04-.058.976-.045 1.505-.208 1.858-.345.466-.182.8-.399 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.881.344-1.856.048-1.055.059-1.372.059-4.04 0-2.67-.011-2.986-.059-4.04-.045-.975-.207-1.505-.344-1.858a3.09 3.09 0 00-.748-1.15 3.09 3.09 0 00-1.15-.747c-.353-.137-.882-.3-1.857-.345-1.054-.048-1.371-.059-4.04-.059zm0 3.064A5.139 5.139 0 0117.138 12 5.139 5.139 0 0112 17.138 5.139 5.139 0 016.862 12 5.139 5.139 0 0112 6.862zm0 8.474A3.338 3.338 0 018.664 12 3.338 3.338 0 0112 8.664 3.338 3.338 0 0115.336 12 3.338 3.338 0 0112 15.336zm5.338-9.462a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"></path>
                    </svg>
                    <span className="text-sm">Instagram</span>
                  </Link>
                  
                  <Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                    <span className="text-sm">Twitter</span>
                  </Link>
                  
                  <Link href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </Link>
                  
                  <Link href="https://vimeo.com/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"></path>
                    </svg>
                    <span className="text-sm">Vimeo</span>
                  </Link>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center text-white mb-2">
                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-white">
                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">Los Angeles, CA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-7 lg:col-span-8 bg-gray-900/30 p-6 rounded-lg backdrop-blur-sm" ref={textRef}>
            <h2 className="text-3xl md:text-4xl font-serif mb-8 text-white">Crafting Visual Stories</h2>
            
            <p className="text-lg mb-6 text-gray-100">
              With extensive hands-on experience as Cinematographer, Associate DP, and AC, I've developed an aesthetic that blends technical precision with emotional resonance. My work spans feature films, documentaries, commercials, and music videos—each approached with the same commitment to visual excellence.
            </p>
            
            <p className="text-lg mb-8 text-gray-100">
              My journey began at Mithibai College, Mumbai, where I earned my Bachelor's degree in Filmmaking and honed my craft. Since then, I've collaborated with directors and production houses across various fiction and non-fiction projects, developing a versatile style that adapts to each project's unique vision.
            </p>
            
            <h3 className="text-2xl font-serif mb-6 text-white">Philosophy</h3>
            
            <p className="text-lg mb-8 text-gray-100">
              I believe cinematography is the delicate balance between technical mastery and artistic intuition. My approach centers on finding the visual language that best serves the story, whether that means breathtaking camera movement, nuanced lighting, or the subtle power of a static frame. Every decision—from lens selection to color palette—is made in service of the narrative.
            </p>
            
            <h3 className="text-2xl font-serif mb-6 text-white">Collaborations</h3>
            
            <p className="text-lg mb-8 text-gray-100">
              My career has been shaped by meaningful partnerships with visionary directors, production designers, and fellow craftspeople. I value collaborative environments where ideas flow freely and each department contributes to a cohesive vision. This approach has led to my work being featured at major film festivals including Cannes, Sundance, and Berlin.
            </p>
            
            <h3 className="text-2xl font-serif mb-6 text-white">Current Projects</h3>
            
            <p className="text-lg mb-8 text-gray-100">
              I'm currently serving as Cinematographer for a long-format docu-series featuring comedian Rahul Dua, journeying across 22 cities in India. I'm also completing work on a feature documentary about the Russia-Ukraine War (produced by Drishyam Films), with 95% of principal photography completed and currently in post-production.
            </p>
            
            <h3 className="text-2xl font-serif mb-6 text-white">Equipment & Technique</h3>
            
            <p className="text-lg mb-8 text-gray-100">
              While I have extensive experience with ARRI, RED, and Sony cinema cameras, I'm tool-agnostic—selecting equipment based on the project's specific needs rather than personal preference. This flexibility extends to my lighting approach, where I draw inspiration from both classical techniques and contemporary innovations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
