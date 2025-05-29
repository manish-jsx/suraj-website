'use client';

import { useState } from 'react';

export default function PasswordProtection({ onAccessAttempt }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // In a real app, you would verify this against an actual password
    // For this demo, we'll accept "preview123" as the password
    setTimeout(() => {
      if (password === 'preview123') {
        onAccessAttempt(true);
      } else {
        setError('Invalid password. Please try again or contact for access.');
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Client Access Required</h2>
          <p className="text-gray-400 mt-2">
            This area is password protected. Please enter the password provided to you.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 rounded-md transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Verifying...' : 'Access Preview'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Need access? Contact us at{' '}
          <a href="mailto:client@cinematographer.com" className="text-amber-400 hover:text-amber-300">
            client@cinematographer.com
          </a>
        </div>
      </div>
    </div>
  );
}
