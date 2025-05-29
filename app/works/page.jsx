'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import projectData from '@/data/projects.json';

export default function WorksPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using the project data - assuming there is a projects.json file
    // If not, you should create this file with appropriate project data
    const fetchedProjects = projectData?.projects || [];
    
    // Extract unique categories
    const uniqueCategories = [...new Set(fetchedProjects.flatMap(p => p.categories || []))];
    
    setProjects(fetchedProjects);
    setFilteredProjects(fetchedProjects);
    setCategories(['All', ...uniqueCategories]);
    setLoading(false);
  }, []);
  
  // Filter projects when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.categories && project.categories.includes(selectedCategory)
      );
      setFilteredProjects(filtered);
    }
  }, [selectedCategory, projects]);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Portfolio</h1>
        <p className="text-xl text-gray-300 mb-16 max-w-3xl">
          A showcase of my cinematography work across feature films, commercials, documentaries, and experimental projects.
        </p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/works/${project.slug}`}>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                    <Image
                      src={project.mainImage || "/images/placeholder-project.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                      <div className="flex gap-2 mb-2">
                        {project.categories && project.categories.map((category, i) => (
                          <span key={i} className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-medium">{project.title}</h3>
                    </div>
                  </div>
                </Link>
                
                <h3 className="text-xl font-medium mb-1">{project.title}</h3>
                <p className="text-gray-400 line-clamp-2">{project.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-2xl mb-4">No projects in this category</h3>
            <p className="text-gray-400">Please select a different category</p>
          </div>
        )}
      </div>
    </main>
  );
}
