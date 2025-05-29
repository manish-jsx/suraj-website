'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { motion } from 'framer-motion';

export default function WorksGrid({ projects }) {
  const [imageErrors, setImageErrors] = useState({});
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const handleImageError = (projectId) => {
    setImageErrors(prev => ({
      ...prev,
      [projectId]: true
    }));
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {projects.map((project) => {
        let imageUrl = "/images/placeholder.jpg";
        
        try {
          // Try to get image URL, use fallback if there's an error
          imageUrl = imageErrors[project._id] 
            ? "/images/placeholder.jpg" 
            : urlFor(project.mainImage).width(600).height(375).url();
        } catch (error) {
          console.error("Error getting image URL:", error);
        }
          
        return (
          <motion.div key={project._id} variants={item} className="group">
            <Link href={`/works/${project.slug?.current || project._id}`}>
              <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
                <Image
                  src={imageUrl}
                  alt={project.title || "Project thumbnail"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => handleImageError(project._id)}
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-full">
                  <h3 className="text-xl font-bold mb-2">{project.title || "Untitled Project"}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{project.description || "No description available"}</p>
                </div>
              </div>
            </Link>
            <div className="mt-4">
              <h3 className="text-lg font-medium">{project.title || "Untitled Project"}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.categories?.map((category, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-gray-800 rounded-full"
                  >
                    {category}
                  </span>
                )) || (
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded-full">
                    Uncategorized
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
