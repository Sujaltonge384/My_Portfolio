'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './TerminalPreloader.module.css';

export function TerminalPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 12;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setVisible(false), 260);
      } else {
        setProgress(current);
      }
    }, 85);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <div className={styles.topBar}>
            <span>
              <span className={styles.statusDot} />
              SUJAL.DEV // SYSTEM_BOOT_V2.6
            </span>
            <span>NAGPUR, IN</span>
          </div>

          <div className={styles.centerConsole}>
            <div className={styles.logLine}>
              <span className={styles.logAccent}>&gt;</span> initializing fullstack_runtime [next.js, fastapi, pgvector]...
            </div>
            <div className={styles.logLine}>
              <span className={styles.logAccent}>&gt;</span> mounting gsap_scrolltrigger + framer_spring_engine...
            </div>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.12 }}
              />
            </div>
          </div>

          <div className={styles.bottomRow}>
            <span className={styles.skipHint}>CLICK ANYWHERE TO SKIP</span>
            <div className={styles.counter}>{String(progress).padStart(2, '0')}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
