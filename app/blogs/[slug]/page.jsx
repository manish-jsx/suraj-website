'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import blogData from '@/data/blogs.json';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find post with matching slug
    const foundPost = blogData.blogs.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Find related posts with same category
      const related = blogData.blogs
        .filter(p => p.slug !== slug && p.category === foundPost.category)
        .slice(0, 3);
      
      setRelatedPosts(related);
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

  if (!post) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif mb-6">Blog Post Not Found</h1>
        <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blogs" className="btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <main className="pt-24 pb-20">
      <article className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="text-sm px-3 py-1 bg-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6"
            >
              {post.title}
            </motion.h1>
            
            <div className="flex items-center justify-center mb-8">
              {post.author && post.author.avatar && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-left">
                {post.author && <p className="font-medium">{post.author.name}</p>}
                <p className="text-gray-400 text-sm">
                  {formatDate(post.publishedDate)} · {post.readingTime} read
                </p>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          {post.image && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-auto"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-16 
            prose-headings:font-serif prose-headings:text-amber-50 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-5
            prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-6
            prose-li:text-gray-200 prose-li:my-2
            prose-blockquote:border-l-amber-500 prose-blockquote:bg-gray-900/50 prose-blockquote:p-6 prose-blockquote:rounded-r-md
            prose-strong:text-amber-200 prose-strong:font-medium
            prose-a:text-amber-400 prose-a:no-underline prose-a:border-b prose-a:border-amber-400/30 prose-a:transition-colors hover:prose-a:border-amber-400
            prose-ul:my-6 prose-ol:my-6
            prose-img:rounded-md">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-gray-800 pt-8 mb-16">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-800 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Author Bio - Enhanced styling */}
          {post.author && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 mb-16 border-l-2 border-amber-500">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {post.author.avatar && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-amber-500/30">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-serif font-medium mb-2 text-amber-100">{post.author.name}</h3>
                  <p className="text-gray-300 leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Related Posts - Enhanced styling */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-8 inline-block pb-2 border-b-2 border-amber-500/30">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link 
                    href={`/blogs/${related.slug}`} 
                    key={related.id}
                    className="group"
                  >
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors border border-gray-800 hover:border-amber-500/30">
                      {related.image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image 
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-medium mb-2 group-hover:text-amber-400 transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-sm text-gray-400">{formatDate(related.publishedDate)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
