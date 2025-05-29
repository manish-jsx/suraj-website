'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity';
import VideoPreview from '@/components/VideoPreview';
import PasswordProtection from '@/components/PasswordProtection';

export default function PreviewsPage() {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    // Check if the user is already authorized (could use cookies or local storage)
    const isAuthorized = localStorage.getItem('preview-access') === 'granted';
    setAuthorized(isAuthorized);
    
    async function fetchPreviews() {
      try {
        const previewData = await client.fetch(`
          *[_type == "preview"] | order(createdAt desc) {
            _id,
            title,
            description,
            videoUrl,
            clientName,
            createdAt,
            expiryDate,
            password,
            feedbackEnabled,
            thumbnailImage
          }
        `);
        
        // Filter out expired previews
        const currentDate = new Date();
        const validPreviews = previewData.filter(preview => 
          !preview.expiryDate || new Date(preview.expiryDate) > currentDate
        );
        
        setPreviews(validPreviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching previews:", error);
        setLoading(false);
      }
    }
    
    if (isAuthorized) {
      fetchPreviews();
    } else {
      setLoading(false);
    }
  }, []);
  
  const handleAccess = (granted) => {
    if (granted) {
      setAuthorized(true);
      localStorage.setItem('preview-access', 'granted');
      setLoading(true);
      
      // Fetch previews after authorization
      async function fetchPreviews() {
        try {
          const previewData = await client.fetch(`
            *[_type == "preview"] | order(createdAt desc) {
              _id,
              title,
              description,
              videoUrl,
              clientName,
              createdAt,
              expiryDate,
              password,
              feedbackEnabled,
              thumbnailImage
            }
          `);
          
          const currentDate = new Date();
          const validPreviews = previewData.filter(preview => 
            !preview.expiryDate || new Date(preview.expiryDate) > currentDate
          );
          
          setPreviews(validPreviews);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching previews:", error);
          setLoading(false);
        }
      }
      
      fetchPreviews();
    }
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 reveal-text">Client Previews</h1>
        <p className="text-xl text-gray-300 mb-16 max-w-3xl">
          Exclusive access to work-in-progress and client review materials.
        </p>
        
        {!authorized ? (
          <PasswordProtection onAccessAttempt={handleAccess} />
        ) : loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {previews.map((preview) => (
              <VideoPreview key={preview._id} preview={preview} />
            ))}
            
            {previews.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl mb-4">No previews available</h3>
                <p className="text-gray-400">Any work-in-progress videos shared with you will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
