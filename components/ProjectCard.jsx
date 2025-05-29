'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor } from '@/lib/sanity';

export default function ProjectCard({ project, index = 0, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Image URL with fallback
  const imageUrl = project.mainImage 
    ? urlFor(project.mainImage).width(500).height(300).url() 
    : "/images/placeholder.jpg";

  return (
    <motion.div 
      className="project-card group cursor-pointer"
      onClick={() => onClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src={imageUrl}
          alt={project.title || "Project thumbnail"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
        
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-60'
          }`}
        ></div>
        
        {/* Project Info (appears on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 
            className={`text-xl md:text-2xl font-semibold mb-2 transform transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 sm:opacity-100 sm:translate-y-0'
            }`}
          >
            {project.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {project.categories?.map((category, idx) => (
              <span 
                key={idx} 
                className={`px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-xs transform transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 sm:opacity-100 sm:translate-y-0'
                }`}
                style={{ transitionDelay: `${idx * 50 + 50}ms` }}
              >
                {category}
              </span>
            ))}
          </div>
          
          <p 
            className={`text-gray-300 text-sm line-clamp-2 transform transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 sm:opacity-0 sm:translate-y-4'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
