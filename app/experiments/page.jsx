'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import experimentData from '@/data/experiments.json';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [activeExperiment, setActiveExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const experimentsRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Use local data instead of fetching from Sanity
    const fetchedExperiments = experimentData.experiments;
    
    setExperiments(fetchedExperiments);
    if (fetchedExperiments.length > 0) {
      setActiveExperiment(fetchedExperiments[0]);
    }
    setLoading(false);
    
    // Header animation
    gsap.from(headerRef.current.children, {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Animation when changing active experiment
  useEffect(() => {
    if (activeExperiment && experimentsRef.current) {
      const tl = gsap.timeline();
      
      tl.to('.experiment-content', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          // This would typically be handled by React re-rendering
        }
      })
      .fromTo('.experiment-content', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [activeExperiment]);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div ref={headerRef}>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Experimental Work</h1>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl">
            Pushing the boundaries of cinematography through unconventional techniques, tools, and visual storytelling approaches.
          </p>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-24">
                <h2 className="text-2xl mb-6">Projects</h2>
                
                <nav className="space-y-1">
                  {experiments.map((exp) => (
                    <button
                      key={exp.id}
                      className={`block w-full text-left px-4 py-3 rounded transition-colors ${
                        activeExperiment?.id === exp.id
                          ? 'bg-gray-800 text-amber-400'
                          : 'hover:bg-gray-900 text-gray-300'
                      }`}
                      onClick={() => setActiveExperiment(exp)}
                    >
                      <div className="font-medium">{exp.title}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(exp.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            <div ref={experimentsRef} className="lg:col-span-8 order-1 lg:order-2">
              {activeExperiment ? (
                <div className="experiment-content">
                  {/* Display experiment details */}
                  <div className="aspect-cinema w-full overflow-hidden mb-8 rounded-lg bg-black">
                    {activeExperiment.videoUrl ? (
                      <video
                        src={activeExperiment.videoUrl}
                        controls
                        poster={activeExperiment.images && activeExperiment.images[0]}
                        className="w-full h-full object-contain"
                      ></video>
                    ) : activeExperiment.images && activeExperiment.images[0] ? (
                      <img 
                        src={activeExperiment.images[0]} 
                        alt={activeExperiment.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif mb-4">{activeExperiment.title}</h2>
                  
                  <div className="flex flex-wrap gap-4 mb-8 text-sm">
                    {activeExperiment.techniques && activeExperiment.techniques.slice(0, 2).map((technique, index) => (
                      <span key={index} className="bg-gray-800 px-3 py-1 rounded-full">
                        {technique}
                      </span>
                    ))}
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: activeExperiment.description }} />
                    
                    {/* Additional sections */}
                    <div className="mt-8">
                      <h3 className="text-xl font-medium mb-4">Techniques Used</h3>
                      <ul className="space-y-2">
                        {activeExperiment.techniques.map((technique, index) => (
                          <li key={index}>{technique}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {activeExperiment.equipment && (
                      <div className="mt-8">
                        <h3 className="text-xl font-medium mb-4">Equipment</h3>
                        <ul className="space-y-2">
                          {activeExperiment.equipment.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {activeExperiment.results && (
                      <div className="mt-8">
                        <h3 className="text-xl font-medium mb-4">Results & Findings</h3>
                        <p>{activeExperiment.results}</p>
                      </div>
                    )}
                    
                    {activeExperiment.collaborators && (
                      <div className="mt-8">
                        <h3 className="text-xl font-medium mb-4">Collaborators</h3>
                        <ul className="space-y-2">
                          {activeExperiment.collaborators.map((collab, index) => (
                            <li key={index}>{collab.name} — <span className="text-gray-400">{collab.role}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Behind the Experiment images */}
                  {activeExperiment.images && activeExperiment.images.length > 1 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-medium mb-6">Behind the Experiment</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {activeExperiment.images.slice(1).map((image, index) => (
                          <div key={index} className="aspect-square overflow-hidden rounded-lg">
                            <img 
                              src={image} 
                              alt={`${activeExperiment.title} - Image ${index+1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-12">
                    <Link href={`/experiments/${activeExperiment.slug}`} className="inline-flex items-center text-amber-400 hover:text-amber-300">
                      <span>View Full Case Study</span>
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-2xl mb-4">No experiments yet</h3>
                  <p className="text-gray-400">More experimental work coming soon</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
