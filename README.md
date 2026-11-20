# Sujal Tonge — Full-Stack Software Developer & AI Architect Portfolio

[![Live Site](https://img.shields.io/badge/Live-sujal.dev-00F0FF?style=for-the-badge&logo=vercel&logoColor=white)](https://sujaltonge.vercel.app/))
[![Next.js](https://img.shields.io/badge/Next.js_15-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_%2B_GSAP-FF2A85?style=for-the-badge)](https://www.framer.com/motion/)

A production-grade, interactive engineering portfolio built with **Next.js 15**, **React 19**, **TypeScript**, **Framer Motion**, and **GSAP**, deployed at **[sujal.dev]([https://sujal.dev](https://sujaltonge.vercel.app/))**. Designed with viewport-calibrated 60fps scroll choreography, live dual neon themes, and interactive architecture sandboxes showcasing full-stack and multimodal AI systems.

---

## Key Features

- **Dual Neon Theme Engine (`T` Shortcut):** Instant switching between **Neon Blue & Pink** (`#00F0FF` / `#FF2A85`) and **Neon Orange & Amber** (`#FF6A00` / `#FFBE0B`) with animated sweep transitions and `localStorage` persistence.
- **Interactive System Sandbox Dock:**
  - **Architecture Flow & Packet Simulator:** Trace live requests step-by-step from `Next.js` client to `FastAPI / Express` inference and `PostgreSQL + pgvector / MongoDB`.
  - **Vector Retrieval Sandbox:** Test multimodal cosine similarity queries (`OpenCLIP` + `pgvector`) with a live similarity threshold slider.
  - **Verified Telemetry:** Key metrics across shipped systems.
- **Click-to-Pulse Hero Wave Canvas:** Custom HTML5 2D particle and sine-wave network with cursor aura tracking, click shockwaves, and Konami-code (`↑ ↑ ↓ ↓ ← → ← → B A`) overclock mode.
- **Interactive Tech Stack Bubble Matrix:** Cursor-repelling physics bubbles categorized across *Frontend & Motion*, *Backend & APIs*, and *AI & Vector DB* with pulse burst physics and architecture notes.
- **Case Study Slide-Over Drawer:** Deep-dive architecture breakdowns, metrics, and copyable implementation snippets for featured builds.
- **Command Palette (`⌘K` / `Ctrl+K`):** Keyboard-first navigation, theme switching, email copy, and instant case-study inspection.
- **Screen-Calibrated Scroll Choreography:** Viewport-aware motion profiles (`mobile`, `tablet`, `desktop`) respecting `prefers-reduced-motion`, paired with a live session-tracked visitor counter (`/api/visits`).

---

## Featured Engineering Case Studies

| Project | Domain | Core Stack | Highlights |
| :--- | :--- | :--- | :--- |
| **VastraAI (Nexora Fashion)** | AI & Full-Stack | Next.js 15, React, FastAPI, PostgreSQL, `pgvector`, Prisma, OpenCLIP | 512-d multimodal visual & natural-language retrieval across 26,756 deduplicated records |
| **DevPulse** | Full-Stack Web | React.js, Redux Toolkit Query, Node.js, Express.js, MongoDB Atlas, JWT | Developer productivity dashboard with normalized RTK Query caching and RBAC auth |
| **Hotel Management System** | Full-Stack Web | React, TypeScript, Node.js, Express, PostgreSQL, Prisma ORM | Real-time room tracking, advance reservations, and automated dynamic invoicing |
| **Kumbharan Village** | Frontend & Craft | Next.js, React, TypeScript, CSS Modules, Motion | Editorial web showcase spotlighting traditional terracotta pottery artisans in Aruvakode, Kerala |

---

## Tech Stack

- **Frontend & Motion:** Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS & CSS Modules, Framer Motion, GSAP (`ScrollTrigger`), Lucide Icons
- **Backend & AI Systems:** Node.js, Express.js, FastAPI, RESTful APIs, JWT Auth, OpenCLIP
- **Databases & ORM:** PostgreSQL, `pgvector`, Prisma ORM, MongoDB Atlas
- **Deployment & Tooling:** Vercel, Git, GitHub

---

## Local Development

```bash
# 1. Clone the repository
git clone [https://github.com/Sujaltonge384/My_Portfolio.git](https://github.com/Sujaltonge384/My_Portfolio.git)
cd My_Portfolio/sujal-tonge-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
