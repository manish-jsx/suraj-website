'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CareerTimeline() {
  const timelineRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animation for timeline items
    const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
    
    gsap.fromTo(
      timelineItems,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.3,
        duration: 0.8,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%"
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const timelineEvents = [
    {
      year: '2023-present',
      title: 'Long-Format Docu-Series (Travel/Stand-up)',
      description: 'Currently serving as Cinematographer for this exciting series featuring Comedian Rahul Dua, journeying across 22 cities in India and blending stand-up performances with real-time travel experiences.',
      image: '/images/timeline/documentary.jpg',
      highlight: true
    },
    {
      year: '2023-present',
      title: 'Feature Documentary on Russia-Ukraine War',
      description: 'Cinematographer for this important documentary produced by Drishyam Films. The project is in its final stages with 95% of principal photography completed and currently in post-production.',
      image: '/images/timeline/international.jpg',
      highlight: true
    },
    {
      year: '2023',
      title: 'Heeramandi (Netflix Series)',
      description: 'Contributed Poster Stills for this prestigious Sanjay Leela Bhansali series for Netflix.',
      image: '/images/timeline/feature-film.jpg'
    },
    {
      year: '2023',
      title: 'Maamla Legal Hai',
      description: 'Served as Assistant Cinematographer for this project.',
      image: '/images/timeline/festival.jpg'
    },
    {
      year: '2022',
      title: 'Commercial Work',
      description: 'Cinematographer for various commercial projects including Montra Electric ("Bharat ka SUPER AUTO"), Pril advertisements, and Mahadev Realtors.',
      image: '/images/timeline/commercial.jpg'
    },
    {
      year: '2022',
      title: 'Music Videos',
      description: 'Worked on multiple music videos including Amit Trivedi\'s "ME NAIN" (as 2nd D.O.P), Mishri Ki Dali by Sandesh Shandilya (as Cinematographer), and Kunal Kemmu\'s "HUM YAHIN" (as 2nd D.O.P).',
      image: '/images/timeline/innovation.jpg'
    },
    {
      year: '2021',
      title: 'Gangubai Takes Over Mumbai',
      description: 'Cinematographer for this promotional video.',
      image: '/images/timeline/feature-film.jpg'
    },
    {
      year: '2020',
      title: 'Bachelor\'s Degree in Filmmaking',
      description: 'Graduated from Mithibai College, Mumbai with strong foundations in filmmaking and visual storytelling.',
      image: '/images/timeline/innovation.jpg'
    }
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-gray-900/40">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-black/95"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 reveal-text">My Journey</h2>
          <p className="text-lg text-gray-300">
            Key milestones in my cinematography career
          </p>
        </div>
        
        <div ref={timelineRef} className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-amber-500/30"></div>
          
          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <div 
                key={index} 
                className={`timeline-item relative ${index % 2 === 0 ? 'lg:ml-auto lg:pl-12 lg:pr-0' : 'lg:mr-auto lg:pr-12 lg:pl-0'} lg:w-1/2`}
              >
                {/* Year marker on the timeline */}
                <div className="hidden lg:block absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-4 h-4 rounded-full ${event.highlight ? 'bg-amber-500' : 'bg-blue-500'} border-4 border-gray-900`}></div>
                </div>
                
                <div className={`p-6 bg-gray-900/70 backdrop-blur-sm rounded-lg flex flex-col sm:flex-row gap-6
                    ${event.highlight ? 'border-l-4 border-amber-500' : ''}`}>
                  <div className="sm:w-1/3 flex-shrink-0">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 px-3 py-1 bg-gray-800 rounded-full inline-block text-sm">
                      {event.year}
                    </div>
                  </div>
                  
                  <div className="sm:w-2/3">
                    <h3 className={`text-xl font-semibold mb-2 ${event.highlight ? 'text-amber-400' : 'text-white'}`}>
                      {event.title}
                    </h3>
                    <p className="text-gray-300">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
