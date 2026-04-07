import React from 'react';
import { useLocation } from 'react-router-dom';

export default function VideoBackground() {
  const location = useLocation();
  
  // Decide which video to show based on the current path
  let videoSrc = "/assets/background.mp4";
  if (location.pathname.includes('maggie')) videoSrc = "/assets/noodles.mp4";
  else if (location.pathname.includes('tea_coffee')) videoSrc = "/assets/tea.mp4";
  else if (location.pathname.includes('milkshakes')) videoSrc = "/assets/oreo.mp4";
  else if (location.pathname.includes('mocktails')) videoSrc = "/assets/drinks.mp4";
  // The default background.mp4 acts as the fallback for other pages and home

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-20 overflow-hidden bg-black">
        <video 
          key={videoSrc} // Force re-render/reload when src changes
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <div className="fixed inset-0 bg-black/50 -z-10 backdrop-blur-sm transition-all duration-500"></div>
    </>
  );
}
