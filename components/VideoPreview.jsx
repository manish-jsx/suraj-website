'use client';

import { useState, useRef } from 'react';
import { urlFor } from '@/lib/sanity';

export default function VideoPreview({ preview }) {
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  
  // Format timestamp (seconds to MM:SS)
  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Update current time as video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Add new feedback with timestamp
  const handleAddFeedback = () => {
    if (feedback.trim() === '') return;
    
    const newFeedback = {
      id: Date.now(),
      timestamp: currentTime,
      text: feedback,
      time: formatTimestamp(currentTime)
    };
    
    setFeedbackList([...feedbackList, newFeedback]);
    setFeedback('');
  };
  
  // Jump to specific timestamp in video
  const jumpToTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold">{preview.title}</h2>
        <div className="flex items-center text-sm text-gray-400 mt-1">
          <span>Client: {preview.clientName}</span>
          <span className="mx-2">•</span>
          <span>Added: {formatDate(preview.createdAt)}</span>
          {preview.expiryDate && (
            <>
              <span className="mx-2">•</span>
              <span className="text-red-400">Expires: {formatDate(preview.expiryDate)}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={preview.videoUrl}
              poster={urlFor(preview.thumbnailImage).width(1200).height(675).url()}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="w-full aspect-video"
            ></video>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-3">Description</h3>
            <p className="text-gray-300">{preview.description}</p>
          </div>
        </div>
        
        {preview.feedbackEnabled && (
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-xl font-medium mb-4">Feedback</h3>
              
              <div className="mb-4">
                <label htmlFor="feedback" className="sr-only">Add feedback</label>
                <div className="flex items-center">
                  <span className="bg-gray-700 px-2 py-1 rounded-l text-sm">
                    {formatTimestamp(currentTime)}
                  </span>
                  <textarea
                    id="feedback"
                    rows="2"
                    className="w-full bg-gray-700 border-0 rounded-r focus:ring-2 focus:ring-amber-500 text-sm p-2"
                    placeholder="Add comments or feedback at this timestamp..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
                <button
                  onClick={handleAddFeedback}
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-black text-sm px-3 py-1 rounded transition-colors"
                >
                  Add Feedback
                </button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {feedbackList.length > 0 ? (
                  feedbackList.map((item) => (
                    <div key={item.id} className="bg-gray-700/50 rounded p-3">
                      <button
                        className="text-amber-400 hover:text-amber-500 text-sm font-medium mb-1"
                        onClick={() => jumpToTimestamp(item.timestamp)}
                      >
                        {item.time}
                      </button>
                      <p className="text-sm text-gray-300">{item.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No feedback yet. Add your comments above.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
