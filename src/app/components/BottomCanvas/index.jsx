import React, { useEffect, useRef } from "react";
import "./styles.css";
import {fromBlob} from 'geotiff'
import { desaturate, lighten } from 'color2k';
const { Noise } = require('noisejs');

const BottomCanvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let noise = new Noise();
    let mountains = [];

    function getRowOrColumn(rawElevationData, width, height, rowOrColumnNumber, isRow) {
      if (isRow) {
          if (rowOrColumnNumber < 0 || rowOrColumnNumber >= height) {
              throw new Error("Invalid row number");
          }
  
          const startIndex = rowOrColumnNumber * width;
          const endIndex = startIndex + width;
  
          return rawElevationData.slice(startIndex, endIndex);
      } else {
          if (rowOrColumnNumber < 0 || rowOrColumnNumber >= width) {
              throw new Error("Invalid column number");
          }
  
          const columnData = [];
          for (let i = rowOrColumnNumber; i < height * width; i += width) {
              columnData.push(rawElevationData[i]);
          }
  
          return columnData;
      }
    }

    const drawTree = (size, x, y) => {
      var trunkWidth = size;
      var trunkHeight = size * 10;
      var branchWidth = size * 5;

      // Set the coordinates of the bottom of the trunk
      var trunkX = x - trunkWidth / 2;
      var trunkY = y - trunkHeight;

      // Set the color for the silhouette
      ctx.fillStyle = "#140e0d";

      // Draw the trunk
      ctx.fillRect(trunkX - trunkWidth / 2, trunkY, trunkWidth, trunkHeight);
      ctx.fillStyle = "#151a15";

      // Draw the tree branches
      ctx.beginPath();
      ctx.moveTo(trunkX, trunkY - branchWidth * 3);
      ctx.lineTo(trunkX - branchWidth, trunkY);
      ctx.lineTo(trunkX + branchWidth, trunkY);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(trunkX, trunkY + 10 - branchWidth * 3);
      ctx.lineTo(trunkX - branchWidth, trunkY + 10- branchWidth);
      ctx.lineTo(trunkX + branchWidth, trunkY + 10- branchWidth);
      ctx.fill();
    }

    const generateCumulusCloud = () => {
      let scale = 10;
      let size = 200;
      let posx = 200;
      let posy = 300;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const l1 = noise.perlin2(x / scale, y / scale) * 0.5;
          const l2 = noise.perlin2(x / 32, y / 32) * 0.5;
          const l3 = noise.perlin2(x, y) * 0.5;

          let value = l1 + l2 + l3 + l2;
          const alpha = ((value + 1) / 2);

          ctx.fillStyle = `rgba(${alpha * 255}, ${alpha * 255}, ${alpha * 255}, ${alpha})`;
          ctx.fillRect(x + posx, y + posy, 1, 1);
        }
      }
    }

    const generateRandomMountain = async (slice=50) => {
      let mountain = {
        heights: [],
        trueWidth: 0,
        trueHeight: 0,
        slice
      }

      let terrain = 'tifs/agri-medium-dem.tif'
      const terrainResponse = await fetch(terrain);
      const terrainBlob = await terrainResponse.blob();
      const rawTiff = await fromBlob(terrainBlob);
      const tifImage = await rawTiff.getImage();
      const tifTags = tifImage.getBoundingBox();
      console.log(tifTags)

      const imageWidth = tifImage.getWidth();
      const imageHeight = tifImage.getHeight();
      console.log(imageWidth, imageHeight)

      const rawElevationData = await tifImage.readRasters({
        interleave: true,
        width: 60,
        height: 50,
      });

      const minValue = Math.min(...rawElevationData);
      const maxValue = Math.max(...rawElevationData);
      const elevationData = rawElevationData.map((value) => Math.pow((value - minValue) / (maxValue - minValue), 2));  

      let line = getRowOrColumn(elevationData, 60, 50, slice, true);
      mountain.heights = line;
      mountains.push(mountain);
    }

    let requestId;
    let lastTimestamp = 0;
    
    const resizeCanvas = () => {
      const container = canvas.parentNode;
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * devicePixelRatio;
      canvas.height = container.clientHeight * devicePixelRatio;
    };

    function lerp(start, end, t) {
      return start * (1 - t) + end * t;
    }

    const drawMountains = () => {
      let darkenFactor = 0.2/mountains.length;
      let desatFactor = 0.2/mountains.length;
      let colors = mountains.map((m, i) => { 
        return desaturate(lighten('#30130f', i * darkenFactor), i * desatFactor)
      }).reverse()

      let heightOffset = 40;
      let mountainCount = mountains.length

      mountains.forEach((m, im) => {
        let scaleFactor = 0.35 * (canvas.height - (heightOffset * (mountainCount + 1 - im)));
        let top = canvas.height;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        m.heights.forEach((h, i) => {
          let nh = (canvas.height - (h * scaleFactor)) - (heightOffset * (mountainCount + 1 - im))
          
          if(nh < top){
            top = nh;
          }
          let x = canvas.width * i / 50;

          ctx.lineTo(x, nh);
          if(i == m.heights.length - 1){
            ctx.lineTo(canvas.width, nh);
          }
        })
  
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
  
        if(im == mountainCount-1){
          ctx.fillStyle = colors[im];
          ctx.fill();
        } else {
          const gradient = ctx.createLinearGradient(0, top, 0, canvas.height);
          gradient.addColorStop(0.25, colors[im]);
          gradient.addColorStop(1.0, lighten(colors[im], 0.075));
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        m.heights.forEach((h, i) => {
          if(i !== 0){
            let x1 = canvas.width * (i - 1) / 50;
            let y1 = (canvas.height - (m.heights[i-1] * scaleFactor)) - (heightOffset * (mountainCount + 1 - im))

            let x2 = canvas.width * i / 50;
            let y2 = (canvas.height - (h * scaleFactor)) - (heightOffset * (mountainCount + 1 - im))

            if(h < 0.5){
              for (let i = 0; i <= 20 * (mountainCount - im + 1); i++) {
                const t = i / (20);
                const x = lerp(x1, x2, t);
                const y = lerp(y1, y2, t);
                drawTree(0.075 * im * im, x, y + Math.random() * 100)
              }
            }
        }
        })

      })
    }

    const fillSky = () => {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0.1, "#112644");
      skyGradient.addColorStop(0.25, "#ff7c2a");
      skyGradient.addColorStop(0.45, "#ff8000");
      skyGradient.addColorStop(0.65, "#ffb300");
      skyGradient.addColorStop(1, "#f39b41"); 
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);



      var gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width/5);
      gradient.addColorStop(0, "rgb(254, 238, 202, 1)");
      gradient.addColorStop(1, "rgb(254, 238, 202, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width/5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "#feeeca";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width/10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }


    const draw = (timestamp) => {
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      // fillSky();
      requestId = requestAnimationFrame(draw);
    };


    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    fillSky();

    const promises = [];

    promises.push(generateRandomMountain(45));
    promises.push(generateRandomMountain(35));
    promises.push(generateRandomMountain(25));
    promises.push(generateRandomMountain(15));
    promises.push(generateRandomMountain(5));

    Promise.all(promises).then(() => {
      mountains.sort((a, b) => b.slice - a.slice);

      drawMountains();
    });

    

    // generateCumulusCloud();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
      <canvas ref={canvasRef}></canvas>
  );
};

export default BottomCanvas;