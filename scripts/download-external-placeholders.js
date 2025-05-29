const fs = require('fs');
const path = require('path');
const https = require('https');

// Image definitions
const imagesToCreate = [
  // Basic structure
  { path: 'images/placeholder.jpg', width: 1200, height: 800 },

  // Cinematography samples
  { path: 'images/cinematography-1.jpg', width: 1920, height: 1080 },
  { path: 'images/cinematography-2.jpg', width: 1920, height: 1080 },
  { path: 'images/cinematography-3.jpg', width: 1920, height: 1080 },
  { path: 'images/cinematography-4.jpg', width: 1920, height: 1080 },

  // Color grading pairs
  { path: 'images/before-grade.jpg', width: 1920, height: 1080 },
  { path: 'images/after-grade.jpg', width: 1920, height: 1080, isBright: true },

  // Timeline images
  { path: 'images/timeline/feature-film.jpg', width: 800, height: 600 },
  { path: 'images/timeline/documentary.jpg', width: 800, height: 600 },
  { path: 'images/timeline/commercial.jpg', width: 800, height: 600 },
  { path: 'images/timeline/festival.jpg', width: 800, height: 600 },
  { path: 'images/timeline/international.jpg', width: 800, height: 600 },
  { path: 'images/timeline/innovation.jpg', width: 800, height: 600 },

  // Testimonial avatars
  { path: 'images/testimonials/avatar-1.jpg', width: 400, height: 400, isAvatar: true },
  { path: 'images/testimonials/avatar-2.jpg', width: 400, height: 400, isAvatar: true },
  { path: 'images/testimonials/avatar-3.jpg', width: 400, height: 400, isAvatar: true },

  // Poster images
  { path: 'images/hero-poster.jpg', width: 1920, height: 1080 },
  { path: 'images/showreel-poster.jpg', width: 1920, height: 1080 },
  { path: 'images/approach-poster.jpg', width: 1920, height: 1080 },

  // Profile image
  { path: 'images/profile_photo.jpeg', width: 1000, height: 1500 },

  // Textures
  { path: 'images/textures/film-grain.png', width: 1000, height: 1000 }
];

/**
 * Helper function to get color based on path
 */
function getColorFromPath(path) {
  // Simple hash function for color generation
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = path.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Format as hex color
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - color.length) + color;
}

/**
 * Download a placeholder image from online service
 */
async function downloadPlaceholder(imageDef) {
  return new Promise((resolve, reject) => {
    // Create destination folder if it doesn't exist
    const publicPath = path.join(process.cwd(), 'public', imageDef.path);
    const dir = path.dirname(publicPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate colors
    const bg = getColorFromPath(imageDef.path);
    const fg = imageDef.isBright ? 'FFFFFF' : '333333';
    
    // URL for placeholder service
    let imageUrl;
    
    if (imageDef.isAvatar) {
      // Use RandomUser for avatars
      const gender = imageDef.path.includes('avatar-2') ? 'men' : 'women';
      const id = Math.floor(Math.random() * 90) + 10;
      imageUrl = `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
    } else if (imageDef.path.includes('film-grain')) {
      // Use a noise pattern for film grain
      imageUrl = `https://source.boringavatars.com/marble/1000/${bg}?square=true`;
    } else {
      // Use Placeholder.com service
      const text = encodeURIComponent(path.basename(imageDef.path));
      imageUrl = `https://placehold.co/${imageDef.width}x${imageDef.height}/${bg}/${fg}.jpg?text=${text}`;
    }
    
    // Download the image
    const file = fs.createWriteStream(publicPath);
    
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${imageDef.path}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(publicPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

/**
 * Main function to download all images
 */
async function downloadAllImages() {
  console.log('Downloading placeholder images...');
  
  // Process images one by one to avoid overwhelming services
  for (const imageDef of imagesToCreate) {
    try {
      await downloadPlaceholder(imageDef);
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error(`Error with ${imageDef.path}:`, error.message);
    }
  }
  
  console.log('\nAll placeholder images have been downloaded!');
  console.log(`Location: ${path.join(process.cwd(), 'public')}`);
}

// Execute if run directly
if (require.main === module) {
  downloadAllImages().catch(err => {
    console.error('Error in download process:', err);
  });
}

module.exports = { downloadPlaceholder, downloadAllImages };
