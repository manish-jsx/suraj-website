'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { getProjects, getShowreel, urlFor, getRandomPlaceholderVideo } from '@/lib/sanity';
import CinematicHero from '@/components/CinematicHero';
import ProjectCard from '@/components/ProjectCard';
import TestimonialSlider from '@/components/TestimonialSlider';
import LensFlare from '@/components/effects/LensFlare';
import FilmGrainOverlay from '@/components/effects/FilmGrainOverlay';
import ReelViewer from '@/components/ReelViewer';
import ParallaxSection from '@/components/ParallaxSection';
import CareerTimeline from '@/components/CareerTimeline';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

export default function Home() {
  const [showreel, setShowreel] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  
  const introRef = useRef(null);
  const reelRef = useRef(null);
  const projectsRef = useRef(null);
  const approachRef = useRef(null);
  const testimonialRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Fetch data
    const fetchData = async () => {
      try {
        const showreelData = await getShowreel();
        const projects = await getProjects();
        const featured = projects.filter(project => project.featured);
        
        setShowreel(showreelData);
        setFeaturedProjects(featured.length > 0 ? featured : projects.slice(0, 3));
        setCurrentProject(featured[0] || projects[0]);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set fallback data
        setShowreel({
          title: 'Cinematography Showreel',
          description: 'A visual journey through light and shadow',
          videoUrl: getRandomPlaceholderVideo()
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Text reveal animations
    const splitTextElements = document.querySelectorAll('.reveal-text');
    splitTextElements.forEach(element => {
      const text = new SplitType(element, { types: 'chars,words' });
      
      gsap.from(text.chars, {
        opacity: 0,
        y: 20,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
        }
      });
    });
    
    // Scroll animations
    if (introRef.current) {
      gsap.fromTo(
        introRef.current, 
        { opacity: 0, y: 100 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%"
          }
        }
      );
    }
    
    // Add null check for projectsRef before accessing its properties
    if (projectsRef.current) {
      const projectCards = projectsRef.current.querySelectorAll('.project-card');
      if (projectCards.length > 0) {
        gsap.fromTo(
          projectCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1, 
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectsRef.current,
              start: "top 70%"
            }
          }
        );
      }
    }
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const handleProjectClick = (project) => {
    setCurrentProject(project);
    setProjectModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="cinematic-loader-container">
        <div className="cinematic-loader">
          <div className="film-reel"></div>
          <div className="loading-text">Loading</div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative overflow-hidden">
      {/* Cinematic Effects */}
      <FilmGrainOverlay opacity={0.05} />
      <LensFlare />
      
      {/* Hero Section */}
      <CinematicHero showreel={showreel} />
      
      {/* Introduction Section */}
      <section 
        ref={introRef}
        className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-gray-900/60 to-black overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,184,0,0.1),_transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.08),_transparent_70%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-8 reveal-text">
                Crafting Visual Stories Through Light & Shadow
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Every frame tells a story. As a cinematographer, I blend technical precision with artistic vision to create compelling visual narratives that resonate with audiences and elevate the director's vision.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/works" className="btn-primary">
                  Explore My Work
                </Link>
                <Link href="/about" className="btn-secondary">
                  About Me
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden transform translate-y-8">
                    <Image
                      src="/images/cinematography-1.jpg"
                      alt="Cinematography"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1500210872423-af9c2242785b?q=80&w=1000";
                      }}
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/cinematography-2.jpg"
                      alt="Cinematography"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000";
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/cinematography-3.jpg"
                      alt="Cinematography"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000";
                      }}
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden transform -translate-y-8">
                    <Image
                      src="/images/cinematography-4.jpg"
                      alt="Cinematography"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1606767417686-5df5352f27af?q=80&w=1000";
                      }}
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-amber-500/20 backdrop-blur-sm"
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.6, 1, 0.6]
                }} 
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div 
                className="absolute -bottom-10 -right-6 w-20 h-20 rounded-full bg-blue-500/10 backdrop-blur-sm"
                animate={{ 
                  y: [0, 20, 0],
                  opacity: [0.3, 0.7, 0.3]
                }} 
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Showreel Section */}
      <ParallaxSection>
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6 reveal-text">The Art of Visual Storytelling</h2>
            <p className="text-lg text-gray-300">
              Explore my visual approach through selected works and showreel highlights
            </p>
          </div>
          
          <div ref={reelRef} className="mb-20">
            <ReelViewer 
              videoUrl={showreel?.videoUrl || getRandomPlaceholderVideo()} 
              title={showreel?.title}
              description={showreel?.description}
            />
          </div>
        </div>
      </ParallaxSection>
      
      {/* Featured Projects */}
      <section ref={projectsRef} className="py-24 sm:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 reveal-text">Featured Work</h2>
              <p className="text-gray-300 max-w-2xl">
                A curated selection of projects showcasing my cinematographic approach across different genres and formats.
              </p>
            </div>
            <Link href="/works" className="mt-6 md:mt-0 group inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors">
              <span>View All Projects</span>
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                index={index}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Creative Approach */}
      <section ref={approachRef} className="py-24 sm:py-32 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif mb-8 reveal-text">Creative Approach</h2>
              
              <div className="space-y-8">
                <motion.div 
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lighting as Language</h3>
                  <p className="text-gray-300">
                    Light, shadow, and color are my primary tools for visual storytelling, carefully crafting each scene's emotional tone.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Movement with Meaning</h3>
                  <p className="text-gray-300">
                    Camera movement serves the narrative, whether using subtle handheld work for intimacy or sweeping movements for grandeur.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Composition & Framing</h3>
                  <p className="text-gray-300">
                    Thoughtful framing creates visual metaphors and guides the viewer's eye to what matters most in each moment.
                  </p>
                </motion.div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[9/16] md:aspect-square relative z-10 rounded-lg overflow-hidden shadow-2xl">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/images/approach-poster.jpg"
                  onError={(e) => {
                    const fallbackVideo = getRandomPlaceholderVideo();
                    e.currentTarget.src = fallbackVideo;
                  }}
                >
                  <source src="/videos/creative-approach.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 rounded-lg overflow-hidden border-2 border-amber-500/30 -z-10">
                <div className="w-full h-full bg-gradient-radial from-amber-500/20 to-black/0"></div>
              </div>
              
              <div className="absolute -top-10 -left-10 w-1/2 h-1/2 rounded-full overflow-hidden -z-10">
                <div className="w-full h-full bg-gradient-radial from-blue-700/20 to-black/0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Career Timeline */}
      <CareerTimeline />
      
      {/* Testimonials */}
      <section ref={testimonialRef} className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 reveal-text">
              Client Testimonials
            </h2>
            <p className="text-gray-300">
              Words from directors, producers, and creative teams I've collaborated with
            </p>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>
      
      {/* Color Grading Section */}
      <section className="py-24 sm:py-32 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 reveal-text">
              The Art of Color Grading
            </h2>
            <p className="text-lg text-gray-300">
              See the transformative power of professional color grading in cinematography
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <BeforeAfterSlider 
              beforeImage="/images/before-grade.jpg" 
              afterImage="/images/after-grade.jpg"
              beforeLabel="Ungraded"
              afterLabel="Color Graded"
              height={500}
            />
            
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Color grading is more than technical adjustment—it's emotional storytelling through visual tone.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,184,0,0.15),_transparent_70%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6 reveal-text">
                Let's Create Something Extraordinary
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Whether you're working on a feature film, documentary, commercial, or music video,
                I'm ready to bring your vision to life through the lens.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary btn-lg">
                  Start a Project
                </Link>
                <Link href="/works" className="btn-secondary btn-lg">
                  Explore My Work
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Project Modal */}
      <AnimatePresence>
        {projectModalOpen && currentProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 max-w-4xl w-full rounded-lg overflow-hidden relative"
            >
              <button 
                className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-white/20"
                onClick={() => setProjectModalOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <div className="aspect-video relative">
                {currentProject.videoUrl ? (
                  <video 
                    src={currentProject.videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={currentProject.mainImage ? urlFor(currentProject.mainImage).width(1280).height(720).url() : null}
                  ></video>
                ) : (
                  <Image 
                    src={currentProject.mainImage ? urlFor(currentProject.mainImage).width(1280).height(720).url() : "/images/placeholder.jpg"} 
                    alt={currentProject.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-serif mb-2">{currentProject.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentProject.categories && currentProject.categories.map((category, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs">
                      {category}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-300">{currentProject.description}</p>
                
                <div className="mt-6">
                  <Link 
                    href={`/works/${currentProject.slug?.current || currentProject._id}`}
                    className="inline-flex items-center text-amber-400 hover:text-amber-300"
                  >
                    <span>View Project Details</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
