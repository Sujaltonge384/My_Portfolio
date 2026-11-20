'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cpu, Magnet, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { MaskedText } from '@/components/motion/MaskedText';
import styles from './TechBento.module.css';

export type TechCategoryId =
  | 'all'
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'ai-ml'
  | 'languages'
  | 'devops';

interface TechBubbleSpec {
  id: string;
  name: string;
  category: Exclude<TechCategoryId, 'all'>;
  categoryLabel: string;
  color: string;
  glow: string;
  radius: number;
  detail: string;
}

interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  freq: number;
}

const CATEGORY_FILTERS: { id: TechCategoryId; label: string; color: string }[] = [
  { id: 'all', label: 'All Stack', color: '#00F0FF' },
  { id: 'frontend', label: 'Frontend', color: '#00F0FF' },
  { id: 'backend', label: 'Backend & API', color: '#10B981' },
  { id: 'databases', label: 'Databases', color: '#38BDF8' },
  { id: 'ai-ml', label: 'AI / ML', color: '#A78BFA' },
  { id: 'languages', label: 'Languages', color: '#F59E0B' },
  { id: 'devops', label: 'Cloud & DevOps', color: '#34D399' },
];

const TECH_BUBBLES: TechBubbleSpec[] = [
  // Frontend (#00F0FF)
  {
    id: 'react',
    name: 'React.js',
    category: 'frontend',
    categoryLabel: 'Frontend',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.5)',
    radius: 42,
    detail: 'Concurrent UI architecture, custom hooks & 60fps component trees.',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    categoryLabel: 'Frontend',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.5)',
    radius: 44,
    detail: 'App Router, SSR/ISR pipelines & full-stack edge storefronts.',
  },
  {
    id: 'redux',
    name: 'Redux Toolkit',
    category: 'frontend',
    categoryLabel: 'Frontend',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.45)',
    radius: 35,
    detail: 'Normalized client state & RTK Query tag-invalidated caching.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    categoryLabel: 'Frontend',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.45)',
    radius: 34,
    detail: 'Rapid utility design tokens & responsive layout systems.',
  },
  {
    id: 'html5',
    name: 'HTML5 & CSS3',
    category: 'frontend',
    categoryLabel: 'Frontend',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.42)',
    radius: 33,
    detail: 'Semantic accessibility, CSS Modules & GPU-accelerated animations.',
  },

  // Backend & API (#10B981)
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    categoryLabel: 'Backend & API',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.5)',
    radius: 42,
    detail: 'Event-driven non-blocking I/O runtimes & scalable microservices.',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    categoryLabel: 'Backend & API',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.52)',
    radius: 42,
    detail: 'Async Python AI inference endpoints & OpenAPI schema validation.',
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'backend',
    categoryLabel: 'Backend & API',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.45)',
    radius: 36,
    detail: 'Modular REST middleware, RBAC guards & GitHub OAuth pipelines.',
  },
  {
    id: 'jwt',
    name: 'JWT & REST APIs',
    category: 'backend',
    categoryLabel: 'Backend & API',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.42)',
    radius: 33,
    detail: 'Stateless token auth, AES secret encryption & rate-limited endpoints.',
  },

  // Databases & Vector Stores (#38BDF8)
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'databases',
    categoryLabel: 'Databases',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.5)',
    radius: 42,
    detail: 'ACID relational modeling, composite indexes & transactional integrity.',
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    category: 'databases',
    categoryLabel: 'Databases',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.52)',
    radius: 38,
    detail: '512-d cosine similarity retrieval across 26,756+ fashion embeddings.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    category: 'databases',
    categoryLabel: 'Databases',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.48)',
    radius: 39,
    detail: 'Aggregation pipelines, flexible workspace schemas & cloud clusters.',
  },
  {
    id: 'prisma',
    name: 'Prisma ORM',
    category: 'databases',
    categoryLabel: 'Databases',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.44)',
    radius: 34,
    detail: 'Type-safe database migrations, query builders & relational joins.',
  },

  // AI / ML Systems (#A78BFA)
  {
    id: 'openclip',
    name: 'OpenCLIP',
    category: 'ai-ml',
    categoryLabel: 'AI / ML',
    color: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.54)',
    radius: 43,
    detail: 'Multimodal vision-language embeddings for visual product search.',
  },
  {
    id: 'embeddings',
    name: 'Vector Similarity',
    category: 'ai-ml',
    categoryLabel: 'AI / ML',
    color: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.48)',
    radius: 37,
    detail: 'High-dimensional nearest-neighbor ranking & semantic deduplication.',
  },
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'ai-ml',
    categoryLabel: 'AI / ML',
    color: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.48)',
    radius: 38,
    detail: 'Gemini NL query parsing, AI Outfit Finder & voice commerce flows.',
  },

  // Core Languages (#F59E0B)
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'languages',
    categoryLabel: 'Languages',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
    radius: 41,
    detail: 'Strict end-to-end static typing across frontend & API contracts.',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'languages',
    categoryLabel: 'Languages',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
    radius: 41,
    detail: 'FastAPI services, dataset cleaning pipelines & ML inference.',
  },
  {
    id: 'javascript',
    name: 'JavaScript ES6+',
    category: 'languages',
    categoryLabel: 'Languages',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.45)',
    radius: 36,
    detail: 'Async/await concurrency, Web Speech API & DOM performance.',
  },
  {
    id: 'cpp',
    name: 'C++ & Java',
    category: 'languages',
    categoryLabel: 'Languages',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.42)',
    radius: 34,
    detail: '300+ DSA problems solved on LeetCode, CodeChef & HackerRank.',
  },

  // Cloud & DevOps (#34D399)
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'devops',
    categoryLabel: 'Cloud & DevOps',
    color: '#34D399',
    glow: 'rgba(52, 211, 153, 0.48)',
    radius: 38,
    detail: 'Branch workflows, PR automation & GitHub REST/OAuth integrations.',
  },
  {
    id: 'vercel',
    name: 'Vercel & Netlify',
    category: 'devops',
    categoryLabel: 'Cloud & DevOps',
    color: '#34D399',
    glow: 'rgba(52, 211, 153, 0.46)',
    radius: 37,
    detail: 'Zero-downtime edge CDN previews & 93+ Lighthouse builds.',
  },
  {
    id: 'postman',
    name: 'Postman & Render',
    category: 'devops',
    categoryLabel: 'Cloud & DevOps',
    color: '#34D399',
    glow: 'rgba(52, 211, 153, 0.42)',
    radius: 33,
    detail: 'Automated API test collections & containerized backend hosting.',
  },
];

function TechBrandIcon({ id, color, size }: { id: string; color: string; size: number }) {
  const stroke = color;
  switch (id) {
    case 'react':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="2.2" fill={stroke} />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke={stroke} strokeWidth="1.6" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(60 12 12)"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(120 12 12)"
            stroke={stroke}
            strokeWidth="1.6"
          />
        </svg>
      );
    case 'nextjs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke={stroke} strokeWidth="1.6" />
          <path d="M8.5 16V8L16.5 18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15.5 8V13" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'redux':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4.5C15.5 4.5 18 7 18 10.2C18 12.8 16.2 14.8 13.8 15.3"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M17.5 16.5C15.5 19 12 19.5 9.2 17.8C7 16.4 6 13.8 6.8 11.4"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M6.2 14.2C4.8 11.4 5.8 7.8 8.6 6.2C10.8 4.9 13.5 5.2 15.2 6.8"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2" fill={stroke} />
        </svg>
      );
    case 'tailwind':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10.5C7.8 7.8 9.6 6.5 12.2 6.5C15.6 6.5 16.2 9 18 9.5C19.3 9.8 20.4 9.3 21.2 8.2C20.4 10.9 18.6 12.2 16 12.2C12.6 12.2 12 9.7 10.2 9.2C8.9 8.9 7.8 9.4 7 10.5Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M3 16.2C3.8 13.5 5.6 12.2 8.2 12.2C11.6 12.2 12.2 14.7 14 15.2C15.3 15.5 16.4 15 17.2 13.9C16.4 16.6 14.6 17.9 12 17.9C8.6 17.9 8 15.4 6.2 14.9C4.9 14.6 3.8 15.1 3 16.2Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'html5':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 3.5H19.5L18.1 18.5L12 20.5L5.9 18.5L4.5 3.5Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 7.5H8.5L8.9 11.5H15.1L14.6 15.5L12 16.3L9.4 15.5L9.2 13.8"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'nodejs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.8L20 7.4V16.6L12 21.2L4 16.6V7.4L12 2.8Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 14.8V9.2L14.5 14.8V9.2"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'fastapi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.2" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M13 6.2L8.2 13H12L11 17.8L15.8 11H12L13 6.2Z"
            fill={stroke}
            fillOpacity="0.25"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'express':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 9H11M4 12H9.5M4 15H11"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M13.5 9L19.5 15M19.5 9L13.5 15"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'jwt':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3V21M3 12H21M5.6 5.6L18.4 18.4M18.4 5.6L5.6 18.4"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" fill="#0A0D14" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="6.5" rx="7.5" ry="3.2" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M4.5 6.5V12C4.5 13.8 7.9 15.2 12 15.2C16.1 15.2 19.5 13.8 19.5 12V6.5"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <path
            d="M4.5 12V17.5C4.5 19.3 7.9 20.7 12 20.7C16.1 20.7 19.5 19.3 19.5 17.5V12"
            stroke={stroke}
            strokeWidth="1.6"
          />
        </svg>
      );
    case 'pgvector':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L19.8 7.5V16.5L12 21L4.2 16.5V7.5L12 3Z"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <path
            d="M12 12L19.8 7.5M12 12V21M12 12L4.2 7.5"
            stroke={stroke}
            strokeWidth="1.4"
            strokeDasharray="2 2"
          />
          <circle cx="12" cy="12" r="2.2" fill={stroke} />
        </svg>
      );
    case 'mongodb':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C12 3 17.2 7.8 17.2 13.2C17.2 16.8 14.6 19.2 12 20.4C9.4 19.2 6.8 16.8 6.8 13.2C6.8 7.8 12 3 12 3Z"
            fill={stroke}
            fillOpacity="0.18"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12 6.5V21.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'prisma':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12.6 3.4L19.6 16.2L10.8 20.6L4.4 15.2L12.6 3.4Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12.6 3.4L10.8 20.6" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'openclip':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="7" r="2.2" stroke={stroke} strokeWidth="1.6" />
          <circle cx="6" cy="17" r="2.2" stroke={stroke} strokeWidth="1.6" />
          <circle cx="18" cy="7" r="2.2" stroke={stroke} strokeWidth="1.6" />
          <circle cx="18" cy="17" r="2.2" stroke={stroke} strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.6" fill={stroke} />
          <path
            d="M7.8 8.2L10.2 10.4M7.8 15.8L10.2 13.6M16.2 8.2L13.8 10.4M16.2 15.8L13.8 13.6"
            stroke={stroke}
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'embeddings':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke={stroke} strokeWidth="1.7" />
          <path d="M16 16L20.5 20.5" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="9.5" cy="9.5" r="1.2" fill={stroke} />
          <circle cx="13" cy="10.5" r="1.2" fill={stroke} />
          <circle cx="10.8" cy="13.2" r="1.2" fill={stroke} />
        </svg>
      );
    case 'genai':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L13.9 8.6L19.5 10.5L13.9 12.4L12 18L10.1 12.4L4.5 10.5L10.1 8.6L12 3Z"
            fill={stroke}
            fillOpacity="0.22"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M18.5 15.5L19.2 17.5L21.2 18.2L19.2 18.9L18.5 20.9L17.8 18.9L15.8 18.2L17.8 17.5L18.5 15.5Z"
            fill={stroke}
          />
        </svg>
      );
    case 'typescript':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" stroke={stroke} strokeWidth="1.7" />
          <path
            d="M7 10H12.2M9.6 10V16.5"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M17.2 11.2C16.7 10.4 15.8 10 14.9 10C13.8 10 13.1 10.7 13.1 11.6C13.1 13.5 17.3 12.9 17.3 14.9C17.3 15.9 16.4 16.6 15.1 16.6C14 16.6 13.2 16.1 12.8 15.4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'python':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M11.8 3.5H9.2C7.4 3.5 6.5 4.4 6.5 6.2V8.5H12V9.5H5.8C4.2 9.5 3.5 10.5 3.5 12.2V14.2C3.5 15.8 4.4 16.8 6 16.8H7.5V14.5C7.5 12.8 8.6 11.8 10.3 11.8H14.5C15.8 11.8 16.8 10.8 16.8 9.5V6.2C16.8 4.4 15.6 3.5 13.8 3.5H11.8Z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12.2 20.5H14.8C16.6 20.5 17.5 19.6 17.5 17.8V15.5H12V14.5H18.2C19.8 14.5 20.5 13.5 20.5 11.8V9.8C20.5 8.2 19.6 7.2 18 7.2H16.5V9.5C16.5 11.2 15.4 12.2 13.7 12.2H9.5C8.2 12.2 7.2 13.2 7.2 14.5V17.8C7.2 19.6 8.4 20.5 10.2 20.5H12.2Z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="9.2" cy="6" r="0.9" fill={stroke} />
          <circle cx="14.8" cy="18" r="0.9" fill={stroke} />
        </svg>
      );
    case 'javascript':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" stroke={stroke} strokeWidth="1.7" />
          <path
            d="M10.2 10V14.8C10.2 16 9.4 16.7 8.3 16.7C7.5 16.7 6.9 16.3 6.6 15.7"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M17.2 11.2C16.7 10.4 15.8 10 14.9 10C13.8 10 13.1 10.7 13.1 11.6C13.1 13.5 17.3 12.9 17.3 14.9C17.3 15.9 16.4 16.6 15.1 16.6C14 16.6 13.2 16.1 12.8 15.4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'cpp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M10.5 8.5C9.6 7.5 8.4 7 7.1 7C4.7 7 3 8.9 3 12C3 15.1 4.7 17 7.1 17C8.4 17 9.6 16.5 10.5 15.5"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M14 9.5V14.5M11.5 12H16.5M19.5 9.5V14.5M17 12H22"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'git':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="7" cy="6" r="2.2" stroke={stroke} strokeWidth="1.7" />
          <circle cx="7" cy="18" r="2.2" stroke={stroke} strokeWidth="1.7" />
          <circle cx="17" cy="9" r="2.2" stroke={stroke} strokeWidth="1.7" />
          <path d="M7 8.2V15.8" stroke={stroke} strokeWidth="1.7" />
          <path
            d="M17 11.2C17 14 14.5 15 11.5 15H7"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'vercel':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4.5L20.5 19H3.5L12 4.5Z"
            fill={stroke}
            fillOpacity="0.22"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'postman':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.8" stroke={stroke} strokeWidth="1.7" />
          <path
            d="M9 15L15.5 8.5M15.5 8.5H11M15.5 8.5V13"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function TechBento() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorFieldRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<TechCategoryId>('all');
  const [cursorMode, setCursorMode] = useState<'repel' | 'attract'>('repel');
  const [calmMode, setCalmMode] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechBubbleSpec>(TECH_BUBBLES[0]);
  const [flipTopIds, setFlipTopIds] = useState<Record<string, boolean>>({});

  // Mutable simulation state stored in refs for 60-120fps GPU transforms without React re-renders
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const boundsRef = useRef({ width: 1120, height: 620 });
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    active: false,
  });
  const dragRef = useRef<{
    index: number | null;
    offsetX: number;
    offsetY: number;
    lastX: number;
    lastY: number;
    lastTime: number;
  }>({
    index: null,
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  });

  const hoveredIdRef = useRef<string | null>(null);
  hoveredIdRef.current = hoveredId;

  const activeFilterRef = useRef<TechCategoryId>('all');
  activeFilterRef.current = activeFilter;

  const cursorModeRef = useRef<'repel' | 'attract'>('repel');
  cursorModeRef.current = cursorMode;

  const calmModeRef = useRef<boolean>(false);
  calmModeRef.current = calmMode;

  const initializeBodies = useCallback((width: number, height: number) => {
    const isMobile = width < 680;
    const scale = isMobile ? 0.74 : width < 960 ? 0.88 : 1;
    const cols = isMobile ? 4 : 6;
    const rows = Math.ceil(TECH_BUBBLES.length / cols);
    const padX = 64 * scale;
    const padY = 68;
    const usableW = Math.max(240, width - padX * 2);
    const usableH = Math.max(260, height - padY * 2 - 24);

    bodiesRef.current = TECH_BUBBLES.map((spec, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const r = Math.round(spec.radius * scale);
      const jitterX = (((idx * 37) % 29) - 14) * 1.4;
      const jitterY = (((idx * 53) % 23) - 11) * 1.3;
      const x = padX + ((col + 0.5) / cols) * usableW + jitterX;
      const y = padY + ((row + 0.5) / rows) * usableH + jitterY;
      const angle = (idx * 1.37) % (Math.PI * 2);
      const speed = 0.45 + (idx % 4) * 0.14;

      return {
        id: spec.id,
        x: Math.max(r + 12, Math.min(width - r - 12, x)),
        y: Math.max(r + 16, Math.min(height - r - 38, y)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: r,
        phase: idx * 0.85,
        freq: 0.0012 + (idx % 5) * 0.00022,
      };
    });
  }, []);

  // Initialize arena dimensions & ResizeObserver
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    boundsRef.current = { width: rect.width || 1120, height: rect.height || 620 };
    initializeBodies(boundsRef.current.width, boundsRef.current.height);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          const prevW = boundsRef.current.width;
          const prevH = boundsRef.current.height;
          boundsRef.current = { width: w, height: h };
          const isMobile = w < 680;
          const scale = isMobile ? 0.74 : w < 960 ? 0.88 : 1;

          bodiesRef.current.forEach((b, i) => {
            b.radius = Math.round(TECH_BUBBLES[i].radius * scale);
            b.x = Math.max(b.radius + 10, Math.min(w - b.radius - 10, (b.x / prevW) * w));
            b.y = Math.max(b.radius + 14, Math.min(h - b.radius - 36, (b.y / prevH) * h));
          });
        }
      }
    });

    observer.observe(arena);
    return () => observer.disconnect();
  }, [initializeBodies]);

  // Main 60-120fps Physics & Collision Loop
  useEffect(() => {
    let rafId = 0;
    let lastTimestamp = performance.now();

    const step = (now: number) => {
      const dt = Math.min(2.0, (now - lastTimestamp) / 16.667);
      lastTimestamp = now;

      const { width, height } = boundsRef.current;
      const bodies = bodiesRef.current;
      const ptr = pointerRef.current;
      const dragIdx = dragRef.current.index;
      const currentFilter = activeFilterRef.current;
      const mode = cursorModeRef.current;
      const isCalm = calmModeRef.current;

      const topPad = 42;
      const bottomPad = 44;
      const sidePad = 14;
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      // 1. Apply ambient buoyancy, cursor force field, category gravity wells & damping
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const spec = TECH_BUBBLES[i];

        if (dragIdx === i) {
          continue;
        }

        const isHovered = hoveredIdRef.current === b.id;

        if (isHovered) {
          // Gently brake hovered bubble so user can inspect & read tooltip effortlessly
          b.vx *= Math.pow(0.82, dt);
          b.vy *= Math.pow(0.82, dt);
        } else {
          // Zero-gravity sinusoidal buoyancy current
          const driftScale = isCalm ? 0.008 : 0.018;
          b.vx += Math.cos(now * b.freq + b.phase) * driftScale * dt;
          b.vy += Math.sin(now * (b.freq * 1.15) + b.phase) * driftScale * dt;

          // Category filter magnetic attractor / outer orbit separator
          if (currentFilter !== 'all') {
            const dxC = centerX - b.x;
            const dyC = centerY - b.y;
            const distC = Math.hypot(dxC, dyC) || 1;
            if (spec.category === currentFilter) {
              // Pull matching bubbles smoothly into central constellation
              if (distC > 95) {
                b.vx += (dxC / distC) * 0.14 * dt;
                b.vy += (dyC / distC) * 0.14 * dt;
              }
            } else {
              // Push non-matching bubbles gently toward outer perimeter
              if (distC < Math.min(width, height) * 0.42) {
                b.vx -= (dxC / distC) * 0.12 * dt;
                b.vy -= (dyC / distC) * 0.12 * dt;
              }
            }
          }

          // Cursor force-field (Repel or Magnet Pull)
          if (ptr.active) {
            const dx = b.x - ptr.x;
            const dy = b.y - ptr.y;
            const dist = Math.hypot(dx, dy);
            const fieldRadius = b.radius + 125;

            if (dist > 1 && dist < fieldRadius) {
              const strength = (1 - dist / fieldRadius) * (isCalm ? 0.35 : 0.68);
              const nx = dx / dist;
              const ny = dy / dist;

              if (mode === 'repel') {
                b.vx += (nx * strength + ptr.vx * 0.025 * strength) * dt;
                b.vy += (ny * strength + ptr.vy * 0.025 * strength) * dt;
              } else {
                // Orbit/attract toward pointer without collapsing onto center
                if (dist > b.radius + 36) {
                  b.vx -= nx * strength * 0.72 * dt;
                  b.vy -= ny * strength * 0.72 * dt;
                }
                // Tangential swirl
                b.vx += -ny * strength * 0.28 * dt;
                b.vy += nx * strength * 0.28 * dt;
              }
            }
          }
        }

        // Velocity cap & viscous fluid drag
        const maxSpeed = isCalm ? 2.4 : 6.2;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        }

        const damping = isCalm ? 0.978 : 0.991;
        b.vx *= Math.pow(damping, dt);
        b.vy *= Math.pow(damping, dt);

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Elastic Chamber Wall Collisions
        const minX = sidePad + b.radius;
        const maxX = width - sidePad - b.radius;
        const minY = topPad + b.radius;
        const maxY = height - bottomPad - b.radius;
        const wallRestitution = 0.84;

        if (b.x < minX) {
          b.x = minX;
          b.vx = Math.abs(b.vx) * wallRestitution;
        } else if (b.x > maxX) {
          b.x = maxX;
          b.vx = -Math.abs(b.vx) * wallRestitution;
        }

        if (b.y < minY) {
          b.y = minY;
          b.vy = Math.abs(b.vy) * wallRestitution;
        } else if (b.y > maxY) {
          b.y = maxY;
          b.vy = -Math.abs(b.vy) * wallRestitution;
        }
      }

      // 2. Pairwise Elastic Bubble-to-Bubble Collisions
      const restitution = 0.86;
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius + 6;

          if (dist > 0.001 && dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            const massA = a.radius * a.radius;
            const massB = b.radius * b.radius;
            const totalMass = massA + massB;

            // Positional separation so bubbles never overlap
            if (dragIdx !== i && dragIdx !== j) {
              a.x -= nx * overlap * (massB / totalMass);
              a.y -= ny * overlap * (massB / totalMass);
              b.x += nx * overlap * (massA / totalMass);
              b.y += ny * overlap * (massA / totalMass);
            } else if (dragIdx === i) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            } else if (dragIdx === j) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }

            // Relative velocity impulse along collision normal
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal < 0) {
              const impulse = (-(1 + restitution) * velAlongNormal) / (1 / massA + 1 / massB);
              const impulseX = impulse * nx;
              const impulseY = impulse * ny;

              if (dragIdx !== i) {
                a.vx -= impulseX / massA;
                a.vy -= impulseY / massA;
              }
              if (dragIdx !== j) {
                b.vx += impulseX / massB;
                b.vy += impulseY / massB;
              }
            }
          }
        }
      }

      // 3. Commit GPU transforms directly to DOM nodes
      for (let i = 0; i < bodies.length; i++) {
        const el = nodeRefs.current[i];
        const b = bodies[i];
        if (el) {
          const tx = b.x - b.radius;
          const ty = b.y - b.radius;
          el.style.width = `${b.radius * 2}px`;
          el.style.height = `${b.radius * 2}px`;
          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        }
      }

      // Decay pointer velocity smoothly
      ptr.vx *= 0.85;
      ptr.vy *= 0.85;

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Arena Pointer Tracking (Cursor Force Field + Dragging)
  const handleArenaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ptr = pointerRef.current;
    if (ptr.active) {
      ptr.vx = x - ptr.x;
      ptr.vy = y - ptr.y;
    }
    ptr.x = x;
    ptr.y = y;
    ptr.active = true;

    if (cursorFieldRef.current) {
      cursorFieldRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      cursorFieldRef.current.classList.add(styles.cursorFieldVisible);
    }

    // Handle active bubble drag
    const drag = dragRef.current;
    if (drag.index !== null && bodiesRef.current[drag.index]) {
      const b = bodiesRef.current[drag.index];
      const { width, height } = boundsRef.current;
      const now = performance.now();
      const elapsed = Math.max(8, now - drag.lastTime);

      const nextX = Math.max(b.radius + 12, Math.min(width - b.radius - 12, x - drag.offsetX));
      const nextY = Math.max(b.radius + 36, Math.min(height - b.radius - 40, y - drag.offsetY));

      b.vx = ((nextX - drag.lastX) / elapsed) * 16.67;
      b.vy = ((nextY - drag.lastY) / elapsed) * 16.67;
      b.x = nextX;
      b.y = nextY;

      drag.lastX = nextX;
      drag.lastY = nextY;
      drag.lastTime = now;
    }
  };

  const handleArenaPointerLeave = () => {
    pointerRef.current.active = false;
    dragRef.current.index = null;
    setHoveredId(null);
    if (cursorFieldRef.current) {
      cursorFieldRef.current.classList.remove(styles.cursorFieldVisible);
    }
  };

  const handleBubblePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    index: number,
    spec: TechBubbleSpec
  ) => {
    e.stopPropagation();
    const arena = arenaRef.current;
    const b = bodiesRef.current[index];
    if (!arena || !b) return;

    const rect = arena.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    dragRef.current = {
      index,
      offsetX: px - b.x,
      offsetY: py - b.y,
      lastX: b.x,
      lastY: b.y,
      lastTime: performance.now(),
    };
    b.vx = 0;
    b.vy = 0;
    setSelectedTech(spec);
    setHoveredId(spec.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleBubblePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.index !== null) {
      dragRef.current.index = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture already released
      }
    }
  };

  const handleBubbleEnter = (index: number, spec: TechBubbleSpec) => {
    setHoveredId(spec.id);
    setSelectedTech(spec);
    const b = bodiesRef.current[index];
    if (b) {
      setFlipTopIds((prev) => ({
        ...prev,
        [spec.id]: b.y < 145,
      }));
    }
  };

  // Radial Kinetic Shockwave Button
  const triggerScatterImpulse = () => {
    const { width, height } = boundsRef.current;
    const cx = width * 0.5;
    const cy = height * 0.48;

    bodiesRef.current.forEach((b, idx) => {
      const dx = b.x - cx;
      const dy = b.y - cy;
      const angle = Math.hypot(dx, dy) > 10 ? Math.atan2(dy, dx) : (idx * 2.1) % (Math.PI * 2);
      const boost = 4.6 + (idx % 3) * 1.1;
      b.vx = Math.cos(angle) * boost;
      b.vy = Math.sin(angle) * boost;
    });
  };

  const resetFormation = () => {
    setActiveFilter('all');
    initializeBodies(boundsRef.current.width, boundsRef.current.height);
  };

  const matchingCount = useMemo(() => {
    if (activeFilter === 'all') return TECH_BUBBLES.length;
    return TECH_BUBBLES.filter((t) => t.category === activeFilter).length;
  }, [activeFilter]);

  return (
    <section id="stack" className={styles.section} aria-label="Technical Stack">
      <div className="sectionShell">
        <div className={styles.header}>
          <span className="eyebrowTag" style={{ width: 'fit-content' }}>
            <Cpu size={13} />
            TECHNICAL ARSENAL // INTERACTIVE NEON PHYSICS CHAMBER
          </span>
          <MaskedText
            text="Full-Stack & AI Engineering Stack"
            as="h2"
            className="sectionHeading"
          />
          <p className="sectionLead">
            Hover any floating neon orb to inspect the technology, drag and fling bubbles across
            the zero-gravity chamber, or filter by domain to cluster matching systems.
          </p>
        </div>

        {/* Category Filter & Physics Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.filterGroup} role="tablist" aria-label="Filter tech stack">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                  style={
                    isActive
                      ? {
                          backgroundColor: cat.color,
                          boxShadow: `0 0 22px ${cat.color}66`,
                        }
                      : undefined
                  }
                  onClick={() => setActiveFilter(cat.id)}
                >
                  <span
                    className={styles.pillDot}
                    style={{ backgroundColor: isActive ? '#07080B' : cat.color }}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className={styles.actionGroup}>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={() => setCursorMode((m) => (m === 'repel' ? 'attract' : 'repel'))}
              title="Switch cursor physics field between Repel and Magnet Orbit"
            >
              <Magnet size={13} />
              {cursorMode === 'repel' ? 'Cursor: Repel' : 'Cursor: Magnet'}
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={() => setCalmMode((c) => !c)}
              title="Toggle Zero-G drift speed"
            >
              <Sparkles size={13} />
              {calmMode ? 'Zero-G: Calm' : 'Zero-G: Live'}
            </button>

            <button
              type="button"
              className={styles.actionBtn}
              onClick={triggerScatterImpulse}
              title="Inject kinetic shockwave impulse"
            >
              <Zap size={13} />
              Scatter
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={resetFormation}
              aria-label="Reset bubble positions"
              title="Reset bubble positions"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Zero-Gravity Neon Bubble Physics Arena */}
        <div
          ref={arenaRef}
          className={styles.arena}
          onPointerMove={handleArenaPointerMove}
          onPointerLeave={handleArenaPointerLeave}
        >
          <div className={styles.arenaGrid} />

          {/* Cursor Force-Field Halo */}
          <div
            ref={cursorFieldRef}
            className={`${styles.cursorField} ${
              cursorMode === 'attract' ? styles.cursorFieldAttract : ''
            }`}
          />

          {/* Top Telemetry Overlays */}
          <div className={styles.hudTopLeft}>
            <span className={styles.livePulse} />
            <span>
              PHYSICS_SOLVER // {matchingCount} ACTIVE ORBS ({cursorMode.toUpperCase()}_FIELD)
            </span>
          </div>

          <div className={styles.hudTopRight}>
            <span>ELASTIC_COLLISIONS: ON • DRAG & FLING ENABLED</span>
          </div>

          {/* Floating Neon Tech Bubbles */}
          {TECH_BUBBLES.map((spec, idx) => {
            const isHovered = hoveredId === spec.id;
            const isDimmed = activeFilter !== 'all' && spec.category !== activeFilter;
            const flipBottom = Boolean(flipTopIds[spec.id]);

            return (
              <div
                key={spec.id}
                ref={(el) => {
                  nodeRefs.current[idx] = el;
                }}
                className={`${styles.bubbleNode} ${
                  isHovered ? styles.bubbleNodeHovered : ''
                } ${isDimmed ? styles.bubbleNodeDimmed : ''}`}
                style={
                  {
                    '--bubble-color': spec.color,
                    '--bubble-glow': spec.glow,
                    width: `${spec.radius * 2}px`,
                    height: `${spec.radius * 2}px`,
                  } as React.CSSProperties
                }
                onPointerEnter={() => handleBubbleEnter(idx, spec)}
                onPointerLeave={() => {
                  if (dragRef.current.index === null) {
                    setHoveredId((prev) => (prev === spec.id ? null : prev));
                  }
                }}
                onPointerDown={(e) => handleBubblePointerDown(e, idx, spec)}
                onPointerUp={handleBubblePointerUp}
                role="button"
                tabIndex={0}
                aria-label={`${spec.name} (${spec.categoryLabel}): ${spec.detail}`}
                onFocus={() => handleBubbleEnter(idx, spec)}
                onBlur={() => setHoveredId(null)}
              >
                <div className={styles.bubbleOrbit} />

                <div className={styles.bubbleSphere}>
                  <div className={styles.iconWrap}>
                    <TechBrandIcon
                      id={spec.id}
                      color={spec.color}
                      size={Math.round(spec.radius * 0.86)}
                    />
                  </div>
                </div>

                {/* Neon Glass Hover Tooltip */}
                <div
                  className={`${styles.tooltip} ${
                    flipBottom ? styles.tooltipFlipBottom : ''
                  }`}
                >
                  <div className={styles.tooltipHeader}>
                    <span className={styles.tooltipName}>{spec.name}</span>
                    <span className={styles.tooltipTag}>{spec.categoryLabel}</span>
                  </div>
                  <p className={styles.tooltipDetail}>{spec.detail}</p>
                </div>
              </div>
            );
          })}

          {/* Bottom Chamber Guide */}
          <div className={styles.hudBottomBar}>
            <span>HOVER ORB TO INSPECT TECH NAME & ROLE</span>
            <span>GRAB & THROW FOR MOMENTUM RICOCHET</span>
          </div>
        </div>

        {/* Live Selected / Last Inspected Telemetry Bar */}
        <div className={styles.inspectorBar}>
          <div className={styles.inspectorLeft}>
            <span
              className={styles.inspectorBadge}
              style={{ backgroundColor: selectedTech.color }}
            >
              {selectedTech.categoryLabel.toUpperCase()}
            </span>
            <strong>{selectedTech.name}</strong>
            <span style={{ color: 'var(--text-secondary)' }}>— {selectedTech.detail}</span>
          </div>
          <span className={styles.inspectorHint}>
            Tip: Switch to Magnet mode or click Scatter ⚡ to test bubble collisions
          </span>
        </div>
      </div>
    </section>
  );
}