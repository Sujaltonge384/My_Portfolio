'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

export const PRECISION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useScreenMotionProfile() {
  const prefersReduced = useReducedMotion();
  const [tier, setTier] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateTier = () => {
      const w = window.innerWidth;
      if (w < 640) setTier('mobile');
      else if (w < 1024) setTier('tablet');
      else setTier('desktop');
    };

    updateTier();
    window.addEventListener('resize', updateTier, { passive: true });
    return () => window.removeEventListener('resize', updateTier);
  }, []);

  if (prefersReduced) {
    return {
      tier,
      reduced: true,
      parallaxY: [0, 0, 0] as [number, number, number],
      tiltX: [0, 0, 0] as [number, number, number],
      tiltY: [0, 0, 0] as [number, number, number],
      scaleRange: [1, 1, 1, 1] as [number, number, number, number],
      velocitySkew: [-2, 0, 2] as [number, number, number],
      staggerDelay: 0,
    };
  }

  if (tier === 'mobile') {
    return {
      tier,
      reduced: false,
      parallaxY: [16, 0, -10] as [number, number, number],
      tiltX: [2.5, 0, -1.5] as [number, number, number],
      tiltY: [0, 0, 0] as [number, number, number],
      scaleRange: [0.965, 1, 1, 0.985] as [number, number, number, number],
      velocitySkew: [-5, 0, 5] as [number, number, number],
      staggerDelay: 0.035,
    };
  }

  if (tier === 'tablet') {
    return {
      tier,
      reduced: false,
      parallaxY: [24, 0, -16] as [number, number, number],
      tiltX: [5, 0, -3] as [number, number, number],
      tiltY: [2, 0, -1.5] as [number, number, number],
      scaleRange: [0.95, 1, 1, 0.975] as [number, number, number, number],
      velocitySkew: [-8, 0, 8] as [number, number, number],
      staggerDelay: 0.045,
    };
  }

  return {
    tier,
    reduced: false,
    parallaxY: [32, 0, -22] as [number, number, number],
    tiltX: [7, 0, -4.5] as [number, number, number],
    tiltY: [3.5, 0, -2.5] as [number, number, number],
    scaleRange: [0.94, 1, 1, 0.97] as [number, number, number, number],
    velocitySkew: [-11, 0, 11] as [number, number, number],
    staggerDelay: 0.055,
  };
}

interface TunedScrollCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TunedScrollCard({
  children,
  index = 0,
  className,
  style,
}: TunedScrollCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const profile = useScreenMotionProfile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 96%', 'end 12%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 210,
    damping: 28,
    mass: 0.35,
    restDelta: 0.001,
  });

  const dir = index % 2 === 0 ? 1 : -1;
  const y = useTransform(smoothProgress, [0, 0.5, 1], profile.parallaxY);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], profile.tiltX);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [
    profile.tiltY[0] * dir,
    profile.tiltY[1],
    profile.tiltY[2] * dir,
  ]);
  const scale = useTransform(smoothProgress, [0, 0.22, 0.82, 1], profile.scaleRange);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.12, 0.9, 1],
    profile.reduced ? [1, 1, 1, 1] : [0.55, 1, 1, 0.7]
  );

  return (
    <div
      style={{
        perspective: profile.tier === 'mobile' ? '700px' : '1150px',
        overflowX: 'clip',
      }}
    >
      <motion.div
        ref={ref}
        className={className}
        whileHover={
          profile.reduced
            ? undefined
            : {
                y: profile.tier === 'mobile' ? -2 : -5,
                scale: profile.tier === 'mobile' ? 1.005 : 1.012,
                transition: { duration: 0.2, ease: PRECISION_EASE },
              }
        }
        style={{
          y,
          rotateX,
          rotateY,
          scale,
          opacity,
          transformStyle: 'preserve-3d',
          willChange: profile.reduced ? 'auto' : 'transform, opacity',
          ...style,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface TunedVelocityStripProps {
  items: string[];
}

export function TunedVelocityStrip({ items }: TunedVelocityStripProps) {
  const profile = useScreenMotionProfile();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, {
    stiffness: 240,
    damping: 36,
    restDelta: 0.001,
  });

  const skewX = useTransform(smoothVelocity, [-2200, 0, 2200], profile.velocitySkew);
  const x = useTransform(scrollY, [0, 3600], ['0%', '-28%']);
  const repeated = [...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        overflowX: 'clip',
        padding: profile.tier === 'mobile' ? '12px 0' : '16px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        background: 'rgba(255, 255, 255, 0.015)',
        userSelect: 'none',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: profile.tier === 'mobile' ? '20px' : '32px',
          width: 'max-content',
          x,
          skewX,
          willChange: profile.reduced ? 'auto' : 'transform',
        }}
      >
        {repeated.map((label, idx) => (
          <span
            key={`${label}-${idx}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: profile.tier === 'mobile' ? '0.68rem' : '0.76rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: idx % 2 === 0 ? 'var(--text-primary, #F8FAFC)' : 'var(--accent-cyan, #00F0FF)',
            }}
          >
            <span>{label}</span>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent-cyan, #00F0FF)',
                boxShadow: '0 0 8px var(--accent-cyan, #00F0FF)',
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}