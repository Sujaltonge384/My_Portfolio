'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface MaskedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export function MaskedText({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  triggerOnScroll = true,
}: MaskedTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const chars = containerRef.current.querySelectorAll('.masked-char');

      gsap.fromTo(
        chars,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          delay,
          stagger: 0.025,
          ease: 'power4.out',
          scrollTrigger: triggerOnScroll
            ? {
                trigger: containerRef.current,
                start: 'top 86%',
                once: true,
              }
            : undefined,
        }
      );
    },
    { scope: containerRef }
  );

  const words = text.split(' ');

  return (
    // @ts-expect-error Dynamic heading tag ref
    <Tag ref={containerRef} className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            marginRight: wIdx < words.length - 1 ? '0.28em' : 0,
          }}
        >
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className="masked-char"
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
