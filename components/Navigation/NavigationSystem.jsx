'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import * as d3 from 'd3';
import MobileNav from './MobileNav';


const navigation = [

  { name: 'Works', href: '/works' },
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Workshops', href: '/workshops' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Snippets', href: '/snippets' },
  { name: 'Experiments', href: '/experiments' },
  { name: 'Contact', href: '/contact' },
];

export default function NavigationSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsScrolled(position > 50);

      // Use GSAP to animate navbar background opacity based on scroll
      gsap.to(navRef.current, {
        backgroundColor: position > 50 ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: position > 50 ? 'blur(10px)' : 'blur(0px)',
        boxShadow: position > 50 ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Navigation - Always visible on desktop */}
      <header 
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 hidden md:block ${
          isScrolled ? 'bg-black/80 backdrop-blur-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif">
            <span className="text-white">Suraj Kumar</span>
            <span className="text-amber-500"> Singh</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href || pathname.startsWith(item.href + '/') && item.href !== '/'
                    ? 'text-amber-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Mobile Navigation - Only one instance now */}
      <div className="md:hidden">
        <header 
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl font-serif z-20">
              <span className="text-white">Suraj Kumar</span>
              <span className="text-amber-500"> Singh</span>
            </Link>
            
            {/* Hamburger Menu Button */}
            <button
              className={`z-20 w-10 h-10 flex flex-col justify-center items-center ${isOpen ? 'active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col justify-center items-center">
                <motion.span
                  className="block h-0.5 w-6 bg-white mb-1.5"
                  animate={{ 
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 6 : 0
                  }}
                />
                <motion.span
                  className="block h-0.5 w-6 bg-white"
                  animate={{ 
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? -20 : 0
                  }}
                />
                <motion.span
                  className="block h-0.5 w-6 bg-white mt-1.5"
                  animate={{ 
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -6 : 0
                  }}
                />
              </div>
            </button>
          </div>
        </header>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <MobileNav 
              navigation={navigation} 
              currentPath={pathname} 
              onClose={() => setIsOpen(false)} 
            />
          )}
        </AnimatePresence>
      </div>
      
      
    </>
  );
}
