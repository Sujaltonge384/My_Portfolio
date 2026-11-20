'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Code2,
  Copy,
  FileText,
  FolderGit2,
  Layers,
  Mail,
  Search,
  Terminal,
} from 'lucide-react';
import { PROFILE } from '@/data/portfolio';
import { useSmoothScroll } from '@/components/motion/SmoothScrollProvider';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export function CommandPalette({ open, onClose, onNotify }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { scrollTo } = useSmoothScroll();

  const commands = useMemo(
    () => [
      {
        id: 'nav-projects',
        title: 'Explore Featured Projects',
        subtitle: 'VastraAI • DevPulse • Kumbharam Village',
        tag: 'SECTION',
        icon: <FolderGit2 size={16} />,
        action: () => scrollTo('#projects', -20),
      },
      {
        id: 'nav-stack',
        title: 'Inspect Technical Stack Bento',
        subtitle: 'Next.js, FastAPI, PostgreSQL, pgvector, OpenCLIP',
        tag: 'SECTION',
        icon: <Layers size={16} />,
        action: () => scrollTo('#stack', -40),
      },
      {
        id: 'nav-timeline',
        title: 'View Experience, Education & 300+ DSA',
        subtitle: 'Freelance Dev • B.Tech CSE RCOEM • Cloud Arcade',
        tag: 'SECTION',
        icon: <Terminal size={16} />,
        action: () => scrollTo('#timeline', -40),
      },
      {
        id: 'nav-contact',
        title: 'Send Direct Message',
        subtitle: 'Open contact form & direct channels',
        tag: 'SECTION',
        icon: <Mail size={16} />,
        action: () => scrollTo('#contact', -40),
      },
      {
        id: 'copy-email',
        title: 'Copy Email Address',
        subtitle: PROFILE.email,
        tag: 'ACTION',
        icon: <Copy size={16} />,
        action: () => {
          navigator.clipboard?.writeText(PROFILE.email);
          onNotify(`Copied ${PROFILE.email}`);
        },
      },
      {
        id: 'open-resume',
        title: 'Open / Download Resume PDF',
        subtitle: 'SUJAL_TONGE.pdf',
        tag: 'PDF ↗',
        icon: <FileText size={16} />,
        action: () => window.open(PROFILE.resumePath, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-github',
        title: 'Open GitHub Profile',
        subtitle: PROFILE.github,
        tag: 'EXTERNAL ↗',
        icon: <Code2 size={16} />,
        action: () => window.open(PROFILE.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-linkedin',
        title: 'Open LinkedIn Profile',
        subtitle: PROFILE.linkedin,
        tag: 'EXTERNAL ↗',
        icon: <ArrowUpRight size={16} />,
        action: () => window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer'),
      },
    ],
    [onNotify, scrollTo]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (!open) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filtered, onClose, open, selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.searchBar}>
              <Search size={18} color="#00F0FF" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, project, or action..."
                className={styles.searchInput}
              />
              <span className={styles.escBadge}>ESC</span>
            </div>

            <div className={styles.list}>
              {filtered.length === 0 ? (
                <div className={styles.empty}>No matching commands found.</div>
              ) : (
                filtered.map((cmd, idx) => (
                  <button
                    key={cmd.id}
                    type="button"
                    className={`${styles.item} ${idx === selectedIndex ? styles.itemActive : ''}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                  >
                    <div className={styles.itemLeft}>
                      <div className={styles.itemIcon}>{cmd.icon}</div>
                      <div>
                        <div className={styles.itemTitle}>{cmd.title}</div>
                        <div className={styles.itemSub}>{cmd.subtitle}</div>
                      </div>
                    </div>
                    <span className={styles.itemTag}>{cmd.tag}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
