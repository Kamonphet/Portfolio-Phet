import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import char15Photo from "../img/15.png";

const Hero3D = () => {
  const containerRef = useRef(null);
  const resetRotationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Main interactive rotating group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Reset rotation handler
    resetRotationRef.current = () => {
      mainGroup.rotation.set(0, 0, 0);
    };

    // 3. Load 15.png Texture & Build Pure Clean Character Cutout
    const textureLoader = new THREE.TextureLoader();
    let modelGroup = new THREE.Group();
    mainGroup.add(modelGroup);

    textureLoader.load(
      char15Photo,
      (photoTexture) => {
        photoTexture.colorSpace = THREE.SRGBColorSpace;
        photoTexture.generateMipmaps = true;
        photoTexture.minFilter = THREE.LinearMipmapLinearFilter;
        photoTexture.magFilter = THREE.LinearFilter;

        // Flipped horizontally so Kru Petch faces left towards Hero content
        photoTexture.wrapS = THREE.RepeatWrapping;
        photoTexture.repeat.x = -1;
        photoTexture.offset.x = 1;

        // Big dimensions
        const cardWidth = 3.6;
        const cardHeight = 4.0;

        // Pure clean character plane without any extra lines, rings, or effects
        const charGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
        const charMat = new THREE.MeshBasicMaterial({
          map: photoTexture,
          transparent: true,
          alphaTest: 0.02,
          side: THREE.DoubleSide,
        });
        const charMesh = new THREE.Mesh(charGeo, charMat);
        // Center the character visually within the 3D rotating space
        charMesh.position.set(-0.42, 0, 0);
        modelGroup.add(charMesh);
      },
      undefined,
      (err) => {
        console.error("Failed to load 15.png in Three.js", err);
      }
    );

    // 4. Mouse & Touch Interaction Physics
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    const onPointerMove = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / width) * 2 - 1;
      const y = -(((clientY - rect.top) / height) * 2 - 1);

      if (isDragging) {
        const deltaX = clientX - prevPosition.x;
        const deltaY = clientY - prevPosition.y;
        mainGroup.rotation.y += deltaX * 0.01;
        mainGroup.rotation.x += deltaY * 0.01;
      } else {
        targetRotationY = x * 0.65;
        targetRotationX = -y * 0.65;
      }
      prevPosition = { x: clientX, y: clientY };
    };

    const handleMouseMove = (e) => onPointerMove(e.clientX, e.clientY);
    const handleMouseDown = (e) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for Mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };

    // Scroll interaction
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("touchmove", handleTouchMove, { passive: true });
    domElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 5. Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth inertia rotation
      if (!isDragging) {
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05 + 0.003;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
      }

      // Scroll-driven tilt & vertical offset
      mainGroup.rotation.z = scrollY * 0.001;
      mainGroup.position.y = -Math.min(scrollY * 0.0006, 1.0);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousemove", handleMouseMove);
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      domElement.removeEventListener("touchmove", handleTouchMove);
      domElement.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "520px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        onDoubleClick={() => resetRotationRef.current?.()}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "520px",
          cursor: "grab",
        }}
        title="คลิกและลากเพื่อหมุนภาพ 3D รอบทิศทาง (ดับเบิ้ลคลิกเพื่อรีเซ็ตมุมมอง)"
      />
    </div>
  );
};

export default Hero3D;
