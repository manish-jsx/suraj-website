'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Awards() {
  const sectionRef = useRef(null);
  const awardsRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Award items animation
    const awards = awardsRef.current.querySelectorAll('.award-item');
    
    gsap.fromTo(
      awards, 
      { 
        opacity: 0, 
        y: 50 
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    return () => {
      // Clean up ScrollTrigger when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Sample awards data
  const awards = [
    { name: "Best Cinematography", festival: "International Film Festival", year: 2023 },
    { name: "Visual Excellence Award", festival: "Directors Guild Showcase", year: 2022 },
    { name: "Silver Camera", festival: "Cinematography Masters", year: 2022 },
    { name: "Creative Vision", festival: "Film & Light Expo", year: 2021 },
    { name: "Industry Innovation", festival: "Commercial Directors Awards", year: 2020 },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-radial from-gray-800/20 to-black"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif mb-16 text-center">Recognition & Awards</h2>
        
        <div ref={awardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <div key={index} className="award-item bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-amber-500 transition-all duration-300">
              <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-amber-400">{award.name}</h3>
              <p className="text-gray-300 mb-2">{award.festival}</p>
              <p className="text-gray-400 text-sm">{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
