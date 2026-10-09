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

    // 2. Soft Minimalist Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x5eead4, 0.6); // Ice Cyan
    dirLight.position.set(6, 6, 6);
    scene.add(dirLight);

    // 3. Luxury Spatial Glass Objects Group
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Object 1: Subtle Frosted Glass Icosahedron (Top Right Periphery)
    const icosaGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111114,
      emissive: 0x0a1618,
      emissiveIntensity: 0.2,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.35,
    });
    const icosaMesh = new THREE.Mesh(icosaGeo, glassMat);
    icosaMesh.position.set(6.5, 3.2, -3);
    objectsGroup.add(icosaMesh);

    // Hairline Wireframe Frame for Object 1
    const icosaEdges = new THREE.EdgesGeometry(icosaGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
    });
    const icosaWire = new THREE.LineSegments(icosaEdges, edgeMat);
    icosaMesh.add(icosaWire);

    // Object 2: Subtle Minimalist Octahedron (Bottom Left Periphery)
    const octaGeo = new THREE.OctahedronGeometry(1.0, 0);
    const octaMesh = new THREE.Mesh(octaGeo, glassMat);
    octaMesh.position.set(-6.8, -2.8, -2.5);
    objectsGroup.add(octaMesh);

    const octaEdges = new THREE.EdgesGeometry(octaGeo);
    const octaWire = new THREE.LineSegments(octaEdges, edgeMat);
    octaMesh.add(octaWire);

    // 4. Parallax Scroll Physics
    let lastScrollY = window.scrollY;
    let scrollDelta = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDelta = (currentScrollY - lastScrollY) * 0.015;
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 5. Animation Loop (Slow, Quiet, Cinematic)
    let animationId;
    const clock = new THREE.Clock();

    const render = () => {
      animationId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      scrollDelta *= 0.94;

      // Slow drift
      icosaMesh.rotation.x = elapsedTime * 0.04 + scrollDelta * 0.2;
      icosaMesh.rotation.y = elapsedTime * 0.06;
      icosaMesh.position.y = 3.2 + Math.sin(elapsedTime * 0.6) * 0.12 - scrollDelta * 0.5;

      octaMesh.rotation.x = -elapsedTime * 0.05;
      octaMesh.rotation.y = elapsedTime * 0.04 - scrollDelta * 0.2;
      octaMesh.position.y = -2.8 + Math.cos(elapsedTime * 0.5) * 0.1 - scrollDelta * 0.5;

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      icosaGeo.dispose();
      octaGeo.dispose();
      glassMat.dispose();
      edgeMat.dispose();
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
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default FloatingCyberObjects;
