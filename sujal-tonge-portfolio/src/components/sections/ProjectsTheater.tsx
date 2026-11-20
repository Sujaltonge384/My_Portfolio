'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  CloudSun,
  ExternalLink,
  GitBranch,
  Github,
  Layers,
  ScanSearch,
  X,
} from 'lucide-react';
import { PROJECTS, ProjectItem } from '@/data/portfolio';
import { MaskedText } from '@/components/motion/MaskedText';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';
import styles from './ProjectsTheater.module.css';

gsap.registerPlugin(ScrollTrigger);

export function ProjectsTheater() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Interactive mini-demo states inside mockups
  const [vectorScanActive, setVectorScanActive] = useState(true);
  const [kanbanStage, setKanbanStage] = useState<0 | 1 | 2>(1);
  const [craftStage, setCraftStage] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 960px)', () => {
        if (!sectionRef.current || !trackRef.current) return;

        const getScrollDistance = () => {
          if (!trackRef.current) return 0;
          return Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 96);
        };

        gsap.to(trackRef.current, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                PROJECTS.length - 1,
                Math.floor(self.progress * PROJECTS.length)
              );
              setActiveIndex(idx);
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={styles.wrapper}
      aria-label="Featured Engineering Projects"
    >
      <div
        className={styles.ambientGlow}
        style={{ background: activeProject.themeColor }}
      />

      <div className="sectionShell">
        <div className={styles.headerRow}>
          <div>
            <span className="eyebrowTag" style={{ marginBottom: 14 }}>
              <Layers size={13} />
              SELECTED SYSTEMS // PINNED HORIZONTAL THEATER
            </span>
            <MaskedText
              text="Featured Engineering Builds"
              as="h2"
              className="sectionHeading"
            />
          </div>

          <div className={styles.hudCounter}>
            STAGE <span style={{ color: activeProject.themeColor }}>0{activeIndex + 1}</span> / 0
            {PROJECTS.length} — {activeProject.title.toUpperCase()}
          </div>
        </div>
      </div>

      <div className={styles.trackViewport}>
        <div ref={trackRef} className={styles.track}>
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className={styles.slideCard}
              style={{
                borderColor: `rgba(${project.themeRgb}, 0.24)`,
              }}
            >
              <div>
                <span
                  className={styles.slideIndex}
                  style={{ color: project.themeColor }}
                >
                  {project.index} // {project.period}
                </span>
                <h3 className={styles.slideTitle}>{project.title}</h3>
                <div className={styles.slideSub}>{project.subtitle}</div>
                <p className={styles.slideSummary}>{project.summary}</p>

                <div className={styles.metricStrip}>
                  {project.metrics.map((m) => (
                    <div key={m.label} className={styles.metricBox}>
                      <div
                        className={styles.metricValue}
                        style={{ color: project.themeColor }}
                      >
                        {m.value}
                      </div>
                      <div className={styles.metricLabel}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className={styles.stackRow}>
                  {project.stack.map((tech) => (
                    <span key={tech} className={styles.stackPill}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div className={styles.btnRow}>
                  <MagneticWrapper strength={0.25}>
                    <button
                      type="button"
                      className={styles.inspectBtn}
                      style={{ background: project.themeColor }}
                      onClick={() => setSelectedProject(project)}
                      data-cursor="VIEW CASE"
                    >
                      <span>Inspect Architecture</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </MagneticWrapper>

                  <MagneticWrapper strength={0.22}>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                      data-cursor="CODE"
                    >
                      <Github size={15} />
                      <span>GitHub</span>
                    </a>
                  </MagneticWrapper>

                  <MagneticWrapper strength={0.22}>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                      data-cursor="LIVE"
                    >
                      <ExternalLink size={15} />
                      <span>Live</span>
                    </a>
                  </MagneticWrapper>
                </div>
              </div>

              {/* Interactive Live Project Sandbox Preview */}
              <div
                className={styles.mockupWindow}
                onClick={() => setSelectedProject(project)}
                data-cursor="CASE STUDY"
              >
                <div className={styles.mockupTop}>
                  <span>{project.id.toUpperCase()} // INTERACTIVE_PREVIEW</span>
                  <span style={{ color: project.themeColor }}>● LIVE MODULE</span>
                </div>

                {project.previewType === 'vector-scan' && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setVectorScanActive((v) => !v);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.74rem',
                      }}
                    >
                      <span style={{ color: '#00F0FF' }}>
                        <ScanSearch size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                        OpenCLIP + pgvector Similarity Scan
                      </span>
                      <button
                        type="button"
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          background: 'rgba(0,240,255,0.14)',
                          border: '1px solid rgba(0,240,255,0.35)',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                        }}
                      >
                        {vectorScanActive ? 'Scan: ON' : 'Scan: OFF'}
                      </button>
                    </div>
                    <div className={styles.miniGrid}>
                      {[
                        { name: 'Structured Linen Jacket', sim: '0.968', match: true },
                        { name: 'Monochrome Tailored Trouser', sim: '0.942', match: true },
                        { name: 'Ribbed Knit Mockneck', sim: '0.884', match: false },
                        { name: 'Minimalist Derby Footwear', sim: '0.861', match: false },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={`${styles.miniCard} ${
                            vectorScanActive && item.match ? styles.miniCardHighlight : ''
                          }`}
                        >
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }}>
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono), monospace',
                              fontSize: '0.68rem',
                              color: item.match ? '#00F0FF' : '#64748b',
                            }}
                          >
                            cos_sim: {item.sim}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.previewType === 'kanban-live' && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setKanbanStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.74rem',
                        color: '#10B981',
                      }}
                    >
                      <span>
                        <GitBranch size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                        PR-to-Task Automation (Click to Advance)
                      </span>
                      <span>RTK Query Sync</span>
                    </div>
                    <div className={styles.kanbanCols}>
                      {['PR OPENED', 'TRIAGED', 'TASK DONE'].map((col, idx) => (
                        <div key={col} className={styles.kanbanCol}>
                          <div className={styles.kanbanHeader}>{col}</div>
                          {kanbanStage === idx ? (
                            <motion.div
                              layoutId="devpulse-pr-card"
                              className={styles.kanbanTask}
                              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                            >
                              feat(auth): GitHub OAuth token encryption #42
                            </motion.div>
                          ) : (
                            <div
                              style={{
                                height: 48,
                                borderRadius: 8,
                                border: '1px dashed rgba(255,255,255,0.08)',
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.previewType === 'heritage-timeline' && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCraftStage((prev) => (prev + 1) % 3);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.74rem',
                        color: '#F59E0B',
                      }}
                    >
                      <span>Aruvakode Pottery Timeline</span>
                      <span>
                        <CloudSun size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                        29°C Clear • OpenWeather
                      </span>
                    </div>
                    <div className={styles.heritageSteps}>
                      {[
                        { step: '01. Riverbed Clay Extraction & Kneading', badge: 'Stage 1' },
                        { step: '02. Traditional Kick-Wheel Shaping', badge: 'Stage 2' },
                        { step: '03. Wood-Fired Kiln & Terracotta Glaze', badge: '93/100 Perf' },
                      ].map((item, idx) => (
                        <div
                          key={item.step}
                          className={`${styles.heritageStep} ${
                            craftStage === idx ? styles.heritageStepActive : ''
                          }`}
                        >
                          <span>{item.step}</span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono), monospace',
                              fontSize: '0.68rem',
                              color: '#F59E0B',
                            }}
                          >
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    marginTop: 14,
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                  }}
                >
                  Click card to open full system architecture drawer →
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className={styles.drawerBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.aside
              className={styles.drawerPanel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              aria-label={`${selectedProject.title} Case Study`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.75rem',
                    color: selectedProject.themeColor,
                  }}
                >
                  CASE STUDY // {selectedProject.index}
                </span>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close Case Study Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    fontSize: '2.1rem',
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  {selectedProject.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
                  {selectedProject.subtitle}
                </p>
              </div>

              <div className={styles.metricStrip}>
                {selectedProject.metrics.map((m) => (
                  <div key={m.label} className={styles.metricBox}>
                    <div
                      className={styles.metricValue}
                      style={{ color: selectedProject.themeColor }}
                    >
                      {m.value}
                    </div>
                    <div className={styles.metricLabel}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.76rem',
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                    letterSpacing: '0.08em',
                  }}
                >
                  KEY ENGINEERING DELIVERABLES
                </h4>
                <ul className={styles.bulletList}>
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  padding: 18,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-hairline)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.72rem',
                    color: selectedProject.themeColor,
                    marginBottom: 8,
                  }}
                >
                  SYSTEM DATA FLOW
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {selectedProject.architectureNotes}
                </p>
              </div>

              <div className={styles.stackRow}>
                {selectedProject.stack.map((tech) => (
                  <span key={tech} className={styles.stackPill}>
                    {tech}
                  </span>
                ))}
              </div>

              <div className={styles.btnRow}>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inspectBtn}
                  style={{ background: selectedProject.themeColor }}
                >
                  <Github size={16} />
                  <span>Source Code</span>
                </a>
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBtn}
                >
                  <ExternalLink size={16} />
                  <span>Live Deployment</span>
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
