import Image from 'next/image';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

export default function WorkshopCard({ workshop, isPast = false, onBookNow }) {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: workshop.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors">
      {/* Image */}
      <div className="relative h-56">
        <ImageWithFallback
          src={workshop.image}
          alt={workshop.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {workshop.skillLevel && (
          <div className="absolute top-4 left-4">
            <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-medium">
              {workshop.skillLevel}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-medium">{workshop.title}</h3>
          <span className="text-amber-400 font-bold">{formatPrice(workshop.price)}</span>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-2">{workshop.description}</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formatDate(workshop.date)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{workshop.location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{workshop.duration}</span>
          </div>
        </div>
        
        {/* Capacity indicator */}
        {workshop.capacity && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{workshop.enrolled} enrolled</span>
              <span>{workshop.capacity - workshop.enrolled} spots left</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full" 
                style={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex space-x-3">
          <Link 
            href={`/workshops/${workshop.slug}`}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-center rounded-md transition-colors"
          >
            Details
          </Link>
          
          {!isPast && !workshop.waitlist && (
            <button 
              onClick={() => onBookNow(workshop)}
              className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium text-center rounded-md transition-colors"
            >
              Book Now
            </button>
          )}
          
          {!isPast && workshop.waitlist && (
            <button
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-center rounded-md transition-colors"
            >
              Join Waitlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
