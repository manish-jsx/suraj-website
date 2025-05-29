'use client';

import { useState, useEffect, useRef } from 'react';
import { getSnippets, urlFor } from '@/lib/sanity';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoPlayer from '@/components/VideoPlayer';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [tags, setTags] = useState(['All']);
  const snippetsRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    async function fetchSnippets() {
      try {
        const snippetData = await getSnippets();
        
        setSnippets(snippetData);
        
        // Extract unique tags
        const allTags = snippetData.flatMap(snippet => snippet.tags || []);
        const uniqueTags = ['All', ...new Set(allTags)];
        setTags(uniqueTags);
        
        setLoading(false);
        
        // Set up animations after data is loaded
        setTimeout(() => {
          setupAnimations();
        }, 500);
        
      } catch (error) {
        console.error("Error fetching snippets:", error);
        setLoading(false);
      }
    }
    
    fetchSnippets();
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const setupAnimations = () => {
    const snippetItems = document.querySelectorAll('.snippet-item');
    
    snippetItems.forEach((item, index) => {
      gsap.from(item, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      });
    });
  };
  
  // Filter snippets based on selected tag
  const filteredSnippets = selectedTag === 'All' 
    ? snippets 
    : snippets.filter(snippet => snippet.tags?.includes(selectedTag));
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Snippets</h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl">
          Short clips showcasing specific cinematography techniques, lighting setups, and movement studies.
        </p>
        
        {/* Tags filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedTag === tag 
                ? 'bg-amber-500 text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div ref={snippetsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSnippets.map((snippet) => (
              <div key={snippet._id} className="snippet-item group">
                <div className="relative overflow-hidden rounded-lg">
                  <VideoPlayer
                    videoUrl={snippet.videoUrl}
                    thumbnailUrl={urlFor(snippet.thumbnail).width(600).height(400).url()}
                    title={snippet.title}
                  />
                  
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                    {formatDuration(snippet.duration)}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{snippet.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{snippet.technique}</p>
                  <p className="text-gray-300 mt-2 line-clamp-2">{snippet.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {snippet.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredSnippets.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-2xl mb-4">No snippets found</h3>
            <p className="text-gray-400">Try selecting a different tag</p>
          </div>
        )}
      </div>
    </main>
  );
}
