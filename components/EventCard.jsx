'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { urlFor } from '@/lib/sanity';
import { getRandomPlaceholderImage } from '@/utils/unsplash';

export default function EventCard({ event }) {
  const [imageError, setImageError] = useState(false);
  
  const eventDate = new Date(event.eventDate);
  const now = new Date();
  const upcoming = eventDate > now;
  
  // Format date - example: "Sep 15, 2023"
  const formattedDate = format(eventDate, "MMM d, yyyy");
  
  // Check if event has an end date and is multiple days
  const isMultiDayEvent = event.endDate && new Date(event.endDate) > eventDate;
  
  // Get image URL with fallback
  const imageUrl = event.image 
    ? urlFor(event.image).width(600).height(400).url()
    : getRandomPlaceholderImage();

  return (
    <div className={`rounded-lg overflow-hidden ${upcoming ? 'bg-gray-900/50' : 'bg-gray-900/30'}`}>
      <div className="aspect-[3/2] relative">
        <Image
          src={imageError ? '/images/placeholder.jpg' : imageUrl}
          alt={event.title || "Event"}
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {upcoming && (
          <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 text-xs font-medium rounded-full">
            Upcoming
          </div>
        )}
        {event.featured && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-amber-400 mb-2">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>
            {formattedDate}
            {isMultiDayEvent && ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {event.title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{event.location}</span>
        </div>
        
        <div className="flex justify-end">
          {upcoming && event.ticketLink && (
            <Link
              href={event.ticketLink}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Tickets
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
          {!upcoming && (
            <span className="text-gray-500 italic text-sm">Event has passed</span>
          )}
        </div>
      </div>
    </div>
  );
}
