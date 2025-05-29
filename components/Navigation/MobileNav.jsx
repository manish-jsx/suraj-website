'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function MobileNav({ navigation, currentPath, onClose }) {
  const menuRef = useRef(null);
  
  // GSAP animation for menu items
  useEffect(() => {
    const menuItems = menuRef.current.querySelectorAll('.menu-item');
    
    gsap.fromTo(menuItems, 
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.08, 
        duration: 0.6, 
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }, []);

  // Variants for container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren" 
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren"
      } 
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 overflow-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <nav className="h-full">
        <div ref={menuRef} className="container mx-auto px-6 py-20 flex flex-col justify-center h-full">
          <ul className="space-y-6 mb-10">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || 
                (currentPath.startsWith(item.href) && item.href !== '/');
              
              return (
                <li key={item.name} className="menu-item">
                  <Link 
                    href={item.href}
                    className={`text-3xl font-serif block ${
                      isActive ? 'text-amber-500' : 'text-white hover:text-amber-300'
                    }`}
                    onClick={onClose}
                  >
                    <div className="flex items-center group">
                      <span className="relative overflow-hidden">
                        {item.name}
                        <motion.span
                          className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 w-full transform origin-left ${
                            isActive ? 'scale-100' : 'scale-0'
                          }`}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                      {isActive && (
                        <motion.svg 
                          className="w-4 h-4 ml-2 text-amber-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Social Links */}
          <div className="menu-item">
            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Connect</h4>
            <div className="flex space-x-4">
              {['Instagram', 'Vimeo', 'LinkedIn', 'Twitter'].map(social => (
                <motion.a 
                  key={social} 
                  href="#" 
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
