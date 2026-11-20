'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Command, Copy, Flame, FolderGit2, Navigation, Search, Sparkles, X } from 'lucide-react';
import { PROFILE } from '@/data/portfolio';
import { useSmoothScroll } from '@/components/motion/SmoothScrollProvider';
import { PORTFOLIO_CASE_STUDIES, type ProjectCaseStudy } from './CaseStudyDrawer';

interface ActionCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onSelectProject: (project: ProjectCaseStudy) => void;
}

interface PaletteCommand {
  id: string;
  label: string;
  category: 'Navigation' | 'Theme & Actions' | 'Case Studies';
  shortcut?: string;
  icon: React.ReactNode;
  run: () => void;
}

export function ActionCommandPalette({
  open,
  onClose,
  onNotify,
  onSelectProject,
}: ActionCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const toggleNeonTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'orange' ? 'blue-pink' : 'orange';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('sujal-portfolio-theme', next);
    } catch {
      // Ignore storage errors
    }
    onNotify(
      next === 'orange'
        ? 'Switched to Neon Orange & Amber theme'
        : 'Switched to Neon Blue & Pink theme'
    );
    onClose();
  };

  const commands = useMemo<PaletteCommand[]>(() => {
    const navCmds: PaletteCommand[] = [
      { id: 'go-top', label: 'Jump to Hero Stage', category: 'Navigation', icon: <Navigation size={14} />, run: () => { scrollTo(0, 0); onClose(); } },
      { id: 'go-projects', label: 'Jump to Projects', category: 'Navigation', icon: <Navigation size={14} />, run: () => { scrollTo('#projects', -40); onClose(); } },
      { id: 'go-bubbles', label: 'Jump to Tech Stack Bubbles', category: 'Navigation', icon: <Navigation size={14} />, run: () => { scrollTo('#stack-bubbles', -40); onClose(); } },
      { id: 'go-stack', label: 'Jump to Tech Stack', category: 'Navigation', icon: <Navigation size={14} />, run: () => { scrollTo('#stack', -40); onClose(); } },
      { id: 'go-timeline', label: 'Jump to Timeline', category: 'Navigation', icon: <Navigation size={14} />, run: () => { scrollTo('#timeline', -40); onClose(); } },
      { id: 'go-contact', label: 'Jump to Contact', category: 'Navigation', icon: <Navigation size={14} />, run: () => { scrollTo('#contact', -40); onClose(); } },
    ];

    const actionCmds: PaletteCommand[] = [
      {
        id: 'theme-blue-pink',
        label: 'Activate Neon Blue & Pink Theme',
        category: 'Theme & Actions',
        shortcut: 'T',
        icon: <Sparkles size={14} />,
        run: () => {
          document.documentElement.setAttribute('data-theme', 'blue-pink');
          onNotify('Switched to Neon Blue & Pink theme');
          onClose();
        },
      },
      {
        id: 'theme-orange',
        label: 'Activate Neon Orange & Amber Theme',
        category: 'Theme & Actions',
        shortcut: 'T',
        icon: <Flame size={14} />,
        run: toggleNeonTheme,
      },
      {
        id: 'copy-email',
        label: `Copy Email (${PROFILE.email})`,
        category: 'Theme & Actions',
        icon: <Copy size={14} />,
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email);
          onNotify(`Copied ${PROFILE.email} to clipboard`);
          onClose();
        },
      },
      {
        id: 'open-resume',
        label: 'Open Resume PDF',
        category: 'Theme & Actions',
        icon: <ArrowUpRight size={14} />,
        run: () => {
          window.open(PROFILE.resumePath, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
    ];

    const caseStudyCmds: PaletteCommand[] = PORTFOLIO_CASE_STUDIES.map((proj) => ({
      id: `case-${proj.id}`,
      label: `Inspect Case Study: ${proj.title}`,
      category: 'Case Studies',
      icon: <FolderGit2 size={14} />,
      run: () => {
        onClose();
        onSelectProject(proj);
      },
    }));

    return [...actionCmds, ...caseStudyCmds, ...navCmds];
  }, [onClose, onNotify, onSelectProject, scrollTo]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9996,
            background: 'rgba(2, 5, 14, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '12vh 16px 24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command Palette"
            style={{
              width: '100%',
              maxWidth: '560px',
              borderRadius: '20px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-bright)',
              boxShadow: 'var(--dock-shadow)',
              overflow: 'hidden',
              color: 'var(--text-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
              <Search size={16} style={{ color: 'var(--accent-cyan)' }} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, theme, section, or project..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.84rem',
                }}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  No matching commands for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={cmd.run}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.84rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>{cmd.icon}</span>
                      <span>{cmd.label}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {cmd.shortcut || cmd.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: '1px solid var(--border-hairline)', fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Command size={12} />
                <span>QUICK ACTIONS &amp; CASE STUDIES</span>
              </span>
              <span>ESC TO CLOSE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}