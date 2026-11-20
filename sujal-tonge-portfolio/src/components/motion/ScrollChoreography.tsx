'use client';

import React, { useRef } from 'react';
import {
  motion,
  type MotionStyle,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

/* ============================================================================
   1. KINETIC 3D HEADING (Word-by-word scroll flip + blur sharpen)
   ============================================================================ */
interface KineticHeadingProps {
  text: string;
  eyebrow?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function KineticHeading({
  text,
  eyebrow,
  className,
  as: Tag = 'h2',
}: KineticHeadingProps) {
  const words = text.split(' ');

  return (
    <div className={className} style={{ perspective: '900px' }}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.74rem',
            letterSpacing: '0.14em',
            color: 'var(--accent-cyan)',
            marginBottom: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '22px',
              height: '1px',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 10px var(--accent-cyan)',
            }}
          />
          <span>{eyebrow}</span>
        </motion.div>
      )}

      <Tag
        style={{
          fontFamily: 'var(--font-display), sans-serif',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.28em',
        }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            initial={{
              opacity: 0,
              y: 38,
              rotateX: -65,
              scale: 0.9,
              filter: 'blur(8px)',
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              filter: 'blur(0px)',
            }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: idx * 0.055,
            }}
            style={{
              display: 'inline-block',
              transformOrigin: 'bottom center',
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}

/* ============================================================================
   2. SCROLL-LINKED 3D PARALLAX CARD (Continuous scroll progress tilt + glow)
   ============================================================================ */
interface ScrollParallaxCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  style?: MotionStyle;
}

export function ScrollParallaxCard({
  children,
  index = 0,
  className,
  style,
}: ScrollParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    mass: 0.4,
  });

  const direction = index % 2 === 0 ? 1 : -1;
  const y = useTransform(smoothProgress, [0, 0.5, 1], [44, 0, -34]);
  const scale = useTransform(smoothProgress, [0, 0.25, 0.78, 1], [0.92, 1, 1, 0.96]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [10, 0, -7]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-5 * direction, 0, 4 * direction]);
  const opacity = useTransform(smoothProgress, [0, 0.14, 0.88, 1], [0.25, 1, 1, 0.45]);

  return (
    <div style={{ perspective: '1100px' }}>
      <motion.div
        ref={ref}
        className={className}
        whileHover={{
          y: -8,
          scale: 1.018,
          transition: { type: 'spring', stiffness: 380, damping: 24 },
        }}
        style={{
          y,
          scale,
          rotateX,
          rotateY,
          opacity,
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
          ...style,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ============================================================================
   3. STAGGER CASCADE & ITEM (Pop-in spring choreography for grids & pills)
   ============================================================================ */
interface StaggerCascadeProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: MotionStyle;
}

export function StaggerCascade({
  children,
  staggerDelay = 0.06,
  className,
  style,
}: StaggerCascadeProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  style?: MotionStyle;
}

export function StaggerItem({ children, className, style }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      style={{ willChange: 'transform, opacity', ...style }}
      variants={{
        hidden: {
          opacity: 0,
          y: 28,
          scale: 0.86,
          rotateZ: -2,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          transition: {
            type: 'spring',
            stiffness: 320,
            damping: 22,
          },
        },
      }}
      whileHover={{
        scale: 1.06,
        y: -3,
        transition: { type: 'spring', stiffness: 450, damping: 20 },
      }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================================
   4. SCROLL-VELOCITY WARP MARQUEE (Skews & accelerates when scrolling fast)
   ============================================================================ */
interface ScrollVelocityWarpBannerProps {
  items: string[];
}

export function ScrollVelocityWarpBanner({ items }: ScrollVelocityWarpBannerProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 300,
  });

  const skewX = useTransform(smoothVelocity, [-2000, 0, 2000], [-14, 0, 14]);
  const xShift = useTransform(scrollY, [0, 4000], ['0%', '-35%']);

  const repeated = [...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '18px 0',
        borderTop: '1px solid var(--border-hairline)',
        borderBottom: '1px solid var(--border-hairline)',
        background: 'rgba(255, 255, 255, 0.015)',
        userSelect: 'none',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          whiteSpace: 'nowrap',
          x: xShift,
          skewX,
          willChange: 'transform',
        }}
      >
        {repeated.map((label, idx) => (
          <span
            key={`${label}-${idx}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.82rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: idx % 2 === 0 ? 'var(--text-primary)' : 'var(--accent-cyan)',
            }}
          >
            <span>{label}</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                boxShadow: '0 0 10px var(--accent-cyan)',
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================================
   5. TIMELINE SCROLL LASER BEAM (Draws down the timeline in real time)
   ============================================================================ */
interface TimelineScrollBeamProps {
  children: React.ReactNode;
}

export function TimelineScrollBeam({ children }: TimelineScrollBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 65%'],
  });

  const beamScaleY = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
  });

  return (
    <div ref={containerRef} style={{ position: 'relative', paddingLeft: '32px' }}>
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--border-hairline)',
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          left: '10px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(180deg, var(--accent-cyan), var(--accent-secondary, #ec4899))',
          boxShadow: '0 0 14px var(--accent-cyan)',
          transformOrigin: 'top center',
          scaleY: beamScaleY,
          willChange: 'transform',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>{children}</div>
    </div>
  );
}

/* ============================================================================
   6. FLOATING SCROLL-DEPTH & VELOCITY HUD (Bottom-right live telemetry pill)
   ============================================================================ */
export function ScrollDepthHUD() {
  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 30 });
  const [percent, setPercent] = React.useState(0);
  const [speed, setSpeed] = React.useState(0);

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
  });

  useMotionValueEvent(scrollVelocity, 'change', (latest) => {
    setSpeed(Math.min(9999, Math.round(Math.abs(latest))));
  });

  const ringBackground = useMotionTemplate`conic-gradient(var(--accent-cyan) ${
    percent * 3.6
  }deg, rgba(255,255,255,0.12) 0deg)`;

  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: percent > 3 ? 1 : 0, y: percent > 3 ? 0 : 24 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Scroll progress indicator and jump to top"
      title="Click to warp to top"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 9990,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 14px 8px 10px',
        borderRadius: '999px',
        background: 'rgba(9, 12, 20, 0.86)',
        border: '1px solid var(--border-bright)',
        backdropFilter: 'blur(16px)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.7rem',
        cursor: percent > 3 ? 'pointer' : 'default',
        pointerEvents: percent > 3 ? 'auto' : 'none',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
      }}
    >
      <motion.span
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: ringBackground,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#090c14',
          }}
        />
      </motion.span>
      <span>{percent}%</span>
      <span style={{ color: 'var(--accent-cyan)' }}>{speed}px/s</span>
    </motion.button>
  );
}