'use client';

import { useState, useEffect } from 'react';
import { getEvents } from '@/lib/sanity';
import EventCard from '@/components/EventCard';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);
  
  // Group events by upcoming and past
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.eventDate) >= currentDate);
  const pastEvents = events.filter(event => new Date(event.eventDate) < currentDate);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Events</h1>
        <p className="text-xl text-gray-300 mb-16 max-w-3xl">
          Screenings, exhibitions, and appearances where you can experience my work and connect in person.
        </p>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {upcomingEvents.length > 0 && (
              <section className="mb-24">
                <h2 className="text-3xl font-serif mb-8">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map(event => (
                    <EventCard key={event._id} event={event} upcoming={true} />
                  ))}
                </div>
              </section>
            )}
            
            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif mb-8">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastEvents.map(event => (
                    <EventCard key={event._id} event={event} upcoming={false} />
                  ))}
                </div>
              </section>
            )}
            
            {events.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl mb-4">No events scheduled at the moment</h3>
                <p className="text-gray-400">Check back soon or subscribe to get notified about upcoming events</p>
              </div>
            )}
          </>
        )}
        
        <div className="mt-24 pt-12 border-t border-gray-800">
          <NewsletterSignup />
        </div>
      </div>
    </main>
  );
}
