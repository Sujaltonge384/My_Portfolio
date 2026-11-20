'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import { PROFILE } from '@/data/portfolio';
import { MaskedText } from '@/components/motion/MaskedText';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';
import styles from './ContactFooter.module.css';
import { FooterVisitorCounter } from './FooterVisitorCounter';

gsap.registerPlugin(ScrollTrigger);

interface ContactFooterProps {
  onNotify: (msg: string) => void;
}

export function ContactFooter({ onNotify }: ContactFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      if (!footerRef.current || !marqueeTrackRef.current) return;

      const tween = gsap.to(marqueeTrackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const skew = gsap.utils.clamp(-10, 10, velocity / 280);
          const speedBoost = 1 + Math.min(3.5, Math.abs(velocity) / 600);

          gsap.to(marqueeTrackRef.current, {
            skewX: skew,
            duration: 0.25,
            overwrite: 'auto',
          });

          gsap.to(tween, {
            timeScale: velocity < 0 ? -speedBoost : speedBoost,
            duration: 0.3,
            overwrite: 'auto',
          });
        },
      });
    },
    { scope: footerRef }
  );

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard?.writeText(value);
    onNotify(`Copied ${label}: ${value}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        onNotify(data.error || 'Please check your input fields.');
      } else {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
        onNotify('Message dispatched to Sujal Tonge!');
      }
    } catch {
      onNotify('Network error — please try copying sujaltonge384@gmail.com');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer id="contact" ref={footerRef} className={styles.footer}>
      {/* Scroll-Velocity Reactive Marquee */}
      <div className={styles.marqueeBand} aria-hidden="true">
        <div ref={marqueeTrackRef} className={styles.marqueeTrack}>
          {[0, 1].map((dup) => (
            <div key={dup} className={styles.marqueeText}>
              LET&apos;S ENGINEER SCALABLE SOFTWARE <span className={styles.marqueeAccent}>•</span>{' '}
              NEXT.JS <span className={styles.marqueeAccent}>•</span> FASTAPI{' '}
              <span className={styles.marqueeAccent}>•</span> PGVECTOR{' '}
              <span className={styles.marqueeAccent}>•</span>{' '}
            </div>
          ))}
        </div>
      </div>

      <div className="sectionShell">
        <span className="eyebrowTag" style={{ marginBottom: 14 }}>
          <Mail size={13} />
          INITIATE CONNECTION // NAGPUR, IN
        </span>
        <MaskedText
          text="Let's Build Something High-Impact"
          as="h2"
          className="sectionHeading"
        />

        <div className={styles.splitGrid}>
          {/* Validated Contact Form */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.fieldRow}>
                <div>
                  <label htmlFor="contact-name" className={styles.label}>
                    YOUR NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={styles.label}>
                    YOUR EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className={styles.input}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-msg" className={styles.label}>
                  PROJECT OR ROLE DETAILS
                </label>
                <textarea
                  id="contact-msg"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your full-stack engineering role, product build, or AI integration..."
                  className={styles.textarea}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <MagneticWrapper strength={0.25}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitBtn}
                    data-cursor="SEND"
                  >
                    <Send size={16} />
                    <span>{submitting ? 'Dispatching...' : 'Send Message'}</span>
                  </button>
                </MagneticWrapper>

                {submitted && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.78rem',
                      color: 'var(--accent-emerald)',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Message received!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Magnetic Direct Contact Tiles */}
          <div className={styles.tilesGrid}>
            <MagneticWrapper strength={0.2}>
              <button
                type="button"
                className={styles.tile}
                onClick={() => handleCopy(PROFILE.email, 'Email')}
                data-cursor="COPY"
              >
                <div className={styles.tileTop}>
                  <Mail size={20} />
                  <Copy size={15} />
                </div>
                <div>
                  <div className={styles.tileLabel}>DIRECT EMAIL (CLICK TO COPY)</div>
                  <div className={styles.tileValue}>{PROFILE.email}</div>
                </div>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.2}>
              <button
                type="button"
                className={styles.tile}
                onClick={() => handleCopy(PROFILE.phone, 'Phone')}
                data-cursor="COPY"
              >
                <div className={styles.tileTop}>
                  <Phone size={20} />
                  <Copy size={15} />
                </div>
                <div>
                  <div className={styles.tileLabel}>PHONE / WHATSAPP (COPY)</div>
                  <div className={styles.tileValue}>{PROFILE.phone}</div>
                </div>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.2}>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tile}
                data-cursor="GITHUB"
              >
                <div className={styles.tileTop}>
                  <Github size={20} />
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <div className={styles.tileLabel}>SOURCE REPOSITORIES</div>
                  <div className={styles.tileValue}>GitHub // Sujal Tonge</div>
                </div>
              </a>
            </MagneticWrapper>

            <MagneticWrapper strength={0.2}>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tile}
                data-cursor="LINKEDIN"
              >
                <div className={styles.tileTop}>
                  <Linkedin size={20} />
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <div className={styles.tileLabel}>PROFESSIONAL NETWORK</div>
                  <div className={styles.tileValue}>LinkedIn // Sujal Tonge</div>
                </div>
              </a>
            </MagneticWrapper>
          </div>
        </div>
        
        <div className={styles.bottomMeta}>
          <span>© {new Date().getFullYear()} SUJAL TONGE. ALL RIGHTS RESERVED.</span>
          <span>ENGINEERED WITH NEXT.JS • GSAP • FRAMER MOTION • LENIS</span>
        </div>
        <FooterVisitorCounter/> 
      </div>
    </footer>
  );
}
