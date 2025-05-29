'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import experimentData from '@/data/experiments.json';

export default function ExperimentDetailPage() {
  const { slug } = useParams();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find experiment with matching slug
    const foundExperiment = experimentData.experiments.find(exp => exp.slug === slug);
    
    if (foundExperiment) {
      setExperiment(foundExperiment);
    }
    
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif mb-6">Experiment Not Found</h1>
        <p className="mb-8">The experiment you're looking for doesn't exist or has been removed.</p>
        <Link href="/experiments" className="btn-primary">
          View All Experiments
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <article className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <span className="inline-block bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm">
                  Experimental
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
                {experiment.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-6">
                {experiment.excerpt}
              </p>
              
              <div className="flex items-center text-sm text-gray-400">
                <time dateTime={experiment.date}>
                  {new Date(experiment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </motion.div>
          </div>
          
          {/* Main Image or Video */}
          <div className="mb-12">
            {experiment.videoUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={experiment.videoUrl}
                  controls
                  poster={experiment.images && experiment.images[0]}
                  className="w-full h-full object-contain"
                ></video>
              </div>
            ) : experiment.images && experiment.images[0] ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={experiment.images[0]} 
                  alt={experiment.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </div>
          
          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-16">
            <div dangerouslySetInnerHTML={{ __html: experiment.description }} />
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Techniques</h3>
              <ul className="space-y-2">
                {experiment.techniques.map((technique, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-amber-500">•</span>
                    <span>{technique}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Equipment</h3>
              <ul className="space-y-2">
                {experiment.equipment.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-amber-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Results Section */}
          {experiment.results && (
            <div className="mb-16">
              <h3 className="text-2xl font-serif mb-6">Results & Findings</h3>
              <div className="bg-gray-900/30 p-8 rounded-lg">
                <p className="text-lg">{experiment.results}</p>
              </div>
            </div>
          )}
          
          {/* Collaborators Section */}
          {experiment.collaborators && experiment.collaborators.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-serif mb-6">Collaborators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {experiment.collaborators.map((collab, index) => (
                  <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="font-medium">{collab.name}</h4>
                    <p className="text-gray-400 text-sm">{collab.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Image Gallery */}
          {experiment.images && experiment.images.length > 1 && (
            <div className="mb-16">
              <h3 className="text-2xl font-serif mb-6">Visual Documentation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {experiment.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${experiment.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="border-t border-gray-800 pt-8">
            <Link href="/experiments" className="inline-flex items-center text-gray-400 hover:text-white">
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Experiments</span>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
