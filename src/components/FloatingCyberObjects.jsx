import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePortfolio } from "../context/PortfolioContext";

const FloatingCyberObjects = () => {
  const containerRef = useRef(null);
  const { isDarkMode } = usePortfolio();
  const isDarkRef = useRef(isDarkMode);

  useEffect(() => {
    isDarkRef.current = isDarkMode;
  }, [isDarkMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Soft Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x7dd3fc, 1.0); // Soft Sky Blue
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf472b6, 0.8); // Soft Pastel Pink
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    // 3. Cute Tech Objects Group
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Color Palette: Cute Modern EdTech (Sky Blue, Soft Lavender, Mint, Warm Sunshine)
    const skyBlue = 0x38bdf8;
    const softLavender = 0xa78bfa;
    const mintGreen = 0x34d399;
    const warmSunshine = 0xfbbf24;

    // Object 1: Cute Smooth Donut Ring (Top Right)
    const donutGeo = new THREE.TorusGeometry(0.9, 0.28, 24, 48);
    const donutMat = new THREE.MeshStandardMaterial({
      color: skyBlue,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
    });
    const donutMesh = new THREE.Mesh(donutGeo, donutMat);
    donutMesh.position.set(5.8, 2.5, -2);
    donutMesh.rotation.set(0.6, 0.4, 0);
    objectsGroup.add(donutMesh);

    // Object 2: Soft Glowing Innovation Sphere / Bubble (Mid Left)
    const bubbleGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: softLavender,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.55,
    });
    const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubbleMesh.position.set(-5.5, -1.2, -1.5);
    objectsGroup.add(bubbleMesh);

    // Object 3: Friendly Little Satellite Bubble (Near Left Bubble)
    const miniBubbleGeo = new THREE.SphereGeometry(0.42, 24, 24);
    const miniBubbleMat = new THREE.MeshStandardMaterial({
      color: mintGreen,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    const miniBubbleMesh = new THREE.Mesh(miniBubbleGeo, miniBubbleMat);
    miniBubbleMesh.position.set(-4.0, -2.4, -0.5);
    objectsGroup.add(miniBubbleMesh);

    // Object 4: Warm Sunshine Sparkle Star (Bottom Right)
    const starGeo = new THREE.OctahedronGeometry(0.7, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: warmSunshine,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.set(4.6, -3.2, -1);
    objectsGroup.add(starMesh);

    // Object 5: Cute Floating Floating Idea Dots (10 gentle pastel particles)
    const dotCount = 10;
    const dotMeshes = [];
    const dotGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const dotColors = [skyBlue, softLavender, mintGreen, warmSunshine];

    for (let i = 0; i < dotCount; i++) {
      const dotMat = new THREE.MeshStandardMaterial({
        color: dotColors[i % dotColors.length],
        roughness: 0.3,
        transparent: true,
        opacity: 0.5,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      const angle = (i / dotCount) * Math.PI * 2;
      const radius = 6.2 + (Math.random() - 0.5) * 3;
      dot.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 8,
        -1 - Math.random() * 3
      );
      dot.userData = {
        floatSpeed: 0.001 + Math.random() * 0.002,
        offset: Math.random() * Math.PI * 2,
        rotSpeed: 0.01 + Math.random() * 0.01,
      };
      dotMeshes.push(dot);
      objectsGroup.add(dot);
    }

    // 4. Smooth Parallax & Mouse tracking
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;

    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // 5. Animation Loop (Smooth, frame-rate independent with tab visibility pause)
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Pause rendering when tab is hidden to save GPU/battery
      if (document.hidden) return;

      const t = clock.getElapsedTime();

      // Smooth mouse & scroll lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      scrollY += (targetScrollY - scrollY) * 0.04;

      // Gentle floating animations
      donutMesh.rotation.x = t * 0.15;
      donutMesh.rotation.y = t * 0.2;
      donutMesh.position.y = 2.5 + Math.sin(t * 0.9) * 0.28;

      bubbleMesh.position.y = -1.2 + Math.cos(t * 0.8) * 0.22;
      bubbleMesh.rotation.y = t * 0.1;

      miniBubbleMesh.position.y = -2.4 + Math.sin(t * 1.1 + 1) * 0.2;
      miniBubbleMesh.position.x = -4.0 + Math.cos(t * 0.7) * 0.15;

      starMesh.rotation.y = t * 0.35;
      starMesh.rotation.z = Math.sin(t * 0.5) * 0.2;
      starMesh.position.y = -3.2 + Math.sin(t * 1.0 + 2) * 0.25;

      // Floating idea particles
      dotMeshes.forEach((dot) => {
        dot.position.y += Math.sin(t * 1.2 + dot.userData.offset) * 0.003;
        dot.rotation.y += dot.userData.rotSpeed;
      });

      // Overall Parallax
      const scrollNorm = (scrollY / Math.max(document.body.scrollHeight - height, 1)) * 3;
      objectsGroup.position.x = mouse.x * 0.35;
      objectsGroup.position.y = mouse.y * 0.25 + scrollNorm * 0.4;

      // Theme opacity adaptation
      const isDark = isDarkRef.current;
      const opacityFactor = isDark ? 0.8 : 0.55;
      donutMat.opacity = 0.65 * opacityFactor;
      bubbleMat.opacity = 0.55 * opacityFactor;
      miniBubbleMat.opacity = 0.6 * opacityFactor;
      starMat.opacity = 0.7 * opacityFactor;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Memory cleanup
      donutGeo.dispose();
      donutMat.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      miniBubbleGeo.dispose();
      miniBubbleMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      dotGeo.dispose();
      dotMeshes.forEach((d) => d.material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingCyberObjects;
