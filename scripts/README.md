# Placeholder Image Generation

This directory contains scripts for generating placeholder images for the cinematographer website during development.

## Requirements

To run the image generation script, you'll need to install:

```bash
npm install canvas
```

## Usage

### Generate All Placeholder Images

To generate all necessary placeholder images at once:

```bash
node scripts/generate-placeholder-images.js
```

This will create colorful gradient placeholders for all the missing images in the correct directories.

### Available Scripts

- `generate-placeholder-images.js` - Creates gradient-based placeholder images with proper dimensions
- `download-external-placeholders.js` - Alternative that downloads placeholders from external services (if canvas installation fails)

### Using the Image Fallback System

For automatic fallbacks in components, import and use the `EnhancedImage` component:

```jsx
import EnhancedImage from '@/components/common/EnhancedImage';

// Use just like Next.js Image component
<EnhancedImage
  src="/images/cinematography-1.jpg"
  alt="Cinematography sample"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

This component will automatically use fallbacks from `utils/imageFallbacks.js` if the requested image is missing.
