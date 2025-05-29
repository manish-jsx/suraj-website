'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

export default function RecommendationEngine({ currentProject, allProjects }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated AI-driven recommendation logic
    const getRecommendations = () => {
      setIsLoading(true);
      
      // Filter out current project
      const otherProjects = allProjects.filter(project => 
        project._id !== currentProject._id
      );
      
      // Score projects based on similarity (categories, type, etc.)
      const scoredProjects = otherProjects.map(project => {
        let score = 0;
        
        // Score based on shared categories
        if (currentProject.categories && project.categories) {
          const sharedCategories = currentProject.categories.filter(category => 
            project.categories.includes(category)
          );
          score += sharedCategories.length * 10;
        }
        
        // Date proximity (more recent = higher score)
        if (project.date && currentProject.date) {
          const dateA = new Date(project.date);
          const dateB = new Date(currentProject.date);
          const monthsDifference = Math.abs(
            (dateA.getFullYear() - dateB.getFullYear()) * 12 + 
            dateA.getMonth() - dateB.getMonth()
          );
          
          if (monthsDifference < 6) score += 5;
          else if (monthsDifference < 12) score += 3;
        }
        
        // Similar title length (weak signal but adds diversity)
        if (project.title && currentProject.title) {
          const lengthDifference = Math.abs(
            project.title.length - currentProject.title.length
          );
          if (lengthDifference < 5) score += 2;
        }
        
        return { ...project, score };
      });
      
      // Sort by score (descending) and take top 3
      const topRecommendations = scoredProjects
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      
      // Add a delay to simulate AI processing
      setTimeout(() => {
        setRecommendations(topRecommendations);
        setIsLoading(false);
      }, 800);
    };
    
    if (currentProject && allProjects?.length > 0) {
      getRecommendations();
    }
  }, [currentProject, allProjects]);

  if (!currentProject || !allProjects || allProjects.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-16 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h3 className="text-2xl font-serif mb-2">You Might Also Like</h3>
          <p className="text-gray-400">Similar projects based on your current exploration</p>
        </div>
        
        <Link href="/works" className="mt-4 md:mt-0 text-amber-400 hover:text-amber-300 transition-colors flex items-center">
          <span>View All Projects</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((project, index) => (
            <Link 
              key={project._id} 
              href={`/works/${project.slug?.current || project._id}`}
            >
              <motion.div
                className="group bg-gray-900/30 hover:bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-300 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image 
                    src={project.mainImage ? urlFor(project.mainImage).width(400).height(225).url() : "/images/placeholder.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-medium group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.categories?.slice(0, 2).map((category, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-0.5 bg-gray-800 group-hover:bg-gray-700 rounded-full transition-colors"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
