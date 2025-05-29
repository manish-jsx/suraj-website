'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import workshopData from '@/data/workshops.json';

export default function WorkshopDetailPage() {
  const { slug } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    // Find workshop with matching slug
    const foundWorkshop = workshopData.workshops.find(w => w.slug === slug);
    
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
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
  
  if (!workshop) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif mb-6">Workshop Not Found</h1>
        <p className="mb-8">The workshop you're looking for doesn't exist or has been removed.</p>
        <Link href="/workshops" className="btn-primary">
          View All Workshops
        </Link>
      </div>
    );
  }

  // Format date range
  const formatDateRange = () => {
    const startDate = new Date(workshop.date);
    let dateStr = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    if (workshop.endDate) {
      const endDate = new Date(workshop.endDate);
      if (endDate.toDateString() !== startDate.toDateString()) {
        dateStr += ` - ${new Date(endDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        })}`;
      }
    }
    
    return dateStr;
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Workshop Header */}
        <div className="relative rounded-xl overflow-hidden mb-12 h-[50vh]">
          <Image
            src={workshop.image || "/images/placeholder-workshop.jpg"}
            alt={workshop.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          
          <div className="absolute bottom-0 w-full p-8">
            <div className="max-w-4xl">
              {workshop.skillLevel && (
                <span className="inline-block px-3 py-1 bg-amber-500 text-black font-medium text-sm rounded-full mb-4">
                  {workshop.skillLevel}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-serif mb-2">{workshop.title}</h1>
              <p className="text-xl text-gray-300">{workshop.description}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" ref={contentRef}>
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-serif mb-6">About This Workshop</h2>
              <div className="prose prose-invert max-w-none mb-12" 
                dangerouslySetInnerHTML={{ __html: workshop.longDescription }}
              />
              
              {workshop.equipmentRequired && workshop.equipmentRequired.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-medium mb-4">Equipment Required</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {workshop.equipmentRequired.map((item, index) => (
                      <li key={index} className="text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {workshop.testimonials && workshop.testimonials.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-medium mb-4">Testimonials</h3>
                  <div className="space-y-6">
                    {workshop.testimonials.map((testimonial, index) => (
                      <blockquote key={index} className="border-l-4 border-amber-500 pl-4 py-1">
                        <p className="text-lg italic mb-2">"{testimonial.quote}"</p>
                        <footer className="text-gray-400">— {testimonial.name}</footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm sticky top-28">
              <h3 className="text-xl font-medium mb-6">Workshop Details</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-300">{formatDateRange()}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-300">{workshop.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p className="text-gray-300">{workshop.instructor}</p>
                    {workshop.instructorBio && (
                      <p className="text-sm text-gray-400 mt-1">{workshop.instructorBio}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-300">{workshop.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-2xl text-amber-500">${workshop.price}</p>
                  </div>
                </div>
                
                {workshop.capacity && (
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 text-amber-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-gray-300">
                        {workshop.enrolled} / {workshop.capacity} seats filled
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-amber-500 h-2.5 rounded-full" 
                          style={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                {workshop.waitlist ? (
                  <button className="w-full py-3 px-6 bg-gray-700 text-white rounded-md text-center font-medium hover:bg-gray-600 transition-colors">
                    Join Waitlist
                  </button>
                ) : (
                  <button className="w-full btn-primary">
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
