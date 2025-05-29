'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        project: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
    
    // In a real application, you would submit to your backend:
    // try {
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    //   });
    //   const data = await response.json();
    //   setIsSubmitting(false);
    //   setSubmitSuccess(true);
    //   setFormData({ name: '', email: '', project: '', message: '' });
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   setIsSubmitting(false);
    // }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif mb-6 text-center">Let's Collaborate</h2>
          <p className="text-xl text-gray-300 mb-12 text-center">
            Have a project in mind? Get in touch to discuss how we can bring your vision to life.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
              <select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              >
                <option value="">Select Project Type</option>
                <option value="Feature Film">Feature Film</option>
                <option value="Short Film">Short Film</option>
                <option value="Commercial">Commercial</option>
                <option value="Music Video">Music Video</option>
                <option value="Documentary">Documentary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white resize-none"
              ></textarea>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-red-500 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            
            {submitSuccess && (
              <div className="text-center text-green-400 mt-4">
                Your message has been sent! We'll be in touch soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
