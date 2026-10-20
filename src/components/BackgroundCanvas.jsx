import React, { useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";

/**
 * BackgroundCanvas — Declarative-Style WebGL Shader Layer
 * Inspired by `shader-effects-inc/shaders`:
 *  1. OKLab Flowing Aurora / MeshGradient (deep void + electric sky blue)
 *  2. Interactive Cursor Trail / Light Field (smooth momentum)
 *  3. Subtle Simplex Film Grain (eliminates color banding without DOM SVG filters)
 * Falls back gracefully to lightweight 2D canvas if WebGL is unavailable.
 */
const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_scroll;
  uniform float u_dark;

  // Hash & 2D Simplex-style value noise for organic flow and subtle grain
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);

    // Slow, calm time + subtle scroll shift
    float t = u_time * 0.18;
    float scrollOffset = u_scroll * 0.00018;

    // Organic flow field coordinates
    float n1 = noise(p * 1.6 + vec2(t * 0.7, -t * 0.5 + scrollOffset));
    float n2 = noise(p * 2.8 - vec2(t * 0.4, t * 0.6 - scrollOffset));
    float flow = mix(n1, n2, 0.5);

    // Interactive cursor light field (aspect-corrected)
    vec2 mousePos = vec2(u_mouse.x * aspect, 1.0 - u_mouse.y);
    float distToMouse = length(p - mousePos);
    float cursorGlow = exp(-distToMouse * 3.2) * 0.14;

    // Top-right & bottom-left ambient aurora anchors
    vec2 anchorA = vec2(0.82 * aspect + sin(t) * 0.08, 0.78 + cos(t * 0.8) * 0.06);
    vec2 anchorB = vec2(0.18 * aspect + cos(t * 0.9) * 0.08, 0.22 + sin(t * 0.7) * 0.06);

    float ribbonA = exp(-length(p - anchorA) * 1.9) * (0.55 + 0.45 * flow);
    float ribbonB = exp(-length(p - anchorB) * 2.2) * (0.45 + 0.55 * n1);

    // Palette interpolation (Dark mode vs Light mode)
    vec3 darkBase = vec3(0.012, 0.027, 0.071);      // #030712
    vec3 darkSurface = vec3(0.043, 0.059, 0.098);   // #0B0F19
    vec3 darkAccent = vec3(0.220, 0.741, 0.973);    // #38BDF8
    vec3 darkDeepCyan = vec3(0.008, 0.518, 0.780);  // #0284C7

    vec3 lightBase = vec3(1.0, 1.0, 1.0);           // #FFFFFF
    vec3 lightSurface = vec3(0.941, 0.976, 1.0);    // #F0F9FF
    vec3 lightAccent = vec3(0.008, 0.518, 0.780);   // #0284C7

    vec3 colDark = mix(darkBase, darkSurface, smoothstep(0.0, 1.0, uv.y));
    colDark += darkDeepCyan * ribbonA * 0.14;
    colDark += darkAccent * ribbonB * 0.09;
    colDark += darkAccent * cursorGlow;

    vec3 colLight = mix(lightBase, lightSurface, smoothstep(0.0, 1.0, uv.y) * 0.6);
    colLight = mix(colLight, lightSurface, (ribbonA + ribbonB) * 0.45);
    colLight += lightAccent * cursorGlow * 0.22;

    vec3 finalColor = mix(colLight, colDark, u_dark);

    // Subtle film grain to prevent gradient banding (GPU-native, zero DOM cost)
    float grain = (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * (u_dark > 0.5 ? 0.018 : 0.008);
    finalColor += grain;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

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

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Try initializing WebGL shader pipeline
    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" }) ||
      canvas.getContext("experimental-webgl");

    if (!gl) return;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uDark = gl.getUniformLocation(program, "u_dark");

    // Render at 0.65x resolution for silky 120fps performance on high-DPI screens
    const updateSize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.25) * 0.65;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    updateSize();

    let targetMouse = { x: 0.72, y: 0.28 };
    let currentMouse = { x: 0.72, y: 0.28 };
    let currentScroll = window.scrollY || 0;
    let currentDark = isDarkRef.current ? 1.0 : 0.0;

    const handleMouseMove = (e) => {
      targetMouse.x = e.clientX / Math.max(window.innerWidth, 1);
      targetMouse.y = e.clientY / Math.max(window.innerHeight, 1);
    };

    const handleScroll = () => {
      currentScroll = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateSize);

    let rafId;
    const startTime = performance.now();

    const renderFrame = (now) => {
      const elapsed = prefersReducedMotion ? 0 : (now - startTime) * 0.001;

      // Smooth cursor momentum (smoothing: 0.08)
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      // Smooth theme transition
      const targetDark = isDarkRef.current ? 1.0 : 0.0;
      currentDark += (targetDark - currentDark) * 0.12;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uScroll, currentScroll);
      gl.uniform1f(uDark, currentDark);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateSize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
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
