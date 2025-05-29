const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Define directories we need to create
const directories = [
  // Main image directories
  'images',
  'images/blog',
  'images/blog/authors',
  'images/events',
  'images/experiments',
  'images/projects',
  'images/testimonials',
  'images/textures',
  'images/timeline',
  'images/workshops',
  
  // Experiment subdirectories
  'images/experiments/diffraction',
  'images/experiments/projection',
  'images/experiments/macro',
  'images/experiments/volumetric',
  'images/experiments/analog',
  'images/experiments/reactive',
  'images/experiments/subtractive',
  
  // Project subdirectories for different projects
  'images/projects/echoes-silence',
  'images/projects/boundless',
  'images/projects/luminescence',
  'images/projects/neon-rhythms',
  'images/projects/forged-fire',
  'images/projects/ethereal-depths',
  'images/projects/whispers-city',
  'images/projects/quantum-visions',
  
  // Video directories
  'videos',
  'videos/experiments'
];

console.log('Creating image directories...');

// Create each directory
directories.forEach(dir => {
  const fullPath = path.join(publicDir, dir);
  
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    } catch (error) {
      console.error(`❌ Error creating ${dir}:`, error.message);
    }
  } else {
    console.log(`📁 Already exists: ${dir}`);
  }
});

console.log('\nDirectory setup complete!');
