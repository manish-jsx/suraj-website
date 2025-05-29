"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getShowreel, getRandomPlaceholderVideo } from "@/lib/sanity";

export default function Hero() {
  const videoRef = useRef(null);
  const headingRef = useRef(null);
  const sectionRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/videos/showreel-teaser.mp4");

  // Fetch the showreel or use fallback
  useEffect(() => {
    async function loadVideo() {
      try {
        const showreel = await getShowreel();
        if (showreel && showreel.videoUrl) {
          setVideoSrc(showreel.videoUrl);
        } else {
          console.log("No showreel found, using default video");
        }
      } catch (error) {
        console.error("Error loading showreel:", error);
        // If default video fails too, use placeholder
        const video = videoRef.current;
        if (video && video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
          setVideoSrc(getRandomPlaceholderVideo());
        }
      }
    }

    loadVideo();
  }, []);

  // Set up scroll-controlled video playback
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    if (!video) return;

    // Handle video errors
    const handleError = () => {
      console.error("Video error, using fallback");
      setVideoSrc(getRandomPlaceholderVideo());
    };

    video.addEventListener("error", handleError);

    // Set up video metadata and scroll control
    const handleMetadata = () => {
      setVideoLoaded(true);

      // Make sure video is loaded and ready before setting up ScrollTrigger
      if (video.readyState < 2) {
        video.addEventListener("canplay", setupScrollTrigger);
      } else {
        setupScrollTrigger();
      }
    };

    const setupScrollTrigger = () => {
      // Kill any existing scroll triggers for this section
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });

      // Create scroll trigger for video playback
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        onUpdate: (self) => {
          if (video.duration && video.readyState >= 2) {
            const scrollProgress = self.progress;
            const targetTime = scrollProgress * video.duration;

            // Only update if the difference is significant to avoid jitter
            if (Math.abs(video.currentTime - targetTime) > 0.05) {
              video.currentTime = targetTime;
            }
          }
        },
      });

      // Animate heading
      gsap.fromTo(
        headingRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }
      );
    };

    video.addEventListener("loadedmetadata", handleMetadata);

    // Clean up
    return () => {
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("canplay", setupScrollTrigger);

      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, [videoSrc]);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full relative overflow-hidden"
    >
      {!videoLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoSrc}
        className="absolute w-full h-full object-cover"
        preload="auto"
        playsInline
        muted
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-24">
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-9xl font-serif leading-tight max-w-4xl"
        >
          Crafting Visual{" "}
          <span className="text-amber-400">Stories</span> Through Light
        </h1>
        <p className="text-xl md:text-2xl mt-6 max-w-2xl text-gray-200 font-light">
          Award-winning cinematography that captures the essence of human
          experience
        </p>
      </div>
    </section>
  );
}
