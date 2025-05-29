'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '@/data/projects.json';

export default function WorkDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Find project with matching slug
    const foundProject = projectData?.projects?.find(p => p.slug === slug) || null;
    
    if (foundProject) {
      setProject(foundProject);
      
      // Find related projects with at least one matching category
      if (foundProject.categories && foundProject.categories.length > 0) {
        const related = (projectData?.projects || [])
          .filter(p => 
            p.slug !== slug && 
            p.categories && 
            p.categories.some(cat => foundProject.categories.includes(cat))
          )
          .slice(0, 3);
          
        setRelatedProjects(related);
      }
    }
    
    setLoading(false);
    
    // Animations for content
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-in');
      
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif mb-6">Project Not Found</h1>
        <p className="mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Link href="/works" className="btn-primary">
          View All Projects
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <article>
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={project.mainImage || "/images/placeholder-project.jpg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="max-w-4xl">
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.categories && project.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="text-sm px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl">
                  {project.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-16" ref={contentRef}>
          <div className="max-w-4xl mx-auto">
            <div className="animate-in">
              <h2 className="text-3xl font-serif mb-6">About This Project</h2>
              <div className="prose prose-lg prose-invert max-w-none mb-16">
                {project.content ? (
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                ) : (
                  <p>
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-in">
              <div>
                <h3 className="text-lg font-medium mb-2">Client</h3>
                <p className="text-gray-300">{project.client || "Various"}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Role</h3>
                <p className="text-gray-300">{project.role || "Director of Photography"}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Year</h3>
                <p className="text-gray-300">{project.year || new Date().getFullYear()}</p>
              </div>
            </div>
            
            {/* Video Player */}
            {project.videoUrl && (
              <div className="mb-16 animate-in">
                <h2 className="text-3xl font-serif mb-6">Watch</h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    src={project.videoUrl} 
                    controls 
                    poster={project.mainImage}
                    className="w-full h-full object-contain"
                  ></video>
                </div>
              </div>
            )}
            
            {/* Image Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="mb-16 animate-in">
                <h2 className="text-3xl font-serif mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.map((image, index) => (
                    <div 
                      key={index}
                      className={`rounded-lg overflow-hidden ${
                        index % 3 === 0 ? 'md:col-span-2' : ''
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Technical Approach */}
            {project.technicalApproach && (
              <div className="mb-16 animate-in">
                <h2 className="text-3xl font-serif mb-6">Technical Approach</h2>
                <div className="bg-gray-900/50 rounded-lg p-8">
                  <div className="prose prose-lg prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: project.technicalApproach }} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="animate-in">
                <h2 className="text-3xl font-serif mb-6">Related Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedProjects.map((related, index) => (
                    <Link 
                      key={index} 
                      href={`/works/${related.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <Image
                          src={related.mainImage || "/images/placeholder-project.jpg"}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-amber-400 transition-colors">
                        {related.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
