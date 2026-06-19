"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import {
  heroSlideHasText,
  heroSlideHref,
  heroSlideIsExternal,
  type HeroSlide,
} from "@/lib/hero-slides";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const goNext = useCallback(() => {
    if (slides.length <= 1) return;
    setVisible(false);
    window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setVisible(true);
    }, 400);
  }, [slides.length]);

  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const duration = slides[index]?.displayDurationMs ?? 4000;
    const timer = window.setTimeout(goNext, duration);
    return () => window.clearTimeout(timer);
  }, [slides, index, goNext]);

  const slide = slides[index];
  if (!slide) return null;

  const href = heroSlideHref(slide);
  const hasText = heroSlideHasText(slide);
  const isExternal = heroSlideIsExternal(slide);
  const showGradient = hasText;

  const imageBlock = (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <picture className="block h-full w-full">
        <source media="(min-width: 768px)" srcSet={slide.imageDesktopUrl} />
        <img
          src={slide.imageMobileUrl}
          alt={slide.title.trim() || "Banner"}
          className="h-full w-full object-cover"
        />
      </picture>
    </div>
  );

  const gradient = showGradient ? (
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
  ) : null;

  const imageWrapper = (() => {
    if (!href) {
      return (
        <div className="absolute inset-0 z-0">
          {imageBlock}
          {gradient}
        </div>
      );
    }

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 block"
          aria-label={slide.title.trim() || "Abrir link do banner"}
        >
          {imageBlock}
          {gradient}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className="absolute inset-0 z-0 block"
        aria-label={slide.eventTitle ? `Ver evento ${slide.eventTitle}` : "Ver evento"}
      >
        {imageBlock}
        {gradient}
      </Link>
    );
  })();

  return (
    <>
      {imageWrapper}

      {hasText && (
        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div
            className={cn(
              "max-w-2xl transition-opacity duration-500",
              visible ? "animate-fade-up opacity-100" : "opacity-0",
            )}
          >
            {slide.title.trim() && (
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
            )}
            {slide.subtitle.trim() && (
              <p
                className={cn(
                  "text-lg leading-relaxed text-slate-300 sm:text-xl",
                  slide.title.trim() ? "mt-6" : "",
                )}
              >
                {slide.subtitle}
              </p>
            )}
            {href && (
              <div className="mt-10">
                {isExternal ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="secondary">
                      Saiba mais
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </a>
                ) : (
                  <Link href={href}>
                    <Button size="lg" variant="secondary">
                      Ver evento
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
            {slides.length > 1 && (
              <div className="mt-8 flex gap-2" aria-hidden>
                {slides.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-8 bg-brand-300" : "w-3 bg-white/40",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!hasText && slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2" aria-hidden>
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-white" : "w-3 bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ slides: HeroSlide[] }>("/hero-slides")
      .then((data) => setSlides(data.slides))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  return { slides, loading };
}
