"use client";

import { useEffect, useRef } from "react";

export const HERO_VIDEO_PATH = "/img/bannerhero.mp4";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (mediaQuery.matches) {
        video.pause();
      } else {
        video.play().catch(() => {
          /* autoplay bloqueado pelo navegador */
        });
      }
    };

    syncPlayback();
    mediaQuery.addEventListener("change", syncPlayback);
    return () => mediaQuery.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      >
        <source src={HERO_VIDEO_PATH} type="video/mp4" />
      </video>
    </div>
  );
}
