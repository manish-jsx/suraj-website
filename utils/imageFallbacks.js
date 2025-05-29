/**
 * Image fallback utility
 * Provides external URL fallbacks for missing local images
 */

// Mapping of file paths to external fallback URLs
export const FALLBACK_IMAGES = {
  // Cinematography samples
  '/images/cinematography-1.jpg': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080',
  '/images/cinematography-2.jpg': 'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?w=1920&h=1080',
  '/images/cinematography-3.jpg': 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1920&h=1080',
  '/images/cinematography-4.jpg': 'https://images.unsplash.com/photo-1532800783378-1bed60adaf58?w=1920&h=1080',
  
  // Color grading pairs
  '/images/before-grade.jpg': 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1920&h=1080&sat=-100',
  '/images/after-grade.jpg': 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1920&h=1080',
  
  // Timeline event images
  '/images/timeline/feature-film.jpg': 'https://images.unsplash.com/photo-1500210872423-af9c2242785b?w=800&h=600',
  '/images/timeline/documentary.jpg': 'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&h=600',
  '/images/timeline/commercial.jpg': 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=800&h=600',
  '/images/timeline/festival.jpg': 'https://images.unsplash.com/photo-1594787855674-80209cb3b58a?w=800&h=600',
  '/images/timeline/international.jpg': 'https://images.unsplash.com/photo-1473893604213-3df9c15611c0?w=800&h=600',
  '/images/timeline/innovation.jpg': 'https://images.unsplash.com/photo-1525278070609-779c7adb7b71?w=800&h=600',
  
  // Testimonial avatars
  '/images/testimonials/avatar-1.jpg': 'https://randomuser.me/api/portraits/women/44.jpg',
  '/images/testimonials/avatar-2.jpg': 'https://randomuser.me/api/portraits/men/32.jpg',
  '/images/testimonials/avatar-3.jpg': 'https://randomuser.me/api/portraits/women/68.jpg',
  
  // Poster images
  '/images/hero-poster.jpg': 'https://images.unsplash.com/photo-1574267432644-f410f8ec2474?w=1920&h=1080',
  '/images/showreel-poster.jpg': 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=1920&h=1080',
  '/images/approach-poster.jpg': 'https://images.unsplash.com/photo-1496559249665-c7e2874707ea?w=1920&h=1080',
  
  // Profile
  '/images/profile_photo.jpeg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=1500',
  
  // Textures
  '/images/textures/film-grain.png': 'https://media.istockphoto.com/id/1278021742/vector/film-grain-texture-overlay.jpg?s=612x612&w=0&k=20&c=blDXg-9M-wQWEBCio0nQhXrUCzYGNJvow45AHb1MCgM='
};

/**
 * Get fallback URL for missing images
 * 
 * @param {string} src - Original image path
 * @returns {string} - Either original src or fallback URL
 */
export function getFallbackImage(src) {
  // If src starts with http or https, it's already an external URL
  if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
    return src;
  }
  
  return FALLBACK_IMAGES[src] || src;
}
