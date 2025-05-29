'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Works', path: '/works' },
  { name: 'About', path: '/about' },
  { name: 'Experiments', path: '/experiments' },
  { name: 'Blog', path: '/blogs' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' }
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Update scroll state on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Animation variants
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        when: 'beforeChildren',
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const linkVariants = {
    closed: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <header className={`fixed top-0 left-0 w-full z-50 md:hidden transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif z-20">
            <span className="text-white">Lens</span>
            <span className="text-amber-500">Craft</span>
          </Link>
          
          {/* Hamburger Menu Button */}
          <button 
            className="z-20 w-10 h-10 flex flex-col justify-center items-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-0.5 bg-white mb-1.5"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-white"
              animate={{ opacity: isOpen ? 0 : 1 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-white mt-1.5"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
            />
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-gray-900 p-6"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="h-full flex flex-col">
                {/* Nav Links */}
                <nav className="mt-16 flex-1">
                  <ul className="space-y-6">
                    {navLinks.map((link) => (
                      <motion.li key={link.name} variants={linkVariants}>
                        <Link 
                          href={link.path} 
                          className={`text-2xl font-medium block py-2 border-b border-gray-800 ${
                            pathname === link.path ? 'text-amber-500' : 'text-gray-100'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
                
                {/* Social Links */}
                <motion.div variants={linkVariants} className="pt-8">
                  <h4 className="text-gray-400 uppercase text-sm tracking-wider mb-4">Connect</h4>
                  <div className="flex space-x-5">
                    <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                      <span className="sr-only">Vimeo</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457c1.1899-.996 2.3549-1.989 3.4969-2.98 1.572-1.36 2.732-2.081 3.485-2.159 1.822-.152 2.951 1.08 3.374 3.661.45 2.885.767 4.683.926 5.394.5089 2.33 1.0739 3.487 1.676 3.487.472 0 1.1859-.749 2.134-2.246.946-1.497 1.452-2.634 1.52-3.411.121-1.289-.368-1.9379-1.494-1.9379-.5309 0-1.0799.122-1.643.362 1.097-3.59 3.1849-5.338 6.267-5.228 2.27.058 3.348 1.582 3.217 4.559z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
