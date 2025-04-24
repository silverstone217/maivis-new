"use client";
import React, { useEffect, useRef } from "react";

const HeroSectionVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play(); // Appelle play() uniquement si videoRef.current n'est pas null
    }
  }, []);

  return (
    <video
      ref={videoRef}
      controls={false}
      loop
      muted
      autoPlay
      className="w-full h-full object-cover "
      playsInline
    >
      <source src="/videos/home-cleaning.mp4" type="video/mp4" />
      Votre navigateur ne supporte pas la balise vidéo.
    </video>
  );
};

export default HeroSectionVideo;
