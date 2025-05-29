'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  const infoRef = useRef(null);
  
  useEffect(() => {
    // Fix animation to ensure it completes properly
    if (!infoRef.current) return;
    
    // Set initial state for animation
    gsap.set(infoRef.current.querySelectorAll('.contact-item'), {
      y: 20,
      opacity: 0
    });
    
    // Animate to final state
    gsap.to(infoRef.current.querySelectorAll('.contact-item'), {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.3
    });
  }, []);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif mb-12 reveal-text">Get In Touch</h1>
            
            <div ref={infoRef} className="mb-12">
              <div className="contact-item bg-gray-900/50 p-6 rounded-lg backdrop-blur-sm mb-8">
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <a href="mailto:hello@cinematographer.com" className="text-gray-300 hover:text-white transition-colors">
                  hello@cinematographer.com
                </a>
              </div>
              
              <div className="contact-item bg-gray-900/50 p-6 rounded-lg backdrop-blur-sm mb-8">
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              
              <div className="contact-item bg-gray-900/50 p-6 rounded-lg backdrop-blur-sm mb-8">
                <h3 className="text-xl font-semibold mb-2">Studio</h3>
                <address className="text-gray-300 not-italic">
                  123 Cinematography Lane<br />
                  New York, NY 10001
                </address>
              </div>
              
              <div className="contact-item bg-gray-900/50 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Representation</h3>
                <div className="text-gray-300">
                  <p className="font-medium mb-1">Agency Name</p>
                  <a href="mailto:agent@agencyname.com" className="block mb-1 hover:text-white transition-colors">
                    agent@agencyname.com
                  </a>
                  <a href="tel:+19876543210" className="hover:text-white transition-colors">
                    +1 (987) 654-321
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.2,5.9c-0.8,0.3-1.6,0.6-2.5,0.7c0.9-0.5,1.5-1.4,1.9-2.4c-0.8,0.5-1.7,0.8-2.7,1c-0.8-0.8-1.9-1.3-3.1-1.3 c-2.3,0-4.2,1.9-4.2,4.2c0,0.3,0,0.6,0.1,0.9C7.9,8.9,5,7.2,3,4.7C2.5,5.3,2.3,6,2.3,6.8c0,1.5,0.7,2.7,1.8,3.5 c-0.7,0-1.3-0.2-1.9-0.5v0c0,2,1.4,3.7,3.4,4.1c-0.4,0.1-0.7,0.1-1.1,0.1c-0.3,0-0.5,0-0.8-0.1c0.5,1.7,2.1,2.9,4 2.9 c-1.5,1.2-3.3,1.9-5.3,1.9c-0.3,0-0.7,0-1-0.1c1.9,1.2,4.1,1.9,6.5,1.9c7.8,0,12.1-6.5,12.1-12.1c0-0.2,0-0.4,0-0.5 C20.9,7.5,21.6,6.7,22.2,5.9z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
