'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export function FooterVisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<string>('1,420');

  useEffect(() => {
    let cancelled = false;
    const sessionKey = 'sujal-portfolio-counted-v1';
    const alreadyCounted = sessionStorage.getItem(sessionKey) === '1';

    fetch('/api/visits', { method: alreadyCounted ? 'GET' : 'POST' })
      .then((res) => res.json())
      .then((data: { formatted?: string; count?: number }) => {
        if (cancelled) return;
        if (!alreadyCounted) {
          sessionStorage.setItem(sessionKey, '1');
        }
        if (typeof data.formatted === 'string') {
          setVisitorCount(data.formatted);
        } else if (typeof data.count === 'number') {
          setVisitorCount(data.count.toLocaleString('en-US'));
        }
      })
      .catch(() => {
        // Keep initial count
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '999px',
        background: 'var(--surface-pill)',
        border: '1px solid var(--border-hairline)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
      }}
    >
      <Eye size={13} style={{ color: 'var(--accent-cyan)' }} />
      <span>LIVE VISITORS:</span>
      <strong style={{ color: 'var(--text-primary)' }}>{visitorCount}</strong>
    </div>
  );
}