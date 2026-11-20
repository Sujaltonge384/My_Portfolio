'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GitCommit } from 'lucide-react';
import { TIMELINE_MILESTONES } from '@/data/portfolio';
import { MaskedText } from '@/components/motion/MaskedText';
import styles from './CircuitTimeline.module.css';

gsap.registerPlugin(ScrollTrigger);

export function CircuitTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const beamRef = useRef<SVGLineElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !beamRef.current) return;

      gsap.fromTo(
        beamRef.current,
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: 0.6,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={styles.section}
      aria-label="Experience, Education and Achievements"
    >
      <div className="sectionShell">
        <div className={styles.header}>
          <span className="eyebrowTag" style={{ marginBottom: 14 }}>
            <GitCommit size={13} />
            EXECUTION LOG // SCROLL-SCRUBBED CIRCUIT
          </span>
          <MaskedText
            text="Experience, Education & Milestones"
            as="h2"
            className="sectionHeading"
          />
        </div>

        <div className={styles.timelineWrap}>
          {/* Scroll-Scrubbed SVG Circuit Beam */}
          <svg
            className={styles.svgSpine}
            viewBox="0 0 4 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="1000"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />
            <line
              ref={beamRef}
              x1="2"
              y1="0"
              x2="2"
              y2="1000"
              stroke="#00F0FF"
              strokeWidth="3"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            />
          </svg>

          {TIMELINE_MILESTONES.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={item.id} className={styles.row}>
                {/* Left Column on Desktop for Even Indices */}
                {isEven ? (
                  <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, x: -32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <MilestoneContent item={item} />
                  </motion.div>
                ) : (
                  <div />
                )}

                <motion.div
                  className={styles.nodeDot}
                  initial={{ scale: 0.4, opacity: 0.3 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                />

                {/* Right Column on Desktop for Odd Indices */}
                {!isEven ? (
                  <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <MilestoneContent item={item} />
                  </motion.div>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MilestoneContent({ item }: { item: (typeof TIMELINE_MILESTONES)[number] }) {
  return (
    <>
      <div className={styles.cardTop}>
        <span className={styles.nodeCode}>{item.nodeCode}</span>
        <span className={styles.metricPill}>
          {item.metricBadge}: {item.metricValue}
          {item.metricSuffix}
        </span>
      </div>
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <div className={styles.cardOrg}>{item.organization}</div>
      <div className={styles.cardMeta}>
        {item.period} • {item.location}
      </div>
      <p className={styles.cardDesc}>{item.description}</p>
      <ul className={styles.bullets}>
        {item.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </>
  );
}
