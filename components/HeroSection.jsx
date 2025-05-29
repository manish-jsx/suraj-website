'use client'
import { useRef, useEffect } from 'react'

export default function HeroScrollVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      const scrollFraction = scrollTop / scrollHeight
      video.currentTime = video.duration * scrollFraction
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="h-[300vh] relative overflow-hidden">
      <video
        ref={videoRef}
        src="/showreel.mp4"
        muted
        preload="auto"
        className="fixed top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-white">
        <h1 className="text-5xl font-bold">Cinematographer Name</h1>
        <p className="text-xl mt-4">Capturing stories, one frame at a time.</p>
      </div>
    </section>
  )
}
