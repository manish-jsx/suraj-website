const fs = require('fs');
const path = require('path');
const https = require('https');

// Define paths that need images
const imagePaths = [
  // Cinematography samples
  'images/cinematography-1.jpg',
  'images/cinematography-2.jpg',
  'images/cinematography-3.jpg',
  'images/cinematography-4.jpg',
  
  // Color grading pairs
  'images/before-grade.jpg',
  'images/after-grade.jpg',
  
  // Timeline event images
  'images/timeline/feature-film.jpg',
  'images/timeline/documentary.jpg',
  'images/timeline/commercial.jpg',
  'images/timeline/festival.jpg',
  'images/timeline/international.jpg',
  'images/timeline/innovation.jpg',
  
  // Testimonial avatars
  'images/testimonials/avatar-1.jpg',
  'images/testimonials/avatar-2.jpg',
  'images/testimonials/avatar-3.jpg',
  
  // Poster images
  'images/hero-poster.jpg',
  'images/showreel-poster.jpg',
  'images/approach-poster.jpg',
  
  // Profile
  'images/profile_photo.jpeg'
];

// Generate a color based on the path string (for consistent colors per image path)
function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - color.length) + color;
}

// Download a placeholder image
async function downloadImage(filePath) {
  return new Promise((resolve, reject) => {
    // Different sizes for different image types
    let width, height;
    let bgColor, textColor;
    
    if (filePath.includes('avatar')) {
      width = height = 400; // Square avatars
    } else if (filePath.includes('cinematography') || filePath.includes('grade')) {
      width = 1920;
      height = 1080; // 16:9 aspect ratio
    } else if (filePath.includes('timeline')) {
      width = 800;
      height = 600; // 4:3 aspect ratio
    } else if (filePath.includes('poster')) {
      width = 1920;
      height = 1080; // 16:9 aspect ratio
    } else if (filePath.includes('profile')) {
      width = 1000;
      height = 1500; // 2:3 aspect ratio
    } else {
      width = 1200;
      height = 800; // Default size
    }
    
    // Generate colors from filepath
    bgColor = getColor(filePath);
    textColor = '333333';
    
    // Placeholder service URL
    const imageUrl = `https://placehold.co/${width}x${height}/${bgColor}/${textColor}.png`;
    
    // Ensure directory exists
    const dir = path.dirname(path.join(process.cwd(), 'public', filePath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Download image
    const file = fs.createWriteStream(path.join(process.cwd(), 'public', filePath));
    
    https.get(imageUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Created: ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(path.join(process.cwd(), 'public', filePath), () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Download all placeholder images
async function downloadAllImages() {
  for (const imagePath of imagePaths) {
    try {
      await downloadImage(imagePath);
    } catch (error) {
      console.error(`Error downloading ${imagePath}:`, error);
    }
  }
}

// Run the downloader
downloadAllImages().then(() => {
  console.log('All placeholder images have been downloaded!');
}).catch(err => {
  console.error('Error downloading images:', err);
});
