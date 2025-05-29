/**
 * Unsplash API utility functions for fetching images
 */

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_CACHE = new Map();

// Fallback placeholder images if API fails
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000',
  'https://images.unsplash.com/photo-1500210872423-af9c2242785b?q=80&w=1000',
  'https://images.unsplash.com/photo-1606767417686-5df5352f27af?q=80&w=1000',
  'https://images.unsplash.com/photo-1523207911345-32501502db22?q=80&w=1000'
];

// Category mapping for better search results
export const CINEMATOGRAPHY_QUERIES = [
  'cinematography',
  'filmmaking',
  'movie set',
  'film camera',
  'film lighting',
  'film production',
  'movie production',
  'film scene',
  'camera equipment',
  'director of photography'
];

/**
 * Fetch images from Unsplash API with proper error handling and caching
 * @param {string} query - Search query
 * @param {number} perPage - Number of results to return
 * @returns {Promise<Array>} - Array of image URLs
 */
export async function fetchUnsplashImages(query = 'cinematography', perPage = 10) {
  const cacheKey = `${query}-${perPage}`;
  
  // Return cached results if available to minimize API calls
  if (UNSPLASH_CACHE.has(cacheKey)) {
    return UNSPLASH_CACHE.get(cacheKey);
  }
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !data.results.length) {
      throw new Error('No images found');
    }
    
    // Extract image URLs from the results
    const imageUrls = data.results.map(image => ({
      regular: image.urls.regular,
      small: image.urls.small,
      thumb: image.urls.thumb,
      alt: image.alt_description || query,
      credit: {
        name: image.user.name,
        link: image.user.links.html
      }
    }));
    
    // Cache the results
    UNSPLASH_CACHE.set(cacheKey, imageUrls);
    
    return imageUrls;
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return PLACEHOLDER_IMAGES.map(url => ({
      regular: url,
      small: url,
      thumb: url
    }));
  }
}

/**
 * Get a single random image URL from Unsplash based on query
 */
export async function getRandomUnsplashImage(query = 'cinematography') {
  try {
    const images = await fetchUnsplashImages(query, 30);
    if (images.length === 0) return null;
    
    return images[Math.floor(Math.random() * images.length)];
  } catch (error) {
    console.error('Error getting random Unsplash image:', error);
    return null;
  }
}

/**
 * Get a random cinematography-related image
 */
export async function getRandomCinematographyImage() {
  const randomQuery = CINEMATOGRAPHY_QUERIES[
    Math.floor(Math.random() * CINEMATOGRAPHY_QUERIES.length)
  ];
  
  return getRandomUnsplashImage(randomQuery);
}

/**
 * Get a random placeholder image (synchronous version for components)
 */
export function getRandomPlaceholderImage() {
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
}
