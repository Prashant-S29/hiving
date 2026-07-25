"use client";

import { useEffect, useRef } from "react";
import type { HeroChoice } from "@/lib/types";
import HeroChoiceCards from "./HeroChoiceCards";

// The "choose your path" game-like hero: a mouse-reactive particle
// constellation on canvas, with the real, accessible HeroChoiceCards laid
// over it — canvas is decoration only (aria-hidden, no pointer-events), so
// keyboard/screen-reader/SEO behavior is identical to a plain link grid.
// This is the one piece of the hero that isn't CMS-editable (the animation
// logic is fixed) — everything it displays (labels, descriptions, links,
// accent colors) comes from `choices`, which IS CMS-editable via the
// Homepage Hero document in /studio.

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function InteractiveHero({ choices }: { choices: HeroChoice[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Read the actual brand accent color from the live CSS variable rather
    // than hardcoding it, so this canvas stays in sync with
    // tailwind.config.ts / globals.css even though Canvas 2D can't consume
    // var() directly.
    const signalRgb = getComputedStyle(document.documentElement).getPropertyValue("--color-signal").trim() || "214,59,47";

    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const rect = wrapper!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      const count = prefersReducedMotion ? 0 : Math.min(70, Math.floor((width * height) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
      }));
    }

    resize();
    seed();

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0.001) {
          const force = (1 - dist / 140) * 0.02;
          p.x += dx * force;
          p.y += dy * force;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${signalRgb},0.5)`;
        ctx!.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            ctx!.strokeStyle = `rgba(${signalRgb},${0.12 * (1 - dist / 110)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      if (!prefersReducedMotion) raf = requestAnimationFrame(draw);
    }

    draw();

    function handleMouseMove(e: MouseEvent) {
      const rect = wrapper!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }
    function handleResize() {
      resize();
      seed();
    }

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative min-h-[340px] py-10">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      <div className="relative z-10">
        <HeroChoiceCards choices={choices} />
      </div>
    </div>
  );
}
