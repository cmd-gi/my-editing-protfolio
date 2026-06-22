'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [shouldMount, setShouldMount] = useState(false);
  const [observe, setObserve] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<ComponentType<{ scene: string; className?: string }> | null>(null);

  useEffect(() => {
    if (isMobile) return;
    if (typeof window === "undefined") return;

    if (window.scrollY > 0) {
      setObserve(true);
      return;
    }

    const onFirstScroll = () => {
      if (window.scrollY > 0) {
        setObserve(true);
      }
    };

    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => window.removeEventListener("scroll", onFirstScroll);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || !observe) return;
    const el = stageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
        }
      },
      { rootMargin: '0px', threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, observe]);

  useEffect(() => {
    if (!shouldMount || isMobile || SplineComponent) return;
    let cancelled = false;

    import('@splinetool/react-spline').then((mod) => {
      if (!cancelled) {
        setSplineComponent(() => mod.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [SplineComponent, isMobile, shouldMount]);

  if (isMobile) return null;

  return (
    <div ref={stageRef} className={`relative w-full h-full ${className ?? ''}`}>
      {SplineComponent ? (
        <SplineComponent scene={scene} className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-charcoal" aria-hidden />
      )}
    </div>
  );
}