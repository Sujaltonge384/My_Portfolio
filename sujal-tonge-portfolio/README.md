# Sujal Tonge — Full Stack & AI Developer Portfolio (`sujal.dev`)

A high-craft, 60–120fps interactive portfolio built with **Next.js (App Router)**, **TypeScript**, **GSAP (`ScrollTrigger`)**, **Framer Motion**, **Lenis Smooth Scroll**, and **Vanilla CSS Modules**.

## Features & Motion Architecture

- **Terminal Boot Preloader & Morphing Magnetic Cursor:** Fast 1.1s terminal loader and context-aware pointer (`VIEW CASE`, `COPY`, `LAUNCH`, `SCRUB`) powered by Framer Motion spring physics.
- **Spatial Hero Stage & 3D Interactive System Sandbox Dock:** Masked GSAP character reveal, hover role-scramble decoder, `Cmd+K` / `Ctrl+K` Command Palette, and a perspective-tilted (`rotateX(11deg)`) live architecture/vector/telemetry dock that flattens smoothly into the viewport as you scroll.
- **Pinned Horizontal Project Theater:** GSAP `ScrollTrigger` horizontal track showcasing **VastraAI** (OpenCLIP + `pgvector`), **DevPulse** (GitHub OAuth + RTK Query + Kanban), and **Kumbharam Village** (`93/100` Lighthouse + OpenWeather API), complete with interactive mini-demos and a shared-element Case Study Drawer.
- **Cursor-Tracked Spotlight Bento Grid:** 6-card asymmetric technical stack showcase with real-time `--mouse-x` / `--mouse-y` radial border illumination and column scroll parallax.
- **Scroll-Scrubbed SVG Circuit Timeline:** Bidirectional laser path drawing connected to your freelance experience, B.Tech CSE education at RCOEM Nagpur, and `300+` DSA & Google Cloud Arcade milestones.
- **Scroll-Velocity Marquee & Validated Contact API:** Velocity-skewed typography ticker paired with a Zod-validated `/api/contact` endpoint and click-to-copy contact tiles.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

- **Links & Project URLs:** Update `githubUrl` and `liveUrl` entries inside `src/data/portfolio.ts`.
- **Resume PDF:** Your resume is already bundled at `public/resume/SUJAL_TONGE.pdf`. Replace that file anytime to update the site-wide download/preview target.
- **Email Delivery:** Copy `.env.example` to `.env.local` and add your `RESEND_API_KEY` to forward contact form submissions straight to `sujaltonge384@gmail.com`.
