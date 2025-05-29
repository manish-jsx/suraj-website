'use client';

import { useState, useEffect } from 'react';
import WorkshopCard from '@/components/WorkshopCard';
import RazorpayModal from '@/components/RazorpayModal';
import workshopData from '@/data/workshops.json';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Using local data instead of fetching from Sanity
    setWorkshops(workshopData.workshops);
    setLoading(false);
  }, []);
  
  const handleBookNow = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Group workshops by upcoming and past - using 'date' field instead of 'startDate'
  const currentDate = new Date();
  const upcomingWorkshops = workshops.filter(workshop => new Date(workshop.date) >= currentDate);
  const pastWorkshops = workshops.filter(workshop => new Date(workshop.date) < currentDate);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Workshops</h1>
        <p className="text-xl text-gray-300 mb-16 max-w-3xl">
          Hands-on learning experiences to develop your cinematography skills and advance your creative vision.
        </p>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {upcomingWorkshops.length > 0 && (
              <section className="mb-24">
                <h2 className="text-3xl font-serif mb-8">Upcoming Workshops</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {upcomingWorkshops.map(workshop => (
                    <WorkshopCard 
                      key={workshop.id} 
                      workshop={workshop} 
                      onBookNow={() => handleBookNow(workshop)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {pastWorkshops.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif mb-8">Past Workshops</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pastWorkshops.map(workshop => (
                    <WorkshopCard 
                      key={workshop.id} 
                      workshop={workshop} 
                      isPast={true}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {workshops.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl mb-4">No workshops scheduled at the moment</h3>
                <p className="text-gray-400">Check back soon for upcoming educational opportunities</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {selectedWorkshop && (
        <RazorpayModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          workshop={selectedWorkshop} 
        />
      )}
    </main>
  );
}
