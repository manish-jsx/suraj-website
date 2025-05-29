'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { getProjects } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const projectsContainerRef = useRef(null);

  useEffect(() => {
    // Fetch projects from Sanity
    async function fetchProjects() {
      const projectData = await getProjects();
      setProjects(projectData);
      if (projectData.length > 0) {
        setActiveProject(projectData[0]);
      }
    }
    
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0 || !projectsContainerRef.current) return;
    
    const projectItems = projectsContainerRef.current.querySelectorAll('.project-item');
    
    // Create horizontal scroll effect
    let ctx = gsap.context(() => {
      gsap.to(projectItems, {
        xPercent: -100 * (projectItems.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: projectsContainerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (projectItems.length - 1),
          start: "top top",
          end: () => `+=${projectsContainerRef.current.offsetWidth * (projectItems.length - 1)}`
        }
      });
    });
    
    return () => ctx.revert();
  }, [projects]);

  // Handle video seek on hover
  const handleProjectHover = (project, videoElement) => {
    if (videoElement) {
      videoElement.currentTime = 1; // Skip to a frame that's visually interesting
      videoElement.play();
    }
    setActiveProject(project);
  };

  return (
    <section className="relative bg-black text-white">
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl md:text-6xl font-playfair mb-12 reveal-text">Featured Work</h2>
      </div>
      
      <div 
        ref={projectsContainerRef}
        className="projects-container h-screen flex overflow-x-hidden"
      >
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className={`project-item min-w-full h-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12`}
          >
            <div className="w-full md:w-1/2 h-[60vh] md:h-[70vh] relative overflow-hidden rounded-lg">
              {project.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  muted
                  loop
                  preload="metadata"
                  onMouseEnter={(e) => handleProjectHover(project, e.target)}
                >
                  <source src={project.videoUrl} type="video/mp4" />
                </video>
              ) : project.mainImage && (
                <Image
                  src={urlFor(project.mainImage).url()}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onMouseEnter={() => handleProjectHover(project)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            </div>
            
            <div className="w-full md:w-1/2 p-6 md:p-12">
              <h3 className="text-3xl md:text-5xl font-playfair mb-4">{project.title}</h3>
              <p className="text-lg text-gray-300 mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.categories?.map(category => (
                  <span key={category} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
              <button className="mt-8 px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors duration-300">
                View Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
