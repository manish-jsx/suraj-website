'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Simulate API call to subscribe
    setTimeout(() => {
      // In a real app, you would submit to your API or newsletter service
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h3 className="text-2xl md:text-3xl font-serif mb-4">Stay Updated</h3>
      <p className="text-gray-300 mb-8">
        Be the first to know about upcoming events, workshops, and cinematography insights.
      </p>
      
      {submitted ? (
        <div className="bg-green-900/30 border border-green-800 text-green-200 p-4 rounded-lg">
          <p className="font-medium">Thank you for subscribing!</p>
          <p className="text-sm mt-1">You'll receive updates about upcoming events and exclusive content.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow">
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-6 py-3 rounded-md md:rounded-l-none transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
      
      {error && (
        <p className="mt-3 text-red-400 text-sm">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 mt-4">
        By subscribing, you agree to receive email communications. You can unsubscribe at any time.
      </p>
    </div>
  );
}
