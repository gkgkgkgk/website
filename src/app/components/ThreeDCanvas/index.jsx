import React, { useEffect } from 'react';
import * as THREE from 'three';

const ThreeDCanvas = () => {
  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio set to 1 initially
    camera.position.z = 5;

    // Check if the container already has children (canvas)
    const canvas = document.getElementById('canvas');
    const container = document.getElementById('three-container');
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, canvas });

    const setRendererSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Call the function initially and when the window is resized
    setRendererSize();

    renderer.setClearColor(0x000000, 0.5); // Color, Alpha

    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      setRendererSize();
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="three-container">
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default ThreeDCanvas;