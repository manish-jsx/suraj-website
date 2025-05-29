const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Read data files to extract image paths
const dataDir = path.join(__dirname, '..', 'data');
const publicDir = path.join(__dirname, '..', 'public');

// Color palette options - each array represents a gradient color scheme
const colorSchemes = [
  // Blue-Purple-Pink gradient
  ['#3a0ca3', '#7209b7', '#f72585'],
  // Teal-Cyan-Blue gradient
  ['#4cc9f0', '#4895ef', '#4361ee'],
  // Orange-Red-Purple gradient
  ['#ff9e00', '#ff4d00', '#e9194a'],
  // Green-Yellow-Orange gradient
  ['#007f5f', '#55a630', '#ffbd00'],
  // Dark blue-Purple-Pink gradient
  ['#10002b', '#5a189a', '#ff9e00'],
  // Gray-Blue gradient with texture
  ['#212529', '#343a40', '#495057'],
  // Warm tones for portraits
  ['#6f1d1b', '#bb3e03', '#ee9b00'],
  // Cool professional gradient
  ['#001219', '#005f73', '#0a9396'],
  // Film-like gradient
  ['#2b2d42', '#8d99ae', '#edf2f4']
];

// Additional image paths from assets.md and other requirements
const additionalPaths = [
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
  
  // Profiles and avatars
  'images/profile_photo.jpeg',
  'images/testimonials/avatar-1.jpg',
  'images/testimonials/avatar-2.jpg',
  'images/testimonials/avatar-3.jpg',
  
  // Poster images
  'images/hero-poster.jpg',
  'images/showreel-poster.jpg',
  'images/approach-poster.jpg',
  
  // Textures
  'images/textures/film-grain.png'
];

// Function to extract all image paths from a JSON file
function extractImagesFromJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const paths = [];
    
    // Function to recursively find all strings that look like image paths
    function findImagePaths(obj, parentKey = '') {
      if (!obj) return;
      
      if (typeof obj === 'string' && 
          (obj.match(/\.(jpg|jpeg|png|gif|webp)$/) || 
           (parentKey.includes('image') && obj.startsWith('/images/')))) {
        paths.push(obj.startsWith('/') ? obj.substring(1) : obj);
      } else if (Array.isArray(obj)) {
        obj.forEach(item => findImagePaths(item, parentKey));
      } else if (typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
          findImagePaths(value, key);
        });
      }
    }
    
    findImagePaths(data);
    return paths;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

// Get all JSON files in the data directory
const jsonFiles = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(dataDir, file));

// Extract image paths from all JSON files
let allImagePaths = [];
jsonFiles.forEach(file => {
  const paths = extractImagesFromJSON(file);
  allImagePaths = [...allImagePaths, ...paths];
});

// Add additional paths and remove duplicates
allImagePaths = [...allImagePaths, ...additionalPaths];
allImagePaths = [...new Set(allImagePaths)];

// Generate and save placeholder images
async function generatePlaceholderImages() {
  console.log(`Generating ${allImagePaths.length} placeholder images...`);
  
  for (const imagePath of allImagePaths) {
    // Determine image dimensions and type based on path/usage
    let width = 800;
    let height = 600;
    let isAvatar = false;
    
    if (imagePath.includes('avatar')) {
      width = height = 400; // Square avatars
      isAvatar = true;
    } else if (imagePath.includes('profile_photo')) {
      width = 1000;
      height = 1500; // Portrait orientation
    } else if (imagePath.includes('poster') || imagePath.includes('cinematography') || imagePath.includes('grade')) {
      width = 1920;
      height = 1080; // 16:9 ratio
    } else if (imagePath.includes('timeline')) {
      width = 800;
      height = 600; // 4:3 ratio
    } else if (imagePath.includes('textures')) {
      width = height = 1000; // Square texture
    }
    
    // Choose a color scheme based on the path to ensure consistency for related images
    const schemeIndex = Math.abs(imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colorSchemes.length;
    const colorScheme = colorSchemes[schemeIndex];
    
    await generateImage(imagePath, width, height, colorScheme, isAvatar);
  }
  
  console.log('All placeholder images generated successfully!');
}

// Function to create the gradient image
async function generateImage(imagePath, width, height, colors, isAvatar = false) {
  try {
    // Create canvas with the specified dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Choose gradient type randomly
    const gradientType = Math.floor(Math.random() * 3);
    let gradient;
    
    switch (gradientType) {
      case 0: // Linear gradient (diagonal)
        gradient = ctx.createLinearGradient(0, 0, width, height);
        break;
      case 1: // Linear gradient (horizontal)
        gradient = ctx.createLinearGradient(0, 0, width, 0);
        break;
      default: // Radial gradient
        if (isAvatar) {
          gradient = ctx.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, width/2
          );
        } else {
          gradient = ctx.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, Math.max(width, height)/1.5
          );
        }
    }
    
    // Add color stops
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // For avatars, create a circular shape
    if (isAvatar) {
      // Create circle mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Add subtle border
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = width * 0.03;
      ctx.stroke();
    } else {
      // Add texture/pattern based on the type of image
      ctx.globalAlpha = 0.1;
      const patternType = Math.floor(Math.random() * 4);
      
      switch (patternType) {
        case 0: // Grid pattern
          for (let x = 0; x < width; x += 20) {
            for (let y = 0; y < height; y += 20) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(x, y, 1, 1);
            }
          }
          break;
        case 1: // Lines
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1;
          for (let y = 0; y < height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
          break;
        case 2: // Dots
          for (let i = 0; i < width * height / 1000; i++) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath();
            ctx.arc(
              Math.random() * width,
              Math.random() * height,
              Math.random() * 3 + 1,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          break;
        case 3: // Film-grain like noise
          for (let i = 0; i < width * height / 100; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
            ctx.fillRect(
              Math.random() * width,
              Math.random() * height,
              1,
              1
            );
          }
          break;
      }
      
      // Add cinematic letterbox effect to some images
      if (width / height > 1.5 && Math.random() > 0.7) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000000';
        const letterboxHeight = height * 0.1;
        ctx.fillRect(0, 0, width, letterboxHeight);
        ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);
      }
      
      ctx.globalAlpha = 1;
    }
    
    // Add a very subtle label with the filename (for development purposes)
    const filename = path.basename(imagePath);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `${Math.max(width, height) * 0.02}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(filename, width/2, height/2);
    
    // Save the image
    const fullPath = path.join(publicDir, imagePath);
    const directory = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Write the file
    const buffer = imagePath.endsWith('.png') 
      ? canvas.toBuffer('image/png')
      : canvas.toBuffer('image/jpeg', { quality: 0.9 });
    
    fs.writeFileSync(fullPath, buffer);
    console.log(`Generated: ${imagePath}`);
    
  } catch (error) {
    console.error(`Error generating image ${imagePath}:`, error);
  }
}

// Run the generator
generatePlaceholderImages().catch(console.error);
