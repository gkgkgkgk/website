import React, { useEffect } from 'react';
import * as THREE from 'three';
const { Noise } = require('noisejs');
import {fromBlob} from 'geotiff'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

const ThreeDCanvas = () => {

  useEffect(() => {
    const scene = new THREE.Scene();
    // const camera = new THREE.OrthographicCamera(0,0,0,0, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000); // Aspect ratio set to 1 initially
    camera.position.z = 200;
    const canvas = document.getElementById('canvas');
    const container = document.getElementById('three-container');
    const renderer = new THREE.WebGLRenderer({ alpha: true, canvas });
    let material = null;
    const setRendererSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio( window.devicePixelRatio );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    setRendererSize();

    renderer.setClearColor(0x000000, 0.0);

    const setupScene = async () => {

				const fragmentShaderFile = await fetch("shaders/fragment.glsl");
        const fragmentShader = await fragmentShaderFile.text();

        const vertexShaderFile = await fetch("shaders/vertex.glsl");
        const vertexShader = await vertexShaderFile.text();
        let vec = new THREE.Vector2( 0, 1 );
        renderer.getSize(vec);
        const geometry = new THREE.PlaneGeometry(2, 2);
        material = new THREE.ShaderMaterial({
          uniforms: {
            height: { value: vec.y },
            width: { value: vec.x }
          },
          vertexShader,
          fragmentShader
      });
    
      // Create the mesh and add to the scene
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    setupScene();
    
    const animate = () => {
      requestAnimationFrame(animate);


      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      let vec = new THREE.Vector2( 0, 1 );
      renderer.getSize(vec);
      if(material !== null){
        material.uniforms.height.value = vec.y;
        material.uniforms.width.value = vec.x;
      }
      setRendererSize();
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);

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