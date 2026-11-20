'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Mail, Send } from 'lucide-react';
import { PROFILE } from '@/data/portfolio';

interface InteractiveContactPanelProps {
  onNotify: (msg: string) => void;
}

const INQUIRY_TYPES = [
  'Full-Stack Role',
  'Freelance Build',
  'AI / Vector System',
  'Collaboration',
] as const;

export function InteractiveContactPanel({ onNotify }: InteractiveContactPanelProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<(typeof INQUIRY_TYPES)[number]>('Full-Stack Role');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill out your name, email, and project or role details.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg(null);
    setSubmitted(true);
    onNotify(`Inquiry prepared for ${PROFILE.email} (${inquiryType})`);
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent(`[${inquiryType}] Inquiry from ${name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nType: ${inquiryType}\n\n${message}`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyDirectEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email);
    onNotify(`Copied ${PROFILE.email} to clipboard`);
  };

  return (
    <div
      style={{
        borderRadius: '22px',
        padding: '28px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        boxShadow: 'var(--dock-shadow)',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
            DIRECT_DISPATCH // {PROFILE.location.toUpperCase()}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            Start a Conversation
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCopyDirectEmail}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 14px',
            borderRadius: '999px',
            border: '1px solid var(--border-hairline)',
            background: 'var(--surface-pill)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.74rem',
            cursor: 'pointer',
          }}
        >
          <Copy size={13} />
          <span>{PROFILE.email}</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
        {INQUIRY_TYPES.map((type) => {
          const active = inquiryType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                setInquiryType(type);
                setSubmitted(false);
              }}
              style={{
                padding: '6px 13px',
                borderRadius: '999px',
                border: `1px solid ${active ? 'var(--border-bright)' : 'var(--border-hairline)'}`,
                background: active ? 'var(--surface-hover)' : 'var(--surface-subtle)',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
            >
              {type}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border-bright)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <CheckCircle2 size={18} />
            <span>Message Ready for {PROFILE.email}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
            Thanks, <strong>{name}</strong>. Launch your default email client with this message pre-filled or copy Sujal&apos;s address directly.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={handleOpenMailClient}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '999px',
                border: 'none',
                background: 'var(--cta-gradient)',
                color: 'var(--cta-text)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <Mail size={14} />
              <span>Open in Mail App</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid var(--border-hairline)',
                background: 'var(--surface-pill)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Edit Another Message
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-hairline)',
                background: 'var(--surface-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <input
              type="email"
              placeholder="your.email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-hairline)',
                background: 'var(--surface-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <textarea
            rows={4}
            placeholder="Tell me about the role, full-stack build, or AI/vector system you're building..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-hairline)',
              background: 'var(--surface-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              lineHeight: 1.55,
              resize: 'vertical',
              outline: 'none',
            }}
          />

          {errorMsg && (
            <div style={{ color: '#fb7185', fontFamily: 'var(--font-mono), monospace', fontSize: '0.75rem' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '999px',
                border: 'none',
                background: 'var(--cta-gradient)',
                color: 'var(--cta-text)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: 'var(--cta-shadow)',
              }}
            >
              <Send size={14} />
              <span>Prepare Inquiry</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}