export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  period: string;
  themeColor: string;
  themeRgb: string;
  previewType: 'vector-scan' | 'kanban-live' | 'heritage-timeline';
  stack: string[];
  metrics: { label: string; value: string }[];
  summary: string;
  highlights: string[];
  architectureNotes: string;
  githubUrl: string;
  liveUrl: string;
}

export interface SkillCategory {
  id: string;
  code: string;
  title: string;
  description: string;
  accent: string;
  span: 'wide' | 'normal';
  skills: string[];
}

export interface TimelineMilestone {
  id: string;
  nodeCode: string;
  period: string;
  category: string;
  title: string;
  organization: string;
  location: string;
  metricBadge: string;
  metricValue: number;
  metricSuffix: string;
  description: string;
  bullets: string[];
}

export const PROFILE = {
  name: 'Sujal Tonge',
  fullName: 'Sujal Shrawan Tonge',
  monogram: 'ST.',
  role: 'Full Stack Software Developer',
  heroSubheadline: 'FULL-STACK & AI ARCHITECT',
  scrambleRoles: [
    'NEXT.JS • FASTAPI • PGVECTOR',
    'VECTOR SIMILARITY ENGINE',
    'SCALABLE REST & CLOUD APIS',
    'FULL-STACK & AI ARCHITECT',
  ],
  location: 'Nagpur, Maharashtra',
  availability: 'OPEN TO ROLES • NAGPUR',
  email: 'sujaltonge384@gmail.com',
  phone: '+91 9322375198',
  github: 'https://github.com/sujaltonge384',
  linkedin: 'https://linkedin.com/in/sujaltonge384',
  resumePath: '/resume/SUJAL_TONGE.pdf',
  summary:
    'Full Stack Developer with hands-on experience building and deploying scalable web applications using React.js, Next.js, Node.js, and Express.js. Skilled in REST API development, database management, AI integration, and performance optimization using PostgreSQL and MongoDB.',
};

export const HERO_TELEMETRY = [
  {
    id: 'dsa',
    value: '300+',
    label: 'DSA Problems Solved',
    detail: 'LeetCode • CodeChef • HackerRank',
    accent: '#00F0FF',
  },
  {
    id: 'vectors',
    value: '26,756',
    label: 'Validated AI Records',
    detail: '30,000-row dataset • 3,244 dupes filtered',
    accent: '#10B981',
  },
  {
    id: 'lighthouse',
    value: '93/100',
    label: 'Lighthouse Performance',
    detail: 'Lazy media & deferred video pipeline',
    accent: '#F59E0B',
  },
  {
    id: 'cloud',
    value: 'Cloud Arcade',
    label: 'Google Cloud Badges',
    detail: 'Hands-on cloud labs & LeetCode badges',
    accent: '#A78BFA',
  },
];

export const VECTOR_SANDBOX_PROMPTS = [
  {
    query: 'Minimalist structured charcoal blazer',
    topMatch: 'Tailored Wool-Blend Blazer — Charcoal',
    similarity: '0.964',
    modality: 'Gemini NL + OpenCLIP Vector',
    recordsSearched: '26,756 pgvector rows',
  },
  {
    query: 'Voice: "Show oversized monochrome streetwear"',
    topMatch: 'Heavyweight Boxy Drop-Shoulder Hoodie',
    similarity: '0.948',
    modality: 'Web Speech API -> FastAPI',
    recordsSearched: '26,756 pgvector rows',
  },
  {
    query: 'Visual upload: Terracotta handwoven kurta',
    topMatch: 'Artisan Aruvakode Terracotta Loom Kurta',
    similarity: '0.932',
    modality: 'Image Embedding Cosine Search',
    recordsSearched: '26,756 pgvector rows',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'vastra-ai',
    index: '01',
    title: 'VastraAI',
    subtitle: 'AI-Powered Fashion E-Commerce Platform',
    period: '2026',
    themeColor: '#00F0FF',
    themeRgb: '0, 240, 255',
    previewType: 'vector-scan',
    stack: ['Next.js', 'React', 'FastAPI', 'PostgreSQL', 'Prisma', 'pgvector', 'OpenCLIP'],
    metrics: [
      { label: 'Raw Dataset', value: '30,000 Rows' },
      { label: 'Validated Index', value: '26,756 Items' },
      { label: 'Duplicates Pruned', value: '3,244 Exact' },
    ],
    summary:
      'Full-stack AI-powered fashion e-commerce platform engineered with intelligent product discovery, dynamic filtering, persistent cart, and wishlist management.',
    highlights: [
      'Integrated Gemini-powered natural-language search, OpenCLIP visual similarity search, and an AI Outfit Finder for personalized styling.',
      'Built a hands-free voice-shopping assistant powered by the browser Web Speech API.',
      'Processed a 30,000-row fashion catalog pipeline—validating 26,756 clean records and filtering 3,244 exact duplicates into PostgreSQL with pgvector.',
    ],
    architectureNotes:
      'Next.js App Router frontend communicates with a Python FastAPI inference microservice generating 512-d OpenCLIP image/text embeddings, queried via cosine similarity in PostgreSQL + pgvector alongside Prisma ORM transactional cart state.',
    githubUrl: 'https://github.com/sujaltonge384',
    liveUrl: 'https://github.com/sujaltonge384',
  },
  {
    id: 'devpulse',
    index: '02',
    title: 'DevPulse',
    subtitle: 'Developer Productivity & Engineering Hub',
    period: '2026',
    themeColor: '#10B981',
    themeRgb: '16, 185, 129',
    previewType: 'kanban-live',
    stack: ['React.js', 'Redux Toolkit Query', 'Node.js', 'Express.js', 'MongoDB Atlas', 'JWT'],
    metrics: [
      { label: 'GitHub Sync', value: 'OAuth + REST' },
      { label: 'Security', value: 'RBAC + Encrypted' },
      { label: 'Deployment', value: 'Vercel + Render' },
    ],
    summary:
      'Full-stack developer productivity platform unifying project management, Kanban task tracking, productivity analytics, calendar scheduling, and real-time team activity.',
    highlights: [
      'Integrated GitHub OAuth and REST APIs to ingest repositories, commits, pull requests, and live engineering activity with encrypted token storage.',
      'Engineered automated PR triage and one-click pull-request-to-task conversion directly into workspace Kanban boards.',
      'Implemented role-based access controls (RBAC), JWT authentication, bcrypt hashing, and RTK Query cache invalidation; deployed on Vercel and Render.',
    ],
    architectureNotes:
      'React + Redux Toolkit Query client synchronizes normalized cache tags with an Express.js REST API backed by MongoDB Atlas, isolating workspace permissions via RBAC middleware and AES-encrypted GitHub OAuth tokens.',
    githubUrl: 'https://github.com/sujaltonge384',
    liveUrl: 'https://github.com/sujaltonge384',
  },
  {
    id: 'kumbharam-village',
    index: '03',
    title: 'Kumbharam Village',
    subtitle: 'Heritage & Tourism Platform — Aruvakode',
    period: 'Dec 2025 – Jan 2026',
    themeColor: '#F59E0B',
    themeRgb: '245, 158, 11',
    previewType: 'heritage-timeline',
    stack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'OpenWeather API', 'Netlify'],
    metrics: [
      { label: 'Lighthouse Score', value: '93 / 100' },
      { label: 'Curated Guides', value: '5 Destinations' },
      { label: 'Telemetry', value: 'Live Weather API' },
    ],
    summary:
      'Freelance multi-page heritage and tourism portal celebrating Aruvakode’s traditional terracotta pottery craft, artisan products, and regional travel guides.',
    highlights: [
      'Built an interactive pottery-making timeline walking visitors through clay preparation, wheel throwing, kiln firing, and Aruvakode craft heritage.',
      'Designed and shipped 5 destination guides, cultural storytelling chapters, and artisan product showcases.',
      'Achieved a 93/100 Google Lighthouse Performance score via lazy-loaded imagery, deferred video loading, and live OpenWeather API integration.',
    ],
    architectureNotes:
      'Zero-framework semantic HTML5, modular CSS3, and IntersectionObserver-driven Vanilla JS media deferral deliver near-instant First Contentful Paint on mobile networks while hydrating live OpenWeather conditions per destination.',
    githubUrl: 'https://github.com/sujaltonge384',
    liveUrl: 'https://github.com/sujaltonge384',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    code: '01 // UI_SYSTEMS',
    title: 'Frontend Architecture',
    description: 'Component-driven interfaces, state caching, and 60fps motion systems.',
    accent: '#00F0FF',
    span: 'wide',
    skills: ['React.js', 'Next.js', 'Redux Toolkit', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    code: '02 // API_CORE',
    title: 'Backend & API Engineering',
    description: 'High-throughput REST services, OAuth pipelines, and role-based security.',
    accent: '#10B981',
    span: 'normal',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'RESTful APIs', 'JWT Authentication'],
  },
  {
    id: 'databases',
    code: '03 // DATA_LAYER',
    title: 'Databases & Vector Stores',
    description: 'Relational schemas, document stores, and high-dimensional vector indexing.',
    accent: '#38BDF8',
    span: 'normal',
    skills: ['PostgreSQL', 'Prisma', 'pgvector', 'MongoDB', 'MongoDB Atlas'],
  },
  {
    id: 'ai-ml',
    code: '04 // NEURAL_SEARCH',
    title: 'AI / ML Integration',
    description: 'Multimodal image embeddings, cosine similarity retrieval, and GenAI workflows.',
    accent: '#A78BFA',
    span: 'wide',
    skills: ['OpenCLIP', 'Image Embeddings', 'Vector Similarity Search', 'Generative AI Tools'],
  },
  {
    id: 'languages',
    code: '05 // CORE_LANGS',
    title: 'Programming Languages',
    description: 'Strongly typed web stacks, Python AI services, and algorithmic C++/Java.',
    accent: '#F59E0B',
    span: 'normal',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'C++', 'Java'],
  },
  {
    id: 'devops',
    code: '06 // SHIP_PIPELINE',
    title: 'Developer Tools & Cloud',
    description: 'Version control, API verification, and multi-cloud production deployments.',
    accent: '#34D399',
    span: 'normal',
    skills: ['Git', 'GitHub', 'Postman', 'Thunder Client', 'Vercel', 'Render', 'Netlify'],
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'freelance',
    nodeCode: 'NODE_01 // EXPERIENCE',
    period: 'Nov 2022 – Jun 2026',
    category: 'Professional Experience',
    title: 'Freelance Web Developer',
    organization: 'Independent Client Engineering',
    location: 'Nagpur, Maharashtra (Remote)',
    metricBadge: 'Lighthouse Score',
    metricValue: 93,
    metricSuffix: '/100',
    description:
      'Designed, engineered, and deployed full-stack and performance-critical web platforms from discovery through production.',
    bullets: [
      'Delivered Kumbharam Village (Dec 2025 – Jan 2026), a multi-page heritage & tourism platform featuring an interactive pottery-making timeline and 5 destination guides.',
      'Engineered lazy-loaded image pipelines and deferred video loading to achieve a 93/100 Google Lighthouse Performance score.',
      'Integrated live OpenWeather API telemetry for real-time destination weather conditions on Netlify.',
    ],
  },
  {
    id: 'education',
    nodeCode: 'NODE_02 // EDUCATION',
    period: 'B.Tech Undergraduate',
    category: 'Academic Foundation',
    title: 'B.Tech in Computer Science & Engineering',
    organization: 'Shri Ramdeobaba College of Engineering and Management',
    location: 'Nagpur, Maharashtra',
    metricBadge: 'Core Focus',
    metricValue: 100,
    metricSuffix: '% CSE',
    description:
      'Focused on Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, and Scalable Web Engineering.',
    bullets: [
      'Applied systems engineering principles directly to full-stack architectures including VastraAI and DevPulse.',
      'Bridged theoretical algorithmic complexity with production database indexing (PostgreSQL, pgvector, MongoDB).',
    ],
  },
  {
    id: 'achievements',
    nodeCode: 'NODE_03 // RECOGNITION',
    period: 'Continuous Practice',
    category: 'Algorithms & Cloud',
    title: '300+ DSA Problems & Google Cloud Arcade',
    organization: 'LeetCode • CodeChef • HackerRank • Google Cloud',
    location: 'Competitive & Cloud Labs',
    metricBadge: 'Problems Solved',
    metricValue: 300,
    metricSuffix: '+',
    description:
      'Consistent algorithmic problem-solving paired with hands-on cloud infrastructure labs and verified platform badges.',
    bullets: [
      'Solved 300+ coding problems across LeetCode, CodeChef, and HackerRank, sharpening Data Structures and Algorithms.',
      'Earned multiple skill badges through Google Cloud Arcade, demonstrating practical cloud deployment and lab proficiency.',
      'Awarded multiple problem-solving badges on LeetCode and HackerRank.',
    ],
  },
];
