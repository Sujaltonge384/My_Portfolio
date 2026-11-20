'use client';

import React, { useRef } from 'react';
import { motion, type MotionStyle } from 'framer-motion';
import styles from './SpotlightCard.module.css';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotColor?: string;
  cursorLabel?: string;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className = '',
  spotColor,
  cursorLabel,
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${className}`}
      style={spotColor ? ({ '--spot-color': spotColor } as MotionStyle) : undefined}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      data-cursor={cursorLabel}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <div className={styles.inner}>{children}</div>
    </motion.div>
  );
}
