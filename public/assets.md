# Asset Requirements for Cinematographer Website

## Images

### Hero & Branding
- Logo image (SVG preferred, PNG with transparency as fallback)
- Hero background image/texture (2000x1200px, JPG)
- Favicon set (ICO, PNG in multiple sizes: 16x16, 32x32, 96x96, 180x180)
- Brand pattern/texture overlays (PNG with transparency, 1000x1000px)

### Portfolio & Projects
- Project thumbnails (at least 15 images, 800x600px, JPG)
- Featured project hero images (3-5 images, 1920x1080px, JPG)
- Behind-the-scenes photos (10-15 images, various sizes, JPG)
- Equipment/gear photos (5-10 images, 800x600px, JPG)

### Color Grading Showcase
- Before/after grading pairs (5-10 pairs, 1920x1080px, JPG)
  - `/images/before-grade.jpg`
  - `/images/after-grade.jpg`

### Cinematography Samples
- High-quality stills from various projects (20-30 images, 1920x1080px, JPG)
  - `/images/cinematography-1.jpg`
  - `/images/cinematography-2.jpg`
  - `/images/cinematography-3.jpg`
  - `/images/cinematography-4.jpg`
- Lighting setups/techniques (5-10 images, 1200x800px, JPG)

### Career Timeline
- Timeline event images (6-10 images, 800x600px, JPG)
  - `/images/timeline/feature-film.jpg`
  - `/images/timeline/documentary.jpg`
  - `/images/timeline/commercial.jpg` 
  - `/images/timeline/festival.jpg`
  - `/images/timeline/international.jpg`
  - `/images/timeline/innovation.jpg`

### About & Team
- Professional headshot/portrait (1000x1500px, JPG)
- Profile image for about page (1200x800px, JPG)
- Team/collaborator photos (if applicable, 800x800px, JPG)

### Testimonials
- Client/collaborator avatars or portraits (at least 10 images, 400x400px, JPG)
  - `/images/testimonials/avatar-1.jpg`
  - `/images/testimonials/avatar-2.jpg`
  - `/images/testimonials/avatar-3.jpg`

### Poster Images for Videos
- Poster images for showreel/videos (1920x1080px, JPG)
  - `/images/hero-poster.jpg`
  - `/images/showreel-poster.jpg`
  - `/images/approach-poster.jpg`

### Misc UI Elements
- Film grain texture overlay (`/images/textures/film-grain.png`, 1000x1000px, PNG with transparency)
- UI decorative elements (various sizes, PNG with transparency)
- Social media icons (if custom, SVG preferred)

## Videos

### Showreel & Features
- Main cinematography showreel (2-3 minutes, 1920x1080px, MP4, H.264 codec)
- Project-specific highlight reels (5-10 videos, 30-60 seconds each, 1920x1080px, MP4)

### Process & Behind-the-Scenes
- Creative approach video (`/videos/creative-approach.mp4`, 30-60 seconds, 1920x1080px)
- Lighting demonstration videos (3-5 videos, 30-60 seconds each, 1920x1080px, MP4)
- Camera movement examples (3-5 videos, 15-30 seconds each, 1920x1080px, MP4)
- Color grading process videos (2-3 videos, 30-60 seconds each, 1920x1080px, MP4)

### Testimonials & Interviews
- Client testimonial videos (3-5 videos, 30-60 seconds each, 1920x1080px, MP4)
- Director interviews (if applicable, 2-3 videos, 2-3 minutes each, 1920x1080px, MP4)

### Tutorials & Educational Content
- Technical tutorials (if applicable, 5-10 videos, 3-5 minutes each, 1920x1080px, MP4)
- Cinematography tip videos (3-5 videos, 1-2 minutes each, 1920x1080px, MP4)

## Placeholder Resources
- Google sample videos (for development):
  - `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  - `https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4`
  - `https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4`
  - `https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4`

## Recommended Formats & Optimization

### Images
- Use WebP with JPEG fallback for better performance
- Implement responsive images with srcset for different viewport sizes
- Keep filesizes under 200KB for thumbnails, under 500KB for hero images
- Use image compression tools (TinyPNG, ImageOptim) before deployment

### Videos
- H.264 codec for maximum compatibility
- Multiple resolution options: 1080p, 720p, 480p
- Video snippets: 5-10MB
- Longer videos: Use streaming service embeds where possible
- Video poster images for better loading UX
