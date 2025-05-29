import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';
import { apiVersion, dataset, projectId, useCdn } from '../sanity/env';
import { getRandomUnsplashImage, getRandomCinematographyImage, CINEMATOGRAPHY_QUERIES } from '../utils/unsplash';

// Placeholder videos when content is not available
export const PLACEHOLDER_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  // If source doesn't exist, return a random placeholder image
  if (!source) {
    return {
      url: () => "/images/placeholder.jpg",
      width: (w) => ({ height: (h) => ({ url: () => "/images/placeholder.jpg" }) }),
      height: (h) => ({ width: (w) => ({ url: () => "/images/placeholder.jpg" }) })
    };
  }
  
  // Handle Unsplash image objects
  if (source._type === 'unsplashImage' && source.url) {
    return {
      url: () => source.url,
      width: (w) => ({ height: (h) => ({ url: () => source.url }) }),
      height: (h) => ({ width: (w) => ({ url: () => source.url }) })
    };
  }
  
  return builder.image(source);
}

// Get a random placeholder video URL
export function getRandomPlaceholderVideo() {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_VIDEOS.length);
  return PLACEHOLDER_VIDEOS[randomIndex];
}

// Helper function to fetch images from Unsplash
async function fetchUnsplashImages(query, count) {
  try {
    const unsplashQuery = query || CINEMATOGRAPHY_QUERIES[Math.floor(Math.random() * CINEMATOGRAPHY_QUERIES.length)];
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&per_page=${count}`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
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
    
    return data.results.map(image => ({
      regular: image.urls.regular,
      small: image.urls.small,
      thumb: image.urls.thumb
    }));
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
}

// Generate placeholder projects with Unsplash images
async function generatePlaceholderProjects(count) {
  const categories = ['Feature Film', 'Commercial', 'Music Video', 'Short Film', 'Documentary'];
  const placeholders = [];
  
  // Pre-fetch some images for projects
  let projectImages = [];
  try {
    const images = await fetchUnsplashImages('cinematography film', count);
    projectImages = images;
  } catch (error) {
    console.error("Error pre-fetching project images:", error);
  }
  
  for (let i = 0; i < count; i++) {
    // Choose random categories for this project
    const projectCategories = [];
    const categoryCount = Math.floor(Math.random() * 3) + 1; // 1-3 categories
    
    for (let j = 0; j < categoryCount; j++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      if (!projectCategories.includes(randomCategory)) {
        projectCategories.push(randomCategory);
      }
    }
    
    // Use pre-fetched image or fallback
    let imageUrl = "/images/placeholder.jpg";
    if (projectImages.length > i && projectImages[i]) {
      imageUrl = projectImages[i].regular;
    } else {
      const imageObj = await getRandomCinematographyImage();
      if (imageObj && imageObj.regular) {
        imageUrl = imageObj.regular;
      }
    }
    
    placeholders.push({
      _id: `placeholder-project-${i}`,
      title: `Project ${i + 1}`,
      description: 'This is a placeholder project description. In a real project, this would contain details about the cinematography work.',
      slug: { current: `project-${i + 1}` },
      mainImage: { _type: 'unsplashImage', url: imageUrl },
      categories: projectCategories,
      videoUrl: getRandomPlaceholderVideo(),
      featured: i < 2, // First two projects are featured
      date: new Date(2023, i, 1).toISOString() // Staggered dates
    });
  }
  
  return placeholders;
}

// Wrapper function to ensure projects have data even when API fails
export async function getProjects() {
  try {
    const projects = await client.fetch(`
      *[_type == "project"] | order(date desc) {
        _id,
        title,
        description,
        slug,
        mainImage,
        categories,
        videoUrl,
        featured,
        date
      }
    `);
    
    // If projects exist, return them
    if (projects && projects.length > 0) {
      return projects;
    }
    
    // Otherwise return placeholder projects
    return await generatePlaceholderProjects(5);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return await generatePlaceholderProjects(5);
  }
}

export async function getShowreel() {
  try {
    const showreel = await client.fetch(`*[_type == "showreel"][0]`);
    
    // If showreel exists, return it
    if (showreel) {
      return showreel;
    }
    
    // Otherwise return placeholder showreel
    return {
      _id: 'placeholder-showreel',
      title: 'Cinematography Showreel',
      description: 'A collection of my best cinematography work',
      videoUrl: getRandomPlaceholderVideo()
    };
  } catch (error) {
    console.error("Error fetching showreel:", error);
    return {
      _id: 'placeholder-showreel',
      title: 'Cinematography Showreel',
      description: 'A collection of my best cinematography work',
      videoUrl: getRandomPlaceholderVideo()
    };
  }
}

// Generate placeholder gallery images with Unsplash
async function generatePlaceholderGalleryImages(count) {
  const placeholders = [];
  
  // Get a batch of images from Unsplash
  const categories = ['cinematography', 'filmmaking', 'movie production'];
  const allImages = [];
  
  for (const category of categories) {
    try {
      const images = await fetchUnsplashImages(category, Math.ceil(count / categories.length));
      allImages.push(...images);
    } catch (error) {
      console.error(`Error fetching images for category ${category}:`, error);
    }
  }
  
  for (let i = 0; i < count; i++) {
    let imageUrl = "/images/placeholder.jpg";
    if (allImages.length > 0) {
      const image = allImages[i % allImages.length];
      if (image && image.regular) {
        imageUrl = image.regular;
      }
    }
    
    placeholders.push({
      _id: `placeholder-gallery-${i}`,
      title: `Gallery Image ${i + 1}`,
      image: { _type: 'unsplashImage', url: imageUrl },
      description: `Placeholder image description ${i + 1}`
    });
  }
  
  return placeholders;
}

// Update getGalleryImages to use the async version
export async function getGalleryImages() {
  try {
    const images = await client.fetch(`*[_type == "galleryImage"] | order(orderRank) {
      _id,
      title,
      image,
      description
    }`);
    
    // If images exist, return them
    if (images && images.length > 0) {
      return images;
    }
    
    // Otherwise return placeholder images
    return await generatePlaceholderGalleryImages(8);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return await generatePlaceholderGalleryImages(8);
  }
}



// Function to get workshops if they don't exist
export async function getWorkshops() {
  try {
    const workshops = await client.fetch(`
      *[_type == "workshop"] | order(startDate asc) {
        _id,
        title,
        description,
        startDate,
        endDate,
        location,
        image,
        price,
        seats,
        seatsAvailable,
        curriculum,
        instructor,
        level
      }
    `);
    
    if (workshops && workshops.length > 0) {
      return workshops;
    }
    
    return generatePlaceholderWorkshops(3);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return generatePlaceholderWorkshops(3);
  }
}

// Generate placeholder workshops
function generatePlaceholderWorkshops(count) {
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Atlanta, GA', 'Austin, TX'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Master Class'];
  const placeholders = [];
  
  // Current date for calculating future workshop dates
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Generate start date (between 1-6 months in the future)
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() + Math.floor(Math.random() * 6) + 1);
    
    // Generate end date (1-5 days after start date)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
    
    // Random price between $500-2000
    const price = Math.floor(Math.random() * 1500) + 500;
    
    // Random total seats between 10-30
    const seats = Math.floor(Math.random() * 20) + 10;
    
    // Random available seats (some might be sold out)
    const seatsAvailable = Math.floor(Math.random() * (seats + 1));
    
    placeholders.push({
      _id: `placeholder-workshop-${i}`,
      title: `Cinematography ${levels[i % levels.length]} Workshop`,
      description: 'Learn essential cinematography techniques in this hands-on workshop. Perfect for filmmakers looking to elevate their visual storytelling.',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: locations[i % locations.length],
      image: null, // urlFor will handle this
      price: price,
      seats: seats,
      seatsAvailable: seatsAvailable,
      curriculum: 'Lighting techniques, Camera movement, Visual storytelling, Color theory',
      instructor: 'Professional Cinematographer',
      level: levels[i % levels.length]
    });
  }
  
  return placeholders;
}

// More helper methods for other content types
export async function getBlogPosts() {
  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        categories[]->{title},
        excerpt,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
      }
    `);
    
    if (posts && posts.length > 0) {
      return posts;
    }
    
    return generatePlaceholderBlogPosts(6);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return generatePlaceholderBlogPosts(6);
  }
}

// Generate placeholder blog posts
function generatePlaceholderBlogPosts(count) {
  const titles = [
    'The Art of Natural Light in Cinematography',
    'Creating Mood with Camera Movement',
    'Understanding Color Grading for Emotional Impact',
    'Lens Selection for Different Narrative Styles',
    'Mastering the Art of Visual Composition',
    'Practical Lighting Techniques for Indie Filmmakers'
  ];
  
  const excerpts = [
    'Discover how to harness natural light to create stunning cinematic imagery without expensive lighting setups.',
    'Learn how different camera movements can enhance storytelling and create emotional connections with your audience.',
    'Explore the psychological impact of color choices in your cinematography and how to use grading effectively.',
    'A comprehensive guide to selecting the right lens for your project based on the emotional response you want to create.',
    'Understanding the rules of composition and when to break them for maximum visual impact.',
    'Budget-friendly lighting solutions that still deliver professional-quality results for independent productions.'
  ];
  
  const categoryOptions = [
    {title: 'Techniques'}, 
    {title: 'Equipment'}, 
    {title: 'Tutorials'}, 
    {title: 'Industry Insights'},
    {title: 'Behind the Scenes'}
  ];
  
  const placeholders = [];
  
  // Generate dates starting from 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  for (let i = 0; i < count; i++) {
    // Create date (staggered from 6 months ago to now)
    const postDate = new Date(sixMonthsAgo);
    postDate.setDate(postDate.getDate() + Math.floor((i * 30) / count * 180));
    
    // Assign 1-3 random categories
    const postCategories = [];
    const categoryCount = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < categoryCount; j++) {
      const randomCategoryIndex = Math.floor(Math.random() * categoryOptions.length);
      if (!postCategories.some(c => c.title === categoryOptions[randomCategoryIndex].title)) {
        postCategories.push(categoryOptions[randomCategoryIndex]);
      }
    }
    
    placeholders.push({
      _id: `placeholder-post-${i}`,
      title: titles[i % titles.length],
      slug: { current: titles[i % titles.length].toLowerCase().replace(/\s+/g, '-') },
      mainImage: null, // urlFor will handle this
      publishedAt: postDate.toISOString(),
      categories: postCategories,
      excerpt: excerpts[i % excerpts.length],
      estimatedReadingTime: Math.floor(Math.random() * 10) + 3 // 3-12 minutes
    });
  }
  
  return placeholders;
}

// Generate placeholder events
export async function getEvents() {
  try {
    const eventData = await client.fetch(`
      *[_type == "event"] | order(eventDate asc) {
        _id,
        title,
        description,
        eventDate,
        endDate,
        location,
        image,
        ticketLink,
        featured
      }
    `);
    
    if (eventData && eventData.length > 0) {
      return eventData;
    }
    
    return generatePlaceholderEvents(6);
  } catch (error) {
    console.error("Error fetching events:", error);
    return generatePlaceholderEvents(6);
  }
}

function generatePlaceholderEvents(count) {
  const eventTitles = [
    'Film Festival Screening: "Through the Lens"',
    'Masterclass: Cinematic Lighting',
    'Panel Discussion: Evolution of Visual Storytelling',
    'Workshop: Camera Movement Techniques',
    'Exhibition: Frames from the Field',
    'Q&A Session with Industry Professionals',
    'Premiere: "Shadows and Light" Documentary',
    'Networking Event: Cinematographers Collective'
  ];
  
  const locations = [
    'Film Society, New York',
    'Cinematheque, Los Angeles',
    'Media Arts Center, Chicago',
    'Film Academy, London',
    'Arts District Gallery, Berlin',
    'Creative Hub, Tokyo'
  ];
  
  const descriptions = [
    'Join us for an exclusive screening followed by a discussion on the cinematography techniques used in this award-winning film.',
    'A deep dive into the art of visual storytelling through the lens of contemporary cinema.',
    'Explore innovative camera techniques and their impact on modern filmmaking in this interactive session.',
    'An immersive exhibition showcasing striking cinematography from various genres and styles.',
    'Connect with fellow filmmakers and cinematography enthusiasts in this casual networking event.'
  ];
  
  const events = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isFutureEvent = i < count/2; // Make half the events upcoming, half past
    
    const eventDate = new Date();
    if (isFutureEvent) {
      // Future event: 1-180 days from now
      eventDate.setDate(now.getDate() + Math.floor(Math.random() * 180) + 1);
    } else {
      // Past event: 1-180 days ago
      eventDate.setDate(now.getDate() - Math.floor(Math.random() * 180) - 1);
    }
    
    // Random end date (0-3 days after start)
    const endDate = new Date(eventDate);
    endDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 4));
    
    events.push({
      _id: `placeholder-event-${i}`,
      title: eventTitles[i % eventTitles.length],
      description: descriptions[i % descriptions.length],
      eventDate: eventDate.toISOString(),
      endDate: endDate.toISOString(),
      location: locations[i % locations.length],
      image: null, // urlFor will handle this
      ticketLink: isFutureEvent ? 'https://example.com/tickets' : null,
      featured: i < 2 // First two events are featured
    });
  }
  
  return events;
}

// Generate placeholder experiments data
export async function getExperiments() {
  try {
    const experimentData = await client.fetch(`
      *[_type == "experiment"] | order(date desc) {
        _id,
        title,
        description,
        fullDescription,
        videoUrl,
        date,
        equipment,
        technique,
        collaborators,
        images,
        outcome,
        mainImage
      }
    `);
    
    if (experimentData && experimentData.length > 0) {
      return experimentData;
    }
    
    return generatePlaceholderExperiments(4);
  } catch (error) {
    console.error("Error fetching experiments:", error);
    return generatePlaceholderExperiments(4);
  }
}

function generatePlaceholderExperiments(count) {
  const experimentTitles = [
    'Light Painting in Motion',
    'Anamorphic Lens Distortion Study',
    'Infrared Cinematography',
    'Liquid Lensing Effects',
    'Practical In-Camera VFX',
    'Mirrors and Projections'
  ];
  
  const techniques = [
    'Long Exposure',
    'Custom Lens Modding',
    'IR-Converted Cameras',
    'Projection Mapping',
    'Light Refraction',
    'Macro Cinematography'
  ];
  
  const equipment = [
    'RED Gemini, Vintage Anamorphic Lenses',
    'ARRI Alexa Mini, Custom Lens Attachments',
    'Blackmagic URSA Mini Pro, IR Conversion',
    'Sony Venice, Projectors, Mirrors',
    'Custom Rig, Practical Lighting Elements'
  ];
  
  const descriptions = [
    'Exploring the boundaries between still photography and motion pictures through extended exposure cinematography.',
    'A technical exploration of optical distortion and its storytelling applications in narrative filmmaking.',
    'Capturing the invisible spectrum to create otherworldly visuals for a sci-fi short film.',
    'Using liquids, glass, and light to create in-camera effects that distort and enhance the image in unexpected ways.'
  ];
  
  const fullDescriptions = [
    'This experimental project aimed to translate the technique of light painting from photography into the realm of cinematography. By using carefully choreographed light movements captured with extended exposures at varying frame rates, we created fluid, ethereal light trails that interact with our subjects in three-dimensional space. The technique allows for a unique visualization of time and movement that challenges traditional cinematography approaches.',
    
    'In this technical study, we pushed anamorphic lenses to their optical limits to discover unique visual characteristics. By deliberately exploiting lens flares, distortions, and bokeh, we created a visual language that enhances storytelling through optical imperfection. The experiment included testing vintage lenses, custom lens modifications, and various filtering techniques to create a library of distinctive looks.',
    
    'Converting a digital cinema camera to capture infrared light opened up a new visual spectrum that transforms familiar landscapes and skin tones into surreal, dreamlike imagery. This experiment explored how infrared cinematography can be used for narrative purposes, particularly in scenes depicting memory, altered states of consciousness, or otherworldly environments.',
    
    'This project investigated how liquids, crystals, and glass elements can be used as optical filters to distort and manipulate light before it reaches the sensor. By building a custom rig that holds these elements between the lens and subject, we achieved practical in-camera effects that would be difficult to replicate digitally, resulting in organic, unrepeatable visual moments.'
  ];
  
  const outcomes = [
    'The techniques developed in this experiment were later applied to a music video that won recognition for its innovative visual approach. We discovered that timing and precision were crucial, requiring extensive rehearsal with performers.',
    
    'This study resulted in a comprehensive look book that has informed the visual approach for an upcoming feature film. The distinctive characteristics of each lens/modification combination were documented for future creative reference.',
    
    'The infrared footage captured during this experiment created such a distinctive look that it has been incorporated into a sci-fi short film currently in post-production. The technique proved particularly effective for dream sequences.',
    
    'While challenging to control with precision, the organic nature of these liquid lens effects created visual moments impossible to achieve digitally. The unpredictability became part of the creative process, leading to happy accidents and unique imagery.'
  ];
  
  const experiments = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Create date within past 2 years
    const date = new Date();
    date.setFullYear(now.getFullYear() - Math.floor(Math.random() * 2));
    date.setMonth(Math.floor(Math.random() * 12));
    
    experiments.push({
      _id: `placeholder-experiment-${i}`,
      title: experimentTitles[i % experimentTitles.length],
      description: descriptions[i % descriptions.length],
      fullDescription: fullDescriptions[i % fullDescriptions.length],
      videoUrl: getRandomPlaceholderVideo(),
      date: date.toISOString(),
      equipment: equipment[i % equipment.length],
      technique: techniques[i % techniques.length],
      collaborators: 'Jane Smith (Director), Alex Wong (Production Design)',
      images: null, // Will be handled by placeholder images
      outcome: outcomes[i % outcomes.length],
      mainImage: null // urlFor will handle this
    });
  }
  
  return experiments;
}

// Get previews with fallback data
export async function getPreviews() {
  try {
    const previewData = await client.fetch(`
      *[_type == "preview"] | order(createdAt desc) {
        _id,
        title,
        description,
        videoUrl,
        clientName,
        createdAt,
        expiryDate,
        password,
        feedbackEnabled,
        thumbnailImage
      }
    `);
    
    if (previewData && previewData.length > 0) {
      return previewData;
    }
    
    return generatePlaceholderPreviews(3);
  } catch (error) {
    console.error("Error fetching previews:", error);
    return generatePlaceholderPreviews(3);
  }
}

function generatePlaceholderPreviews(count) {
  const clientNames = ['Acme Productions', 'Westlight Studios', 'Horizon Films', 'Elevate Media'];
  const titles = [
    'Commercial Spot - First Cut',
    'Documentary Trailer - WIP',
    'Brand Film - Color Grade Preview',
    'Feature Film Scene - Lighting Test'
  ];
  const descriptions = [
    'First cut of the upcoming commercial. Please focus feedback on pacing and shot selection.',
    'Work-in-progress trailer for the documentary. Looking for input on narrative structure and emotional impact.',
    'Preview of the color grade for brand film. Aiming for a warm, nostalgic look while maintaining brand colors.',
    'Lighting test for the key emotional scene. Attempting to create dramatic tension while maintaining natural feel.'
  ];
  
  const previews = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random creation date in past 30 days
    const createdAt = new Date();
    createdAt.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    // Random expiry date in next 14 days
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + Math.floor(Math.random() * 14) + 1);
    
    previews.push({
      _id: `placeholder-preview-${i}`,
      title: titles[i % titles.length],
      description: descriptions[i % descriptions.length],
      videoUrl: getRandomPlaceholderVideo(),
      clientName: clientNames[i % clientNames.length],
      createdAt: createdAt.toISOString(),
      expiryDate: expiryDate.toISOString(),
      password: 'preview123',
      feedbackEnabled: true,
      thumbnailImage: null // urlFor will handle this
    });
  }
  
  return previews;
}

// Get snippets with fallback data
export async function getSnippets() {
  try {
    const snippetData = await client.fetch(`
      *[_type == "snippet"] | order(publishedAt desc) {
        _id,
        title,
        description,
        videoUrl,
        thumbnail,
        tags,
        duration,
        publishedAt,
        technique
      }
    `);
    
    if (snippetData && snippetData.length > 0) {
      return snippetData;
    }
    
    return generatePlaceholderSnippets(9);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return generatePlaceholderSnippets(9);
  }
}

function generatePlaceholderSnippets(count) {
  const titles = [
    'Orbit Camera Movement',
    'Silhouette Lighting Setup',
    'Anamorphic Lens Flare Technique',
    'Dolly Zoom Effect',
    'Split Diopter Focus',
    'Low-Key Lighting Study',
    'Day for Night Color Grading',
    'Portrait Lighting Setup',
    'Handheld Camera Stabilization'
  ];
  
  const descriptions = [
    'Demonstration of smooth orbital camera movement around a subject using a gimbal.',
    'Creating dramatic silhouettes with a single backlight and haze.',
    'How to achieve and control those distinctive horizontal lens flares.',
    'The Vertigo effect - pushing in while zooming out for psychological impact.',
    'Getting two subjects at different distances both in focus simultaneously.',
    'Creating mood and shadow with minimal lighting setup.',
    'Techniques for shooting daytime footage that convincingly looks like night.',
    'Classic three-point lighting setup for interview situations.',
    'Techniques for stable handheld camera operation without equipment.'
  ];
  
  const techniques = [
    'Camera Movement',
    'Lighting',
    'Lens Technique',
    'Special Effect',
    'Focus Technique',
    'Mood Lighting',
    'Color Grading',
    'Interview Lighting',
    'Camera Operation'
  ];
  
  const tagOptions = [
    'Lighting', 'Movement', 'Composition', 'Technical', 'Tutorial',
    'Lenses', 'Color', 'Practical Effect', 'Low Budget', 'Advanced'
  ];
  
  const snippets = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random published date in past 90 days
    const publishedAt = new Date();
    publishedAt.setDate(now.getDate() - Math.floor(Math.random() * 90));
    
    // Random duration between 30 seconds and 3 minutes
    const duration = Math.floor(Math.random() * 150) + 30;
    
    // Random tags (2-4 per snippet)
    const tags = [];
    const numTags = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numTags; j++) {
      const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    snippets.push({
      _id: `placeholder-snippet-${i}`,
      title: titles[i % titles.length],
      description: descriptions[i % descriptions.length],
      videoUrl: getRandomPlaceholderVideo(),
      thumbnail: null, // urlFor will handle this
      tags: tags,
      duration: duration,
      publishedAt: publishedAt.toISOString(),
      technique: techniques[i % techniques.length]
    });
  }
  
  return snippets;
}

// Enhanced placeholder data for the homepage
export async function getHomepageData() {
  try {
    const showreel = await getShowreel();
    const featuredProjects = await getFeaturedProjects();
    const testimonials = await getTestimonials();
    
    return {
      showreel,
      featuredProjects,
      testimonials
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    
    // Return fallback data
    return {
      showreel: {
        _id: 'placeholder-showreel',
        title: 'Cinematography Showreel',
        description: 'A collection of my best cinematography work',
        videoUrl: getRandomPlaceholderVideo()
      },
      featuredProjects: generatePlaceholderProjects(3).filter(p => p.featured),
      testimonials: generatePlaceholderTestimonials(3)
    };
  }
}

// Get featured projects for homepage
async function getFeaturedProjects() {
  try {
    const projectData = await client.fetch(`
      *[_type == "project" && featured == true] | order(date desc)[0...3] {
        _id,
        title,
        description,
        slug,
        mainImage,
        categories,
        videoUrl,
        featured,
        date
      }
    `);
    
    if (projectData && projectData.length > 0) {
      return projectData;
    }
    
    return generatePlaceholderProjects(3).filter(p => p.featured);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return generatePlaceholderProjects(3).filter(p => p.featured);
  }
}

// Get testimonials
async function getTestimonials() {
  try {
    const testimonialData = await client.fetch(`
      *[_type == "testimonial"] | order(_createdAt desc)[0...6] {
        _id,
        quote,
        author,
        role,
        project,
        rating
      }
    `);
    
    if (testimonialData && testimonialData.length > 0) {
      return testimonialData;
    }
    
    return generatePlaceholderTestimonials(6);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return generatePlaceholderTestimonials(6);
  }
}

function generatePlaceholderTestimonials(count) {
  const quotes = [
    "Working with this cinematographer was a revelation. The way they captured light transformed our simple story into visual poetry.",
    "The attention to detail and technical expertise brought to our project elevated the entire production. Every frame is a work of art.",
    "A true visual storyteller who understands that cinematography isn't just about beautiful images—it's about serving the narrative with every shot.",
    "Collaborative, creative, and technically flawless. Our film wouldn't have achieved the same emotional resonance without their distinctive visual approach.",
    "The ability to work within our budget constraints while still delivering stunning imagery speaks to both their creativity and professionalism.",
    "From pre-production planning to the final color grade, the level of thoughtfulness and artistic vision was exceptional."
  ];
  
  const authors = [
    "Sarah Johnson",
    "Michael Chen",
    "Priya Patel",
    "David Rodriguez",
    "Emma Thompson",
    "James Wilson"
  ];
  
  const roles = [
    "Film Director",
    "Executive Producer",
    "Commercial Client",
    "Music Video Artist",
    "Creative Director",
    "Documentary Filmmaker"
  ];
  
  const projects = [
    "The Silent Hour",
    "Brand Campaign: Revitalize",
    "Echoes of Tomorrow",
    "Urban Symphony Music Video",
    "The Crossing Documentary",
    "Visionary Light Campaign"
  ];
  
  const testimonials = [];
  
  for (let i = 0; i < count; i++) {
    testimonials.push({
      _id: `placeholder-testimonial-${i}`,
      quote: quotes[i % quotes.length],
      author: authors[i % authors.length],
      role: roles[i % roles.length],
      project: projects[i % projects.length],
      rating: Math.floor(Math.random() * 2) + 4 // Random rating between 4-5
    });
  }
  
  return testimonials;
}

// Get or generate about page data
export async function getAboutPageData() {
  try {
    const aboutData = await client.fetch(`
      *[_type == "about"][0] {
        biography,
        philosophy,
        skills,
        education,
        awards,
        profileImage
      }
    `);
    
    if (aboutData) {
      return aboutData;
    }
    
    return generatePlaceholderAboutData();
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return generatePlaceholderAboutData();
  }
}

function generatePlaceholderAboutData() {
  return {
    biography: "With over a decade of experience in visual storytelling, I've developed an aesthetic that blends technical precision with emotional resonance. My work spans feature films, documentaries, commercials, and experimental projects—each approached with the same commitment to visual excellence. My journey began at Film Academy Vienna, where I honed my craft under the mentorship of award-winning cinematographers. Since then, I've collaborated with directors across the globe, developing a versatile style that adapts to each project's unique vision while maintaining my distinct visual signature.",
    
    philosophy: "I believe cinematography is the delicate balance between technical mastery and artistic intuition. My approach centers on finding the visual language that best serves the story, whether that means breathtaking camera movement, nuanced lighting, or the subtle power of a static frame. Every decision—from lens selection to color palette—is made in service of the narrative.",
    
    skills: [
      "Advanced lighting techniques for diverse environments",
      "Experienced with ARRI, RED, and Sony cinema camera systems",
      "Color theory and practical application in cinematography",
      "Technical and creative lens selection for narrative impact",
      "Aerial cinematography and complex camera movement",
      "Virtual production and LED volume experience"
    ],
    
    education: [
      {
        institution: "Film Academy Vienna",
        degree: "MFA in Cinematography",
        year: "2012"
      },
      {
        institution: "American Film Institute",
        degree: "Cinematography Intensive Program",
        year: "2010"
      },
      {
        institution: "University of Arts London",
        degree: "BA in Photography and Visual Arts",
        year: "2008"
      }
    ],
    
    awards: [
      {
        title: "Golden Camera Award",
        project: "The Quiet Hour",
        year: "2022"
      },
      {
        title: "Best Cinematography",
        project: "Shadows of the Past",
        year: "2020",
        festival: "International Film Festival"
      },
      {
        title: "Visual Excellence Award",
        project: "Urban Reflections",
        year: "2019",
        festival: "Documentary Film Association"
      }
    ],
    
    profileImage: null // urlFor will handle this
  };
}
