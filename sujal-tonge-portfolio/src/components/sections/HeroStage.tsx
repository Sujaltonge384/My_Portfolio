'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  Database,
  Layers,
  Play,
  Sparkles,
} from 'lucide-react';
import { HERO_TELEMETRY, PROFILE, VECTOR_SANDBOX_PROMPTS } from '@/data/portfolio';
import { useSmoothScroll } from '@/components/motion/SmoothScrollProvider';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';
import type { NeonTheme } from './Navbar';
import styles from './HeroStage.module.css';

gsap.registerPlugin(ScrollTrigger);

interface HeroStageProps {
  onNotify: (msg: string) => void;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*';
const KONAMI_SEQ = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const PIPELINE_NODES = [
  {
    id: 'client',
    stepIndex: 0,
    tag: '01 // CLIENT_LAYER',
    title: 'Next.js + React + TS',
    desc: 'SSR/App Router interfaces, Web Speech API voice capture, Redux Toolkit Query caching & 60fps GSAP/Motion UI.',
    trace: 'GET /api/search?q=linen+blazer -> dispatch RTKQ query',
  },
  {
    id: 'api',
    stepIndex: 1,
    tag: '02 // INFERENCE_&_REST',
    title: 'FastAPI + Node.js / Express',
    desc: 'Async Python OpenCLIP embedding pipelines, Gemini NL search, GitHub OAuth REST ingestion & JWT RBAC middleware.',
    trace: 'OpenCLIP ViT-B/32 encoded 512-d vector in 8.4ms',
  },
  {
    id: 'data',
    stepIndex: 2,
    tag: '03 // VECTOR_&_PERSISTENCE',
    title: 'PostgreSQL + pgvector / MongoDB',
    desc: '512-d cosine similarity search across 26,756 validated records, Prisma ORM schemas & MongoDB Atlas clusters.',
    trace: 'pgvector <=> cosine scan returned top-k in 5.8ms (200 OK)',
  },
];

export function HeroStage({ onNotify }: HeroStageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const upperRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.35 });
  const shockwavesRef = useRef<Shockwave[]>([]);
  const konamiIdxRef = useRef(0);

  const [activeTab, setActiveTab] = useState<'architecture' | 'vectors' | 'telemetry'>('architecture');
  const [activeNode, setActiveNode] = useState<string>('api');
  const [packetHop, setPacketHop] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.84);
  const [copied, setCopied] = useState(false);
  const [roleText, setRoleText] = useState(PROFILE.heroSubheadline);
  const [theme, setTheme] = useState<NeonTheme>('blue-pink');
  const [overclock, setOverclock] = useState(false);
  const roleIdxRef = useRef(0);

  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const syncTheme = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      setTheme(attr === 'orange' ? 'orange' : 'blue-pink');
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Konami code listener for Overclock Mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI_SEQ[konamiIdxRef.current];
      if (key === expected) {
        konamiIdxRef.current += 1;
        if (konamiIdxRef.current === KONAMI_SEQ.length) {
          konamiIdxRef.current = 0;
          setOverclock((prev) => {
            const next = !prev;
            onNotify(
              next
                ? 'OVERCLOCK MODE ENGAGED // Canvas & Vector Boost Active'
                : 'Standard Clock Restored'
            );
            return next;
          });
        }
      } else {
        konamiIdxRef.current = key === KONAMI_SEQ[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onNotify]);

  // Animated Neon Wave, Vector Node & Click Shockwave Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const nodes = Array.from({ length: 76 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.3 + (i % 3) * 0.9,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      const speedMult = overclock ? 2.4 : 1;
      time += 0.012 * speedMult;
      const isOrange = theme === 'orange';

      ctx.clearRect(0, 0, width, height);

      const auraX = width * (0.25 + pointerRef.current.x * 0.5);
      const auraY = height * (0.18 + pointerRef.current.y * 0.45);
      const aura = ctx.createRadialGradient(
        auraX,
        auraY,
        24,
        auraX,
        auraY,
        Math.max(width, height) * 0.58
      );

      if (isOrange) {
        aura.addColorStop(0, 'rgba(255, 106, 0, 0.28)');
        aura.addColorStop(0.45, 'rgba(255, 190, 11, 0.14)');
        aura.addColorStop(1, 'rgba(17, 7, 3, 0)');
      } else {
        aura.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
        aura.addColorStop(0.45, 'rgba(255, 42, 133, 0.18)');
        aura.addColorStop(1, 'rgba(5, 7, 17, 0)');
      }
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      const waves = isOrange
        ? [
            {
              amp: overclock ? 74 : 60,
              freq: 0.004,
              speed: 1.15,
              yBase: height * 0.42,
              color: 'rgba(255, 106, 0, 0.42)',
              lineWidth: 2,
            },
            {
              amp: overclock ? 96 : 82,
              freq: 0.0029,
              speed: -0.85,
              yBase: height * 0.48,
              color: 'rgba(255, 190, 11, 0.34)',
              lineWidth: 1.6,
            },
            {
              amp: 44,
              freq: 0.0054,
              speed: 1.5,
              yBase: height * 0.36,
              color: 'rgba(251, 113, 133, 0.28)',
              lineWidth: 1.3,
            },
          ]
        : [
            {
              amp: overclock ? 74 : 60,
              freq: 0.004,
              speed: 1.15,
              yBase: height * 0.42,
              color: 'rgba(0, 240, 255, 0.38)',
              lineWidth: 2,
            },
            {
              amp: overclock ? 96 : 82,
              freq: 0.0029,
              speed: -0.85,
              yBase: height * 0.48,
              color: 'rgba(255, 42, 133, 0.36)',
              lineWidth: 1.7,
            },
            {
              amp: 44,
              freq: 0.0054,
              speed: 1.5,
              yBase: height * 0.36,
              color: 'rgba(59, 130, 246, 0.28)',
              lineWidth: 1.3,
            },
          ];

      waves.forEach((wave, idx) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const offset = (pointerRef.current.y - 0.5) * 42 * (idx + 1) * 0.32;
          const y =
            wave.yBase +
            offset +
            Math.sin(x * wave.freq + time * wave.speed + idx) * wave.amp +
            Math.cos(x * wave.freq * 0.5 - time * 0.6) * (wave.amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.stroke();
      });

      const activeWaves: Shockwave[] = [];
      for (const sw of shockwavesRef.current) {
        sw.radius += 5.5 * speedMult;
        sw.alpha *= 0.955;
        if (sw.alpha > 0.02) {
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isOrange
            ? `rgba(255, 140, 0, ${sw.alpha})`
            : `rgba(0, 240, 255, ${sw.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          activeWaves.push(sw);
        }
      }
      shockwavesRef.current = activeWaves;

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += (p.vx + (pointerRef.current.x - 0.5) * 0.22) * speedMult;
        p.y += (p.vy + (pointerRef.current.y - 0.5) * 0.22) * speedMult;
        p.phase += 0.03 * speedMult;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = 0.55 + 0.45 * Math.sin(p.phase);
        const nodeColor = isOrange
          ? i % 2 === 0
            ? `rgba(255, 106, 0, ${pulse})`
            : `rgba(255, 190, 11, ${pulse})`
          : i % 2 === 0
            ? `rgba(0, 240, 255, ${pulse})`
            : `rgba(255, 42, 133, ${pulse})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isOrange
              ? `rgba(255, 138, 0, ${alpha})`
              : i % 2 === 0
                ? `rgba(0, 240, 255, ${alpha})`
                : `rgba(255, 42, 133, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, overclock]);

  useGSAP(
    () => {
      if (!heroRef.current || !upperRef.current || !dockRef.current) return;

      const chars = upperRef.current.querySelectorAll('.hero-title-char');
      gsap.fromTo(
        chars,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.032,
          ease: 'power4.out',
          delay: 0.2,
        }
      );

      gsap.fromTo(
        dockRef.current,
        { y: 50, opacity: 0, rotateX: 14, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          rotateX: 11,
          scale: 0.94,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.45,
        }
      );

      gsap.to(upperRef.current, {
        y: -75,
        opacity: 0.15,
        filter: 'blur(5px)',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 35%',
          scrub: 1,
        },
      });

      gsap.fromTo(
        dockRef.current,
        { rotateX: 11, scale: 0.94 },
        {
          rotateX: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '65% top',
            scrub: 1,
          },
        }
      );
    },
    { scope: heroRef }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    heroRef.current.style.setProperty('--cursor-x', `${xPx}px`);
    heroRef.current.style.setProperty('--cursor-y', `${yPx}px`);
    pointerRef.current = {
      x: xPx / Math.max(rect.width, 1),
      y: yPx / Math.max(rect.height, 1),
    };
  };

  const handleStageClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    shockwavesRef.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 8,
      alpha: 0.75,
    });
  };

  const runPacketSimulation = () => {
    setPacketHop(0);
    setActiveNode('client');
    setTimeout(() => {
      setPacketHop(1);
      setActiveNode('api');
    }, 450);
    setTimeout(() => {
      setPacketHop(2);
      setActiveNode('data');
    }, 900);
    setTimeout(() => {
      setPacketHop(null);
      onNotify('Packet traced: Client -> FastAPI/Express -> pgvector (14.2ms / 200 OK)');
    }, 1450);
  };

  const triggerRoleScramble = () => {
    roleIdxRef.current = (roleIdxRef.current + 1) % PROFILE.scrambleRoles.length;
    const target = PROFILE.scrambleRoles[roleIdxRef.current];
    let iteration = 0;

    const timer = setInterval(() => {
      setRoleText(
        target
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iteration) return target[idx];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      iteration += 1.2;
      if (iteration >= target.length) {
        setRoleText(target);
        clearInterval(timer);
      }
    }, 24);
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email);
    setCopied(true);
    onNotify(`Copied ${PROFILE.email} to clipboard`);
    setTimeout(() => setCopied(false), 2200);
  };

  const currentVector = VECTOR_SANDBOX_PROMPTS[selectedPrompt];
  const numericSimilarity = parseFloat(String(currentVector.similarity)) || 0.91;
  const passesThreshold = numericSimilarity >= similarityThreshold;

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      onMouseMove={handleMouseMove}
      onClick={handleStageClick}
      aria-label="Hero Introduction"
    >
      <canvas ref={canvasRef} className={styles.blueCanvas} aria-hidden="true" />
      <div className={styles.gridBg} />
      <div className={styles.cursorAura} />

      <div ref={upperRef} className={styles.upperStage}>
        <motion.button
          type="button"
          className={styles.eyebrowRow}
          onClick={(e) => {
            e.stopPropagation();
            triggerRoleScramble();
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          data-cursor="DECODE"
        >
          <Sparkles size={14} />
          <span>
            {overclock ? 'OVERCLOCK_MODE // ' : 'FULL STACK SOFTWARE DEVELOPER // '}
            CLICK TO CYCLE FOCUS
          </span>
        </motion.button>

        <h1 className={styles.displayTitle} aria-label={PROFILE.name}>
          {PROFILE.name.split(' ').map((word, wIdx) => (
            <span
              key={wIdx}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                marginRight: wIdx === 0 ? '0.26em' : 0,
              }}
            >
              {word.split('').map((char, cIdx) => (
                <motion.span
                  key={cIdx}
                  className={`hero-title-char ${styles.charHover}`}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <div className={styles.roleBanner} onMouseEnter={triggerRoleScramble}>
          {roleText}
        </div>

        <p className={styles.subcopy}>{PROFILE.summary}</p>

        <div className={styles.ctaRow}>
          <MagneticWrapper strength={0.3}>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={(e) => {
                e.stopPropagation();
                scrollTo('#projects', -20);
              }}
              data-cursor="EXPLORE"
            >
              <span>Explore Projects</span>
              <ArrowDown size={17} />
            </button>
          </MagneticWrapper>

          <MagneticWrapper strength={0.28}>
            <a
              href={PROFILE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
              onClick={(e) => e.stopPropagation()}
              data-cursor="RESUME"
            >
              <span>View Resume</span>
              <ArrowUpRight size={16} />
            </a>
          </MagneticWrapper>

          <MagneticWrapper strength={0.25}>
            <button
              type="button"
              className={styles.copyPill}
              onClick={(e) => {
                e.stopPropagation();
                handleCopyEmail();
              }}
              data-cursor="COPY"
            >
              {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
              <span>{copied ? 'Copied sujaltonge384@gmail.com' : PROFILE.email}</span>
            </button>
          </MagneticWrapper>
        </div>
      </div>

      {/* 3D Perspective Interactive System Sandbox Dock */}
      <div className={styles.perspectiveStage} onClick={(e) => e.stopPropagation()}>
        <div ref={dockRef} className={styles.sandboxDock} data-cursor="INTERACT">
          <div className={styles.dockHeader}>
            <div className={styles.windowDots}>
              <span style={{ background: '#EF4444' }} />
              <span style={{ background: '#F59E0B' }} />
              <span style={{ background: '#10B981' }} />
            </div>

            <div className={styles.tabBar} role="tablist">
              {[
                { id: 'architecture', label: '01 // architecture.flow' },
                { id: 'vectors', label: '02 // vastra_ai.vectors' },
                { id: 'telemetry', label: '03 // verified.telemetry' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="hero-sandbox-tab"
                        className={styles.tabHighlight}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      />
                    )}
                    <span className={styles.tabLabel}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.dockStatus}>
              <Cpu size={13} />
              <span>{overclock ? 'OVERCLOCK 2.4X' : 'SCROLL TO FLATTEN'}</span>
            </div>
          </div>

          <div className={styles.dockBody}>
            {activeTab === 'architecture' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.73rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    TRACE:{' '}
                    <strong style={{ color: 'var(--accent-cyan)' }}>
                      {PIPELINE_NODES.find((n) => n.id === activeNode)?.trace}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={runPacketSimulation}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: '1px solid var(--border-bright)',
                      background: 'var(--surface-hover)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={12} />
                    <span>{packetHop !== null ? 'TRACING PACKET...' : 'SEND PACKET'}</span>
                  </button>
                </div>

                <div className={styles.pipelineGrid}>
                  {PIPELINE_NODES.map((node, idx) => {
                    const isHopping = packetHop === node.stepIndex;
                    return (
                      <React.Fragment key={node.id}>
                        <div
                          className={`${styles.pipeNode} ${
                            activeNode === node.id || isHopping ? styles.pipeNodeActive : ''
                          }`}
                          style={
                            isHopping
                              ? {
                                  boxShadow: '0 0 26px rgba(0, 240, 255, 0.35)',
                                }
                              : undefined
                          }
                          onMouseEnter={() => setActiveNode(node.id)}
                          onClick={() => setActiveNode(node.id)}
                        >
                          <span className={styles.pipeTag}>{node.tag}</span>
                          <div className={styles.pipeTitle}>{node.title}</div>
                          <p className={styles.pipeDesc}>{node.desc}</p>
                        </div>
                        {idx < PIPELINE_NODES.length - 1 && (
                          <div className={styles.pipeConnector}>
                            <ArrowRight size={18} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'vectors' && (
              <div className={styles.vectorGrid}>
                <div className={styles.promptList}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.72rem',
                      color: 'var(--accent-cyan)',
                      marginBottom: '4px',
                    }}
                  >
                    SELECT QUERY TO TEST OPENCLIP + PGVECTOR RETRIEVAL:
                  </div>
                  {VECTOR_SANDBOX_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.promptChip} ${
                        selectedPrompt === idx ? styles.promptChipActive : ''
                      }`}
                      onClick={() => setSelectedPrompt(idx)}
                    >
                      &gt; {item.query}
                    </button>
                  ))}
                </div>

                <motion.div
                  key={selectedPrompt}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={styles.vectorResultCard}
                >
                  <span className={styles.scoreBadge}>
                    COSINE SIMILARITY: {currentVector.similarity} •{' '}
                    {passesThreshold ? 'MATCH PASSED' : 'BELOW THRESHOLD'}
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display), sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    {currentVector.topMatch}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span>
                      <Layers size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                      Pipeline: {currentVector.modality}
                    </span>
                    <span>
                      <Database size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                      Index: {currentVector.recordsSearched} (3,244 dupes removed)
                    </span>
                  </div>

                  <div style={{ marginTop: '14px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        marginBottom: '6px',
                      }}
                    >
                      <span>MIN_COSINE_THRESHOLD</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>
                        {similarityThreshold.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={0.99}
                      step={0.01}
                      value={similarityThreshold}
                      onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-cyan)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'telemetry' && (
              <div className={styles.telemetryGrid}>
                {HERO_TELEMETRY.map((item) => (
                  <div key={item.id} className={styles.telemetryTile}>
                    <div className={styles.telemetryVal} style={{ color: item.accent }}>
                      {item.value}
                    </div>
                    <div className={styles.telemetryLabel}>{item.label}</div>
                    <div className={styles.telemetryDetail}>{item.detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}