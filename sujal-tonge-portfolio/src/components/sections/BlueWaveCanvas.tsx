"use client";

import React, { useEffect, useRef } from "react";
import styles from "./HeroStage.module.css";

interface BlueWaveCanvasProps {
  theme: "dark" | "light";
}

export default function BlueWaveCanvas({ theme }: BlueWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: e.clientX / Math.max(width, 1),
        y: e.clientY / Math.max(height, 1),
      };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handlePointerMove);

    const particles = Array.from({ length: 65 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.2 + (i % 3) * 0.9,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.012;
      const isDark = theme === "dark";

      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (isDark) {
        bgGrad.addColorStop(0, "#030816");
        bgGrad.addColorStop(0.5, "#071936");
        bgGrad.addColorStop(1, "#030c1f");
      } else {
        bgGrad.addColorStop(0, "#e6f2ff");
        bgGrad.addColorStop(0.5, "#cde4ff");
        bgGrad.addColorStop(1, "#dbeafe");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const auraX = width * (0.35 + pointerRef.current.x * 0.3);
      const auraY = height * (0.35 + pointerRef.current.y * 0.3);
      const aura = ctx.createRadialGradient(
        auraX,
        auraY,
        20,
        auraX,
        auraY,
        Math.max(width, height) * 0.55
      );
      if (isDark) {
        aura.addColorStop(0, "rgba(56, 189, 248, 0.24)");
        aura.addColorStop(0.45, "rgba(29, 78, 216, 0.14)");
        aura.addColorStop(1, "rgba(3, 8, 22, 0)");
      } else {
        aura.addColorStop(0, "rgba(14, 165, 233, 0.22)");
        aura.addColorStop(0.5, "rgba(59, 130, 246, 0.12)");
        aura.addColorStop(1, "rgba(230, 242, 255, 0)");
      }
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      const waveConfigs = [
        {
          amp: 56,
          freq: 0.0042,
          speed: 1.15,
          yBase: height * 0.56,
          color: isDark ? "rgba(56, 189, 248, 0.42)" : "rgba(2, 132, 199, 0.34)",
          lineWidth: 2,
        },
        {
          amp: 78,
          freq: 0.0031,
          speed: -0.85,
          yBase: height * 0.62,
          color: isDark ? "rgba(59, 130, 246, 0.36)" : "rgba(29, 78, 216, 0.26)",
          lineWidth: 1.6,
        },
        {
          amp: 42,
          freq: 0.0055,
          speed: 1.5,
          yBase: height * 0.48,
          color: isDark ? "rgba(125, 211, 252, 0.28)" : "rgba(14, 116, 144, 0.22)",
          lineWidth: 1.2,
        },
      ];

      waveConfigs.forEach((wave, idx) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const offset = (pointerRef.current.y - 0.5) * 45 * (idx + 1) * 0.35;
          const y =
            wave.yBase +
            offset +
            Math.sin(x * wave.freq + time * wave.speed + idx) * wave.amp +
            Math.cos(x * wave.freq * 0.5 - time * 0.6) * (wave.amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.stroke();
      });

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + (pointerRef.current.x - 0.5) * 0.25;
        p.y += p.vy + (pointerRef.current.y - 0.5) * 0.25;
        p.phase += 0.03;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = 0.55 + 0.45 * Math.sin(p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(125, 211, 252, ${pulse})`
          : `rgba(29, 78, 216, ${pulse * 0.7})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 125) {
            const alpha = (1 - dist / 125) * (isDark ? 0.22 : 0.16);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${alpha})`
              : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.canvasLayer} aria-hidden="true" />;
}