import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import char15Photo from "../img/15.webp";

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

    // 3. Load 15.webp Texture & Build Pure Clean Character Presentation
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

        const cardWidth = 3.6;
        const cardHeight = 4.0;

        // Clean character plane without noisy effects
        const charGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
        const charMat = new THREE.MeshBasicMaterial({
          map: photoTexture,
          transparent: true,
          alphaTest: 0.02,
          side: THREE.DoubleSide,
        });
        const charMesh = new THREE.Mesh(charGeo, charMat);
        charMesh.position.set(-0.42, 0, 0);
        modelGroup.add(charMesh);

        // Grounding subtle ambient soft shadow
        const shadowGeo = new THREE.PlaneGeometry(2.4, 0.8);
        const shadowMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = Math.PI / 2;
        shadowMesh.position.set(-0.42, -1.95, -0.1);
        modelGroup.add(shadowMesh);
      },
      undefined,
      (err) => {
        console.error("Failed to load character texture in Three.js", err);
      }
    );

    // 4. Mouse & Touch Interaction Physics (Quiet Luxury: Parallax Capped at ≤6°)
    const MAX_TILT_RAD = (6 * Math.PI) / 180; // exactly 6 degrees (~0.1047 rad)
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
        mainGroup.rotation.y += deltaX * 0.008;
        mainGroup.rotation.x += deltaY * 0.008;
      } else {
        // Precise restraint: luxury tilt ≤ 6°
        targetRotationY = Math.max(-MAX_TILT_RAD, Math.min(MAX_TILT_RAD, x * MAX_TILT_RAD));
        targetRotationX = Math.max(-MAX_TILT_RAD * 0.7, Math.min(MAX_TILT_RAD * 0.7, -y * MAX_TILT_RAD * 0.7));
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

    const handleMouseLeave = () => {
      if (!isDragging) {
        targetRotationX = 0;
        targetRotationY = 0;
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("mousedown", handleMouseDown);
    domElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("touchmove", handleTouchMove, { passive: true });
    domElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 5. Animation Loop (Quiet Elegance: Gentle ambient float)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        const idleSway = Math.sin(elapsedTime * 1.0) * 0.015;
        mainGroup.rotation.y += (targetRotationY + idleSway - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
      }

      // Very subtle, stable vertical breathing (0.02 amplitude)
      mainGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousemove", handleMouseMove);
      domElement.removeEventListener("mousedown", handleMouseDown);
      domElement.removeEventListener("mouseleave", handleMouseLeave);
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
        title="ลากเพื่อหมุนเบา ๆ (จำกัดมุมเอียง ≤6° เพื่อความสง่างามระดับพรีเมียม)"
      />
    </div>
  );
};

export default Hero3D;
