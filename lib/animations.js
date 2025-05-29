import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export function setupScrollAnimations() {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
  // Initialize scroll-based animations
  initializeProjectCards();
  initializeParallaxElements();
  initializeTextReveals();
}

function initializeProjectCards() {
  // Project cards staggered animation
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card) => {
    gsap.fromTo(
      card,
      { 
        y: 100, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

function initializeParallaxElements() {
  // Parallax background elements
  const parallaxElements = document.querySelectorAll('.parallax');
  
  parallaxElements.forEach((element) => {
    const speed = element.dataset.speed || 0.1;
    
    gsap.to(element, {
      y: () => `-${window.innerHeight * speed}`,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}

function initializeTextReveals() {
  // Text reveal animations
  const headings = document.querySelectorAll('.reveal-text');
  
  headings.forEach((heading) => {
    const chars = heading.textContent.split("");
    heading.textContent = "";
    
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      heading.appendChild(span);
    });
    
    gsap.fromTo(
      heading.children,
      { 
        opacity: 0,
        y: 20 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heading,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );
  });
}
