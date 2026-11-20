'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { stiffness: 900, damping: 42 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 42 });

  const ringX = useSpring(mouseX, { stiffness: 260, damping: 26 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 26 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labelEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (labelEl) {
        setCursorLabel(labelEl.getAttribute('data-cursor') || '');
        setIsPointer(true);
        return;
      }

      const interactiveEl = target.closest('a, button, input, textarea, [role="button"]');
      setCursorLabel('');
      setIsPointer(Boolean(interactiveEl));
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY, visible]);

  const hasLabel = cursorLabel.length > 0;

  return (
    <>
      <motion.div
        className={styles.dot}
        style={{ x: dotX, y: dotY, opacity: visible && !hasLabel ? 1 : 0 }}
      />
      <motion.div
        className={`${styles.ring} ${hasLabel || isPointer ? styles.ringActive : ''}`}
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          width: hasLabel ? 92 : isPointer ? 46 : 32,
          height: hasLabel ? 32 : isPointer ? 46 : 32,
        }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      >
        {hasLabel && <span>{cursorLabel}</span>}
      </motion.div>
    </>
  );
}
