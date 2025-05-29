import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Navigation links for footer
  const footerLinks = [
    { name: 'Works', href: '/works' },
    { name: 'Experiments', href: '/experiments' },
    { name: 'Workshops', href: '/workshops' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blogs' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];
  
  // Social media links
  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/', icon: 'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.247-.67.636-1.278 1.153-1.772A4.88 4.88 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.352-.3.882-.344 1.857-.047 1.054-.059 1.37-.059 4.04 0 2.668.012 2.985.059 4.04.045.975.207 1.504.344 1.856.182.467.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.345 1.054.046 1.37.058 4.04.058 2.67 0 2.987-.012 4.04-.058.976-.045 1.505-.208 1.858-.345.466-.182.8-.399 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.881.344-1.856.048-1.055.059-1.372.059-4.04 0-2.67-.011-2.986-.059-4.04-.045-.975-.207-1.505-.344-1.858a3.09 3.09 0 00-.748-1.15 3.09 3.09 0 00-1.15-.747c-.353-.137-.882-.3-1.857-.345-1.054-.048-1.371-.059-4.04-.059zm0 3.064A5.139 5.139 0 0117.138 12 5.139 5.139 0 0112 17.138 5.139 5.139 0 016.862 12 5.139 5.139 0 0112 6.862zm0 8.474A3.338 3.338 0 018.664 12 3.338 3.338 0 0112 8.664 3.338 3.338 0 0115.336 12 3.338 3.338 0 0112 15.336zm5.338-9.462a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z' },
    { name: 'Twitter', href: 'https://twitter.com/', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
    { name: 'IMDb', href: 'https://imdb.com/', icon: 'M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.815c.27 0 .44-.06.5-.165.062-.104.095-.404.095-.9V10.52c0-.386-.023-.63-.068-.736a.434.434 0 0 0-.107-.135v.005zm-2.13-1.972c-.868 0-1.247.745-1.247 2.235 0 .712.123 1.258.37 1.638.248.38.605.57 1.075.57.802 0 1.203-.738 1.203-2.214 0-1.514-.414-2.23-1.244-2.23h-.157zm-10.17 9.995V4.686h19.568v12.925H2.01z' },
    { name: 'Vimeo', href: 'https://vimeo.com/', icon: 'M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z' },
  ];
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-10">
        {/* Top section with logo and links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-serif inline-block">
              <div className="flex items-center">
                <span className="text-white">Suraj Kumar</span>
                <span className="text-amber-500"> Singh</span>
                <span className="ml-1 text-xs text-gray-500 mt-2">
                  Cinematography
                </span>
              </div>
            </Link>
          </div>
          
          {/* Social links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-amber-500 flex items-center justify-center 
                          transition-colors duration-300"
                aria-label={social.name}
              >
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={social.icon} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Navigation links with stylish divider */}
        <div className="relative mb-10">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent top-0"></div>
          <nav className="py-8">
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-y-4">
              {footerLinks.map((link) => (
                <li key={link.name} className="text-center">
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent bottom-0"></div>
        </div>
        
        {/* Copyright and attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Suraj Kumar Singh. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <span>Powered by</span>
            <Link 
              href="https://octavertexmedia.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="bg-black rounded relative">
                <Image
                  src="https://www.octavertexmedia.com/logo/octavertex-logo.png"
                  alt="Octavertex Media"
                  width={100}
                  height={22}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
