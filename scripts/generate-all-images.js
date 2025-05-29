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

/**
 * Extract all image paths from a JSON file
 */
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

// Extract specific image paths from workshop data
function extractWorkshopImages() {
  const workshopFile = path.join(dataDir, 'workshops.json');
  if (!fs.existsSync(workshopFile)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(workshopFile, 'utf8'));
    return data.workshops.map(workshop => workshop.image).filter(Boolean);
  } catch (error) {
    console.error('Error extracting workshop images:', error);
    return [];
  }
}

// Extract specific image paths from project data
function extractProjectImages() {
  const projectFile = path.join(dataDir, 'projects.json');
  if (!fs.existsSync(projectFile)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
    const paths = [];
    
    data.projects.forEach(project => {
      if (project.mainImage) paths.push(project.mainImage);
      if (project.gallery && Array.isArray(project.gallery)) {
        paths.push(...project.gallery);
      }
    });
    
    return paths.filter(Boolean);
  } catch (error) {
    console.error('Error extracting project images:', error);
    return [];
  }
}

// Extract specific image paths from experiment data
function extractExperimentImages() {
  const experimentFile = path.join(dataDir, 'experiments.json');
  if (!fs.existsSync(experimentFile)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(experimentFile, 'utf8'));
    const paths = [];
    
    data.experiments.forEach(experiment => {
      if (experiment.images && Array.isArray(experiment.images)) {
        paths.push(...experiment.images);
      }
    });
    
    return paths.filter(Boolean);
  } catch (error) {
    console.error('Error extracting experiment images:', error);
    return [];
  }
}

// Extract specific image paths from blog data
function extractBlogImages() {
  const blogFile = path.join(dataDir, 'blogs.json');
  if (!fs.existsSync(blogFile)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(blogFile, 'utf8'));
    const paths = [];
    
    data.blogs.forEach(blog => {
      if (blog.image) paths.push(blog.image);
      if (blog.author && blog.author.avatar) paths.push(blog.author.avatar);
    });
    
    return paths.filter(Boolean);
  } catch (error) {
    console.error('Error extracting blog images:', error);
    return [];
  }
}

// Extract specific image paths from event data
function extractEventImages() {
  const eventFile = path.join(dataDir, 'events.json');
  if (!fs.existsSync(eventFile)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(eventFile, 'utf8'));
    return data.events.map(event => event.image).filter(Boolean);
  } catch (error) {
    console.error('Error extracting event images:', error);
    return [];
  }
}

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
  'images/textures/film-grain.png',
  
  // Project placeholder
  'images/placeholder-project.jpg',
  
  // Workshop placeholder
  'images/placeholder-workshop.jpg'
];

// Gather all image paths from various sources
function getAllImagePaths() {
  // Get image paths from specific data collections
  const workshopImages = extractWorkshopImages();
  const projectImages = extractProjectImages();
  const experimentImages = extractExperimentImages();
  const blogImages = extractBlogImages();
  const eventImages = extractEventImages();
  
  // Get all JSON files for general scanning
  const jsonFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(dataDir, file));

  // Extract image paths from all JSON files (catch-all for any we missed)
  let allPaths = [];
  jsonFiles.forEach(file => {
    const paths = extractImagesFromJSON(file);
    allPaths = [...allPaths, ...paths];
  });
  
  // Combine all paths and remove duplicates
  const combinedPaths = [
    ...allPaths,
    ...workshopImages,
    ...projectImages,
    ...experimentImages,
    ...blogImages,
    ...eventImages,
    ...additionalPaths
  ];
  
  // Remove duplicates and ensure all paths start without a leading slash
  const uniquePaths = [...new Set(combinedPaths)].map(p => 
    p.startsWith('/') ? p.substring(1) : p
  );
  
  return uniquePaths;
}

// Function to create the gradient image
async function generateImage(imagePath, width, height, colors, isAvatar = false) {
  try {
    // Create canvas with the specified dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Choose gradient type based on path to be consistent for related images
    const gradientType = Math.abs(imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 3;
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
      const patternType = Math.abs(imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 4;
      
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
      if (width / height > 1.5 && 
         (imagePath.includes('cinema') || imagePath.includes('film') || imagePath.includes('poster'))) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000000';
        const letterboxHeight = height * 0.1;
        ctx.fillRect(0, 0, width, letterboxHeight);
        ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);
      }
      
      ctx.globalAlpha = 1;
    }
    
    // Add a subtle label with the filename
    const filename = path.basename(imagePath);
    const label = filename.length > 20 ? filename.substring(0, 18) + '...' : filename;
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `${Math.max(width, height) * 0.02}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, width/2, height/2);
    
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
    
    return true;
  } catch (error) {
    console.error(`Error generating image ${imagePath}:`, error);
    return false;
  }
}

// Generate and save placeholder images
async function generateAllPlaceholderImages() {
  console.log('Extracting image paths from data files...');
  const allImagePaths = getAllImagePaths();
  
  console.log(`Found ${allImagePaths.length} unique image paths to generate.`);
  let generated = 0;
  let errors = 0;
  
  for (const imagePath of allImagePaths) {
    // Determine image dimensions and type based on path/usage
    let width = 800;
    let height = 600;
    let isAvatar = false;
    
    if (imagePath.includes('avatar')) {
      width = height = 400; // Square avatars
      isAvatar = true;
    } else if (imagePath.includes('authors')) {
      width = height = 300; // Blog author avatars
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
    } else if (imagePath.includes('workshop')) {
      width = 1200;
      height = 800; // Workshop images
    } else if (imagePath.includes('events')) {
      width = 1200;
      height = 675; // Event images 16:9
    } else if (imagePath.includes('blog')) {
      width = 1200;
      height = 675; // Blog feature images 16:9
    } else if (imagePath.includes('projects') || imagePath.includes('/projects/')) {
      width = 1600;
      height = 900; // Project images 16:9 but higher res
    } else if (imagePath.includes('experiments')) {
      width = 1600;
      height = 900; // Experiment images 16:9 but higher res
    }
    
    // Choose a color scheme based on the path for consistency
    const schemeIndex = Math.abs(imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colorSchemes.length;
    const colorScheme = colorSchemes[schemeIndex];
    
    const success = await generateImage(imagePath, width, height, colorScheme, isAvatar);
    if (success) {
      generated++;
    } else {
      errors++;
    }
  }
  
  console.log('\nGeneration Complete!');
  console.log(`✅ Generated: ${generated} images`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors} images failed`);
  }
  console.log(`📁 All images saved in the public directory`);
}

// Run the generator
console.log('🎬 Starting Cinematographer Website Image Generator');
console.log('==================================================');
generateAllPlaceholderImages().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});
