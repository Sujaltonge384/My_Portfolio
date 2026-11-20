'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Cpu, Layers, X } from 'lucide-react';

export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  stack: string[];
  summary: string;
  problem: string;
  architecture: string[];
  metrics: { label: string; value: string }[];
  snippet: string;
  liveUrl?: string;
  repoUrl?: string;
}

export const PORTFOLIO_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'vastra-ai',
    title: 'VastraAI (Nexora Fashion)',
    tagline: 'Multimodal Fashion Search & Vector Retrieval Engine',
    domain: 'AI & Full-Stack',
    stack: ['Next.js 15', 'React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'pgvector', 'Prisma ORM', 'OpenCLIP'],
    summary:
      'AI-powered fashion e-commerce platform combining natural-language search, visual similarity matching, and high-throughput vector indexing.',
    problem:
      'Keyword-only catalog search misses visual style attributes and vibe-based queries across tens of thousands of fashion items.',
    architecture: [
      'Encoded garment images and text prompts into shared 512-d OpenCLIP embeddings via async FastAPI workers.',
      'Deduplicated catalog entries (removing 3,244 duplicate records) and indexed 26,756 validated records in PostgreSQL with pgvector.',
      'Served low-latency similarity queries and storefront state via Next.js 15 and Prisma ORM.',
    ],
    metrics: [
      { label: 'Validated Records', value: '26,756' },
      { label: 'Duplicates Pruned', value: '3,244' },
      { label: 'Embedding Space', value: '512-d Cosine' },
    ],
    snippet: `SELECT id, title, 1 - (embedding <=> $1::vector) AS similarity
FROM fashion_items
WHERE 1 - (embedding <=> $1::vector) >= $2
ORDER BY embedding <=> $1::vector
LIMIT 12;`,
  },
  {
    id: 'devpulse',
    title: 'DevPulse',
    tagline: 'Full-Stack Developer Productivity & Activity Dashboard',
    domain: 'Full-Stack Web',
    stack: ['React.js', 'Redux Toolkit Query', 'Node.js', 'Express.js', 'MongoDB Atlas', 'JWT Auth'],
    summary:
      'Developer analytics and workflow dashboard with cached API queries, role-protected sessions, and real-time progress telemetry.',
    problem:
      'Developers switching across repositories and task streams often lack a unified, fast view of momentum without sluggish client refetches.',
    architecture: [
      'Built normalized client caching and invalidation tags with Redux Toolkit Query in React.js.',
      'Implemented JWT authentication and RESTful aggregation endpoints with Node.js and Express.js.',
      'Persisted user workspaces, milestones, and activity logs in MongoDB Atlas.',
    ],
    metrics: [
      { label: 'State & Cache', value: 'RTK Query' },
      { label: 'Auth Layer', value: 'JWT RBAC' },
      { label: 'Database', value: 'MongoDB Atlas' },
    ],
    snippet: `export const devPulseApi = createApi({
  reducerPath: 'devPulseApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Activity', 'Sprint'],
  endpoints: (builder) => ({
    getPulseSummary: builder.query<PulseSummary, string>({
      query: (range) => \`/pulse?range=\${range}\`,
      providesTags: ['Activity'],
    }),
  }),
});`,
  },
  {
    id: 'hotel-system',
    title: 'Hotel Management System',
    tagline: 'Room Tracking, Pre-Bookings & Dynamic Billing Engine',
    domain: 'Full-Stack Web',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma ORM'],
    summary:
      'End-to-end hospitality management web application covering live room availability, advance reservations, guest records, and automated invoicing.',
    problem:
      'Manual room status updates and spreadsheet billing cause double-bookings and calculation errors during peak check-in windows.',
    architecture: [
      'Modeled rooms, bookings, guests, and line-item charges with relational integrity in PostgreSQL and Prisma.',
      'Automated stay duration, tax/service rules, and dynamic invoice generation on booking settlement.',
    ],
    metrics: [
      { label: 'Room State', value: 'Real-Time' },
      { label: 'Billing', value: 'Auto-Invoice' },
      { label: 'Workflow', value: 'End-to-End' },
    ],
    snippet: `const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000));
const subtotal = nights * room.nightlyRate;
const totalAmount = Number((subtotal * (1 + taxRate)).toFixed(2));`,
  },
  {
    id: 'kumbharan-village',
    title: 'Kumbharan Village Platform',
    tagline: 'Terracotta Pottery Heritage & Artisan Showcase',
    domain: 'Frontend & Craft',
    stack: ['Next.js', 'React', 'TypeScript', 'CSS Modules', 'Motion'],
    summary:
      'Editorial web platform celebrating traditional terracotta pottery heritage and artisan collections from Aruvakode in Malappuram district, Kerala.',
    problem:
      'Traditional artisan craft stories often get lost in generic templates instead of feeling tactile, cultural, and easy to explore.',
    architecture: [
      'Crafted custom CSS Module visual tokens and responsive layouts tailored to artisan stories and collections.',
      'Structured browsable heritage sections and collection spotlights with smooth motion transitions.',
    ],
    metrics: [
      { label: 'Focus', value: 'Artisan Heritage' },
      { label: 'Styling', value: 'CSS Modules' },
      { label: 'Location', value: 'Malappuram, Kerala' },
    ],
    snippet: `.artisanShowcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}`,
  },
];

interface CaseStudyDrawerProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export function CaseStudyDrawer({ project, onClose, onNotify }: CaseStudyDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'code'>('overview');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    setActiveTab('overview');
    setCopiedSnippet(false);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  const handleCopySnippet = () => {
    if (!project) return;
    navigator.clipboard?.writeText(project.snippet);
    setCopiedSnippet(true);
    onNotify(`Copied ${project.title} snippet`);
    setTimeout(() => setCopiedSnippet(false), 1800);
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            background: 'rgba(2, 5, 14, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`${project.title} case study`}
            style={{
              width: '100%',
              maxWidth: '580px',
              height: '100%',
              overflowY: 'auto',
              padding: '28px 24px',
              background: 'var(--surface-card)',
              borderLeft: '1px solid var(--border-bright)',
              color: 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.7rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}
                >
                  CASE_STUDY // {project.domain.toUpperCase()}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>
                  {project.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                  {project.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study drawer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-hairline)',
                  background: 'var(--surface-pill)',
                  color: 'var(--text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.68rem',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border-hairline)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border-hairline)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {m.value}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-hairline)',
                  background: activeTab === 'overview' ? 'var(--surface-hover)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                <Layers size={13} />
                <span>01 // Architecture</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-hairline)',
                  background: activeTab === 'code' ? 'var(--surface-hover)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                <Cpu size={13} />
                <span>02 // Implementation</span>
              </button>
            </div>

            {activeTab === 'overview' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.74rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                    PROBLEM STATEMENT
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {project.problem}
                  </p>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.74rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                    SYSTEM DESIGN HIGHLIGHTS
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    {project.architecture.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    CORE_SNIPPET
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 11px',
                      borderRadius: '999px',
                      border: '1px solid var(--border-hairline)',
                      background: 'var(--surface-pill)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(2, 6, 17, 0.85)',
                    border: '1px solid var(--border-hairline)',
                    color: '#e2e8f0',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.75rem',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                  }}
                >
                  <code>{project.snippet}</code>
                </pre>
              </div>
            )}

            {(project.liveUrl || project.repoUrl) && (
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 18px',
                      borderRadius: '999px',
                      background: 'var(--cta-gradient)',
                      color: 'var(--cta-text)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}