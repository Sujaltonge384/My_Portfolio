'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/sections/Navbar';
import { HeroStage } from '@/components/sections/HeroStage';
import { ProjectsTheater } from '@/components/sections/ProjectsTheater';
import { TechBento } from '@/components/sections/TechBento';
import { CircuitTimeline } from '@/components/sections/CircuitTimeline';
import { ContactFooter } from '@/components/sections/ContactFooter';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function PortfolioHomePage() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  }, []);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />

      <main>
        <HeroStage onNotify={triggerToast} />
        <ProjectsTheater />
        <TechBento />
        <CircuitTimeline />
      </main>

      <ContactFooter onNotify={triggerToast} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNotify={triggerToast}
      />

      {/* Global Spring-Animated Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 110,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 18px',
              borderRadius: 999,
              background: 'rgba(13, 17, 26, 0.94)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.78rem',
              color: '#F8FAFC',
            }}
          >
            <CheckCircle2 size={16} color="#10B981" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
