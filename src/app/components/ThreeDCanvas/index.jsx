import React, { useEffect } from 'react';
import * as THREE from 'three';
const { Noise } = require('noisejs');
import {fromBlob} from 'geotiff'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

const ThreeDCanvas = () => {
  const generateMountainRange = async (mountainHeight) => {
    const noise = new Noise();

    const width = 512;
    const height = 512;

    const size = width * height;
    const data = new Uint8Array( 4 * size );

    for ( let i = 0; i < size; i ++ ) {
      const x = i % width;
      const y = Math.floor(i / width);
      let value = noise.simplex2(x / 100, y / 100);
      value = (value + 1) / 2;
      const stride = i * 4;
      data[ stride ] = value* 255;
      data[ stride + 1 ] = value * 255;
      data[ stride + 2 ] = value* 255;
      data[ stride + 3 ] = 255;
    }

    const texture = new THREE.DataTexture( data, width, height );
    texture.needsUpdate = true;

    const colorData = new Uint8Array( 4 * size );

    for ( let i = 0; i < size; i ++ ) {
      const stride = i * 4;
      if(data[stride] < 20){
        colorData[ stride ] = 255;
        colorData[ stride + 1 ] = 255;
        colorData[ stride + 2 ] = 255;
        colorData[ stride + 3 ] = 255;
      } else if(data[stride] < 100){
        colorData[ stride ] = 100;
        colorData[ stride + 1 ] = 100;
        colorData[ stride + 2 ] = 100;
        colorData[ stride + 3 ] = 255;
      } else {
        colorData[ stride ] = 25;
        colorData[ stride + 1 ] = 255;
        colorData[ stride + 2 ] = 50;
        colorData[ stride + 3 ] = 255;
      }
    }

    const color = new THREE.DataTexture( colorData, width, height );
    color.needsUpdate = true;

    let terrain = 'tifs/agri-medium-dem.tif'
    const terrainResponse = await fetch(terrain);
    const terrainBlob = await terrainResponse.blob();
    const rawTiff = await fromBlob(terrainBlob);
    const tifImage = await rawTiff.getImage();

    // Get the dimensions of the GeoTIFF image
    const imageWidth = tifImage.getWidth();
    const imageHeight = tifImage.getHeight();
    console.log(imageWidth, imageHeight)
    // Read elevation data from the GeoTIFF file
    const rawElevationData = await tifImage.readRasters({
      interleave: true,
      width: 125,
      height: 98,
    });
    console.log(rawElevationData)
    // Normalize elevation data
    const minValue = Math.min(...rawElevationData);
    const maxValue = Math.max(...rawElevationData);
    console.log(minValue, maxValue)
    const elevationData = rawElevationData.map((value) => (value - minValue) / (maxValue - minValue));

    // Create terrain geometry
    const geometry = new THREE.PlaneGeometry(20, 20, 125 - 1, 98 - 1);

    // Apply elevation data to the vertices
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const elevation = elevationData[i / 3] * mountainHeight; // Adjust the multiplier for vertical scaling
      positions[i + 2] = elevation;
    }


    const imagetexture = new THREE.TextureLoader().load('tifs/agri-medium-autumn.jpg');
    const material = new THREE.MeshStandardMaterial({
      map: imagetexture,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI/2;
    plane.position.z = -10
    plane.receiveShadow = true;
    plane.castShadow = true;

    return plane;
  }



  useEffect(() => {
    const scene = new THREE.Scene();
    // const camera = new THREE.OrthographicCamera(0,0,0,0, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 10000); // Aspect ratio set to 1 initially
    let material;
    let mesh;
    camera.position.z = 20;
    const canvas = document.getElementById('canvas');
    const container = document.getElementById('three-container');
    const renderer = new THREE.WebGLRenderer({ alpha: true, canvas, antialias:true });

    const setRendererSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    setRendererSize();

    renderer.setClearColor(0x000000, 0.0);
    let mountains = null;
    const setupScene = async () => {
      let mountainHeight = 4;
      mountains = await generateMountainRange(mountainHeight);
      const directionalLight = new THREE.DirectionalLight(0xffd29c, 2);
      directionalLight.castShadow = true;
      directionalLight.position.set(5, 1, 0);
      scene.add(directionalLight);
      scene.add(mountains);

      const size = 128;
				const data = new Uint8Array( size * size * size );

				let i = 0;
				const scale = 0.05;
				const perlin = new ImprovedNoise();
				const vector = new THREE.Vector3();

				for ( let z = 0; z < size; z ++ ) {

					for ( let y = 0; y < size; y ++ ) {

						for ( let x = 0; x < size; x ++ ) {

							const d = 1.0 - vector.set( x, y, z ).subScalar( size / 2 ).divideScalar( size ).length();
							data[ i ] = ( 128 + 128 * perlin.noise( x * scale / 1.5, y * scale, z * scale / 1.5 ) ) * d * d;
							i ++;

						}

					}

				}

				const texture = new THREE.Data3DTexture( data, size, size, size );
				texture.format = THREE.RedFormat;
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;
				texture.unpackAlignment = 1;
				texture.needsUpdate = true;

				// Material

				const vertexShader = /* glsl */`
					in vec3 position;

					uniform mat4 modelMatrix;
					uniform mat4 modelViewMatrix;
					uniform mat4 projectionMatrix;
					uniform vec3 cameraPos;

					out vec3 vOrigin;
					out vec3 vDirection;

					void main() {
						vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

						vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
						vDirection = position - vOrigin;

						gl_Position = projectionMatrix * mvPosition;
					}
				`;

				const fragmentShaderFile = await fetch("shaders/cloud.fs.glsl");
        const fragmentShader = await fragmentShaderFile.text();
        console.log(fragmentShader);

				const geometry = new THREE.BoxGeometry( 1, 1, 1 );
				material = new THREE.RawShaderMaterial( {
					glslVersion: THREE.GLSL3,
					uniforms: {
						base: { value: new THREE.Color( 0xda5449 ) },
						map: { value: texture },
						cameraPos: { value: new THREE.Vector3() },
						threshold: { value: 0.25 },
						opacity: { value: 0.25 },
						range: { value: 0.1 },
						steps: { value: 100 },
						frame: { value: 0 }
					},
					vertexShader,
					fragmentShader,
					side: THREE.BackSide,
					transparent: true
				} );

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

        const parameters = {
          threshold: 0.25,
          opacity: 0.25,
          range: 0.1,
          steps: 100
        };

        material.uniforms.threshold.value = parameters.threshold;
        material.uniforms.opacity.value = parameters.opacity;
        material.uniforms.range.value = parameters.range;
        material.uniforms.steps.value = parameters.steps;
    }
    
    setupScene();

    const animate = () => {
      requestAnimationFrame(animate);
      if(mountains){
        mountains.position.y = -6;
      }

      if(material){
        mesh.material.uniforms.cameraPos.value.copy( camera.position );
				mesh.rotation.y = - performance.now() / 7500;

				mesh.material.uniforms.frame.value ++;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
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