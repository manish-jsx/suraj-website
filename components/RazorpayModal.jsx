'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function RazorpayModal({ isOpen, onClose, workshop }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Load Razorpay script
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);
  
  if (!mounted || !isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, formData.quantity + amount);
    setFormData(prev => ({ ...prev, quantity: newQuantity }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // In a real implementation, you would call your backend API here
    // to create a Razorpay order ID
    
    try {
      // Simulate API call to create order
      setTimeout(() => {
        const options = {
          key: 'rzp_test_YOUR_KEY_ID', // Replace with actual test key in production
          amount: workshop.price * formData.quantity * 100, // Razorpay expects amount in paise
          currency: "INR",
          name: "Cinematographer Workshop",
          description: workshop.title,
          image: "/images/logo.png",
          order_id: "order_" + Math.random().toString(36).substring(2, 15), // This should come from your backend
          handler: function (response) {
            // Handle successful payment
            alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            onClose();
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          notes: {
            workshop_id: workshop._id,
            quantity: formData.quantity
          },
          theme: {
            color: "#F59E0B"
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error initiating payment:", error);
      setIsProcessing(false);
    }
  };
  
  const totalAmount = workshop.price * formData.quantity;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Book Workshop</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-medium text-xl mb-2">{workshop.title}</h3>
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <span>{new Date(workshop.startDate).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{workshop.location}</span>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Number of Seats
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-l-md"
                    disabled={formData.quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-16 text-center py-1 bg-gray-800 border-t border-b border-gray-700"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Workshop Price</span>
                <span>₹{workshop.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Quantity</span>
                <span>x {formData.quantity}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 rounded-md transition-colors disabled:opacity-70"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
