import React, { useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const { isDarkMode } = usePortfolio();
  const isDarkRef = useRef(isDarkMode);

  useEffect(() => {
    isDarkRef.current = isDarkMode;
  }, [isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle, sparse particle count for quiet luxury
    const particleCount = Math.min(Math.floor((width * height) / 24000), 45);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.4 + 0.6,
        alpha: Math.random() * 0.35 + 0.15,
      });
    }

    let mouse = { x: null, y: null, maxDist: 120 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    let lastScrollY = window.scrollY;
    let scrollDelta = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDelta = (currentScrollY - lastScrollY) * 0.1;
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let animationId;

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      scrollDelta *= 0.94;

      const isDark = isDarkRef.current;
      // Dark: Electric Cyber Sky Blue (56, 189, 248) | Light: Sky Blue (2, 132, 199)
      const accentRgb = isDark ? "56, 189, 248" : "2, 132, 199";
      const neutralRgb = isDark ? "56, 189, 248" : "2, 132, 199";

      // Subtle atmospheric radial corner glow
      const gradient = ctx.createRadialGradient(
        width * 0.85,
        height * 0.15,
        20,
        width * 0.85,
        height * 0.15,
        width * 0.55
      );
      gradient.addColorStop(0, `rgba(${accentRgb}, ${isDark ? 0.05 : 0.06})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render subtle drifting stardust
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy - scrollDelta;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${neutralRgb}, ${p.alpha * 0.4})`;
        ctx.fill();

        // Very faint connective lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 100) * 0.04;
            ctx.strokeStyle = `rgba(${neutralRgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Faint mouse proximity trace
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const mAlpha = (1 - mdist / mouse.maxDist) * 0.12;
            ctx.strokeStyle = `rgba(${accentRgb}, ${mAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default BackgroundCanvas;
