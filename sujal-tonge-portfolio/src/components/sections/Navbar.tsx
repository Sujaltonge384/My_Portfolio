'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Command, Flame, Sparkles } from 'lucide-react';
import { PROFILE } from '@/data/portfolio';
import { useSmoothScroll } from '@/components/motion/SmoothScrollProvider';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';
import styles from './Navbar.module.css';

export type NeonTheme = 'blue-pink' | 'orange';

interface NavbarProps {
  onOpenPalette: () => void;
  onNotify?: (msg: string) => void;
}

const NAV_ITEMS = [
  { label: 'Projects', href: '#projects', cursor: 'WORK' },
  { label: 'Bubbles', href: '#stack-bubbles', cursor: 'MATRIX' },
  { label: 'Stack', href: '#stack', cursor: 'STACK' },
  { label: 'Timeline', href: '#timeline', cursor: 'LOGS' },
  { label: 'Contact', href: '#contact', cursor: 'PING' },
];

export function Navbar({ onOpenPalette, onNotify }: NavbarProps) {
  const [compact, setCompact] = useState(false);
  const [activeNav, setActiveNav] = useState<string>('#projects');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [theme, setTheme] = useState<NeonTheme>('blue-pink');
  const [themeFlashKey, setThemeFlashKey] = useState(0);

  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 32 });

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace('#', ''));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveNav(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const currentAttr = document.documentElement.getAttribute('data-theme');
    if (currentAttr === 'blue-pink' || currentAttr === 'orange') {
      setTheme(currentAttr);
    }

    const observer = new MutationObserver(() => {
      const updated = document.documentElement.getAttribute('data-theme');
      if (updated === 'blue-pink' || updated === 'orange') {
        setTheme(updated);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const applyTheme = React.useCallback(
    (nextTheme: NeonTheme) => {
      setTheme(nextTheme);
      setThemeFlashKey((k) => k + 1);
      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('sujal-portfolio-theme', nextTheme);
      } catch {
        // Ignore storage errors
      }
      onNotify?.(
        nextTheme === 'orange'
          ? 'Switched to Neon Orange & Amber theme'
          : 'Switched to Neon Blue & Pink theme'
      );
    },
    [onNotify]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isInput || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key.toLowerCase() === 't') {
        applyTheme(theme === 'blue-pink' ? 'orange' : 'blue-pink');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyTheme, theme]);

  const highlightedHref = hoveredNav ?? activeNav;

  return (
    <>
      {themeFlashKey > 0 && <div key={themeFlashKey} className="theme-shift-overlay" />}

      <header className={styles.header}>
        <nav
          className={`${styles.pill} ${compact ? styles.pillCompact : ''}`}
          aria-label="Primary Navigation"
        >
          <div className={styles.leftGroup}>
            <MagneticWrapper strength={0.25}>
              <button
                type="button"
                className={styles.brand}
                onClick={() => scrollTo(0, 0)}
                data-cursor="TOP"
              >
                <span>
                  ST<span className={styles.brandAccent}>.</span>
                </span>
              </button>
            </MagneticWrapper>

            <span className={styles.statusPill}>
              <span className={styles.pulseDot} />
              <span>{PROFILE.availability}</span>
            </span>
          </div>

          <div
            className={styles.navLinks}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isHighlighted = highlightedHref === item.href;
              return (
                <MagneticWrapper key={item.href} strength={0.25}>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${isHighlighted ? styles.navBtnActive : ''}`}
                    data-cursor={item.cursor}
                    onMouseEnter={() => setHoveredNav(item.href)}
                    onFocus={() => setHoveredNav(item.href)}
                    onClick={() => {
                      setActiveNav(item.href);
                      scrollTo(item.href, -40);
                    }}
                  >
                    {isHighlighted && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className={styles.navPillBg}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className={styles.navBtnLabel}>{item.label}</span>
                  </button>
                </MagneticWrapper>
              );
            })}
          </div>

          <div className={styles.actions}>
            <MagneticWrapper strength={0.25}>
              <button
                type="button"
                className={styles.cmdBtn}
                onClick={() => applyTheme(theme === 'blue-pink' ? 'orange' : 'blue-pink')}
                aria-label="Switch neon theme (Shortcut: T)"
                title="Press T to switch neon theme"
                data-cursor={theme === 'blue-pink' ? 'ORANGE' : 'BLUE+PINK'}
              >
                {theme === 'blue-pink' ? <Sparkles size={13} /> : <Flame size={13} />}
                <span>{theme === 'blue-pink' ? 'Blue / Pink' : 'Neon Orange'}</span>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.25}>
              <button
                type="button"
                className={styles.cmdBtn}
                onClick={onOpenPalette}
                aria-label="Open Command Palette"
                data-cursor="CMD+K"
              >
                <Command size={13} />
                <span>K</span>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.28}>
              <a
                href={PROFILE.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resumeBtn}
                data-cursor="PDF"
              >
                <span>Resume</span>
                <ArrowUpRight size={15} />
              </a>
            </MagneticWrapper>
          </div>

          <motion.div className={styles.progressLine} style={{ scaleX }} />
        </nav>
      </header>
    </>
  );
}