const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

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

// Different color combinations for gradients
const colorSets = [
  ['#3B82F6', '#EC4899', '#8B5CF6'], // Blue-Pink-Purple
  ['#F59E0B', '#10B981', '#3B82F6'], // Amber-Emerald-Blue
  ['#EF4444', '#F97316', '#F59E0B'], // Red-Orange-Amber
  ['#10B981', '#14B8A6', '#0EA5E9'], // Emerald-Teal-Sky
  ['#8B5CF6', '#EC4899', '#F472B6'], // Violet-Pink-Rose
  ['#6366F1', '#8B5CF6', '#EC4899'], // Indigo-Violet-Pink
  ['#F97316', '#F59E0B', '#FBBF24'], // Orange-Amber-Yellow
  ['#8B5CF6', '#6366F1', '#3B82F6'], // Violet-Indigo-Blue
  ['#10B981', '#059669', '#047857'], // Emerald shades
  ['#6D28D9', '#4C1D95', '#7C3AED']  // Purple shades
];

// Function to generate gradient image
async function generateImage(filePath, width, height, isAvatar = false) {
  // Pick a random color set
  const colors = colorSets[Math.floor(Math.random() * colorSets.length)];
  
  // Create canvas with specified dimensions
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  if (isAvatar) {
    // For avatar, create a radial gradient
    const gradient = ctx.createRadialGradient(
      width/2, height/2, 0,
      width/2, height/2, width/2
    );
    
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add a circle for avatar effect
    ctx.beginPath();
    ctx.arc(width/2, height/2, width/2 - 10, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.stroke();
    
  } else {
    // Different gradient types for variety
    const gradientType = Math.floor(Math.random() * 3);
    
    let gradient;
    switch (gradientType) {
      case 0:
        // Linear gradient (top to bottom)
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        break;
      case 1:
        // Linear gradient (diagonal)
        gradient = ctx.createLinearGradient(0, 0, width, height);
        break;
      default:
        // Radial gradient
        gradient = ctx.createRadialGradient(
          width/2, height/2, 0,
          width/2, height/2, width
        );
    }
    
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add a subtle pattern or texture
    const patternType = Math.floor(Math.random() * 3);
    
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#FFFFFF';
    
    switch (patternType) {
      case 0:
        // Grid pattern
        for (let x = 0; x < width; x += 20) {
          for (let y = 0; y < height; y += 20) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
        break;
      case 1:
        // Diagonal lines
        for (let i = -height; i < width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + height, height);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.stroke();
        }
        break;
      case 2:
        // Random noise
        for (let i = 0; i < width * height / 100; i++) {
          ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            1,
            1
          );
        }
        break;
    }
    
    // Add a cinematic letterbox effect for some images
    if (Math.random() > 0.7) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000000';
      const letterboxHeight = height * 0.08;
      ctx.fillRect(0, 0, width, letterboxHeight);
      ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);
    }
    
    ctx.globalAlpha = 1;
  }

  // Ensure directory exists
  const dir = path.dirname(path.join(process.cwd(), 'public', filePath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Convert canvas to buffer and save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(process.cwd(), 'public', filePath), buffer);
  
  console.log(`Created: ${filePath}`);
}

// Generate all placeholder images
async function generateAllImages() {
  for (let imagePath of imagePaths) {
    const isAvatar = imagePath.includes('avatar');
    
    // Different sizes for different image types
    let width, height;
    
    if (isAvatar) {
      width = height = 400; // Square avatars
    } else if (imagePath.includes('cinematography') || imagePath.includes('grade')) {
      width = 1920;
      height = 1080; // 16:9 aspect ratio
    } else if (imagePath.includes('timeline')) {
      width = 800;
      height = 600; // 4:3 aspect ratio
    } else if (imagePath.includes('poster')) {
      width = 1920;
      height = 1080; // 16:9 aspect ratio
    } else if (imagePath.includes('profile')) {
      width = 1000;
      height = 1500; // 2:3 aspect ratio
    } else {
      width = 1200;
      height = 800; // Default size
    }
    
    await generateImage(imagePath, width, height, isAvatar);
  }
}

// Run the generator
generateAllImages().then(() => {
  console.log('All placeholder images have been generated!');
}).catch(err => {
  console.error('Error generating images:', err);
});
