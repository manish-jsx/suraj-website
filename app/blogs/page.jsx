'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import blogData from '@/data/blogs.json';

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Using local data instead of fetching from Sanity
    const fetchedPosts = blogData.blogs;
    
    // Extract unique categories
    const uniqueCategories = [...new Set(fetchedPosts.map(post => post.category))];
    
    setPosts(fetchedPosts);
    setFilteredPosts(fetchedPosts);
    setCategories(['All', ...uniqueCategories]);
    setLoading(false);
  }, []);
  
  // Filter posts when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.category === selectedCategory);
      setFilteredPosts(filtered);
    }
  }, [selectedCategory, posts]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Blog</h1>
        <p className="text-xl text-gray-300 mb-16 max-w-3xl">
          Insights, techniques, and reflections on the art and craft of cinematography.
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
          <>
            {/* Featured Posts */}
            {selectedCategory === 'All' && (
              <div className="mb-16">
                <h2 className="text-3xl font-serif mb-8">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.filter(post => post.featured).slice(0, 2).map((post) => (
                    <Link 
                      href={`/blogs/${post.slug}`} 
                      key={post.id}
                      className="group"
                    >
                      <div className="relative h-60">
                        <Image 
                          src={post.image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 w-full p-6">
                          <div className="text-amber-400 mb-2">{post.category}</div>
                          <h3 className="text-xl font-medium mb-1">{post.title}</h3>
                          <p className="text-sm text-gray-300">{formatDate(post.publishedDate)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Posts */}
            <div>
              <h2 className="text-3xl font-serif mb-8">
                {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link 
                    href={`/blogs/${post.slug}`} 
                    key={post.id}
                    className="group flex flex-col h-full"
                  >
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors h-full border border-gray-800 hover:border-amber-500/30 flex flex-col">
                      <div className="relative h-60">
                        <Image 
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-0 right-0 p-3">
                          {post.featured && (
                            <span className="bg-amber-500 text-black px-3 py-1 text-xs font-medium rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-amber-400 font-medium">{post.category}</span>
                          <span className="text-xs text-gray-400">{post.readingTime}</span>
                        </div>
                        <h3 className="text-xl font-medium mb-3 group-hover:text-amber-400 transition-colors font-serif">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                        <div className="flex items-center mt-auto text-sm">
                          {post.author && post.author.avatar && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 border border-amber-500/20">
                              <Image
                                src={post.author.avatar} 
                                alt={post.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            {post.author && <p className="font-medium text-sm">{post.author.name}</p>}
                            <p className="text-gray-400 text-xs">{formatDate(post.publishedDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-2xl mb-4">No articles in this category</h3>
                  <p className="text-gray-400">Check back soon for new content</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
