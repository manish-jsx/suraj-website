'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeDShowcase() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create a film reel model
    const reelGeometry = new THREE.TorusGeometry(5, 1, 16, 100);
    const reelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xAAAAAA,
      metalness: 0.8,
      roughness: 0.2
    });
    const reel = new THREE.Mesh(reelGeometry, reelMaterial);
    scene.add(reel);
    
    // Add inner film strip details
    const filmStripGeometry = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const filmStripMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const filmStrip = new THREE.Mesh(filmStripGeometry, filmStripMaterial);
    reel.add(filmStrip);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff9000, 2, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 10;
    
    // Orbit controls for mobile interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Create scroll animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        reel.rotation.x = self.progress * Math.PI;
        reel.rotation.y = self.progress * Math.PI * 2;
      }
    });
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up scene
      scene.clear();
      controls.dispose();
    };
  }, []);
  
  return (
    <section ref={containerRef} className="h-screen w-full relative">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-playfair mb-6">Experience The Craft</h2>
          <p className="text-xl max-w-lg mx-auto">
            Explore the cinematic world through an interactive lens
          </p>
        </div>
      </div>
    </section>
  );
}
