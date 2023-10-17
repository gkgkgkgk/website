import React, { useEffect, useRef } from "react";
import "./styles.css";
import {fromBlob} from 'geotiff'
import { darken, lighten } from 'color2k';

const BottomCanvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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
      console.log(minValue, maxValue)
      const elevationData = rawElevationData.map((value) => (value - minValue) / (maxValue - minValue));  

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

    const drawMountains = () => {
      let darkenFactor = 0.15/mountains.length;
      let colors = mountains.map((m, i) => { 
        return lighten('#1f0d00', i * darkenFactor)
      }).reverse()

      let heightOffset = 50;
      let mountainCount = mountains.length

      mountains.forEach((m, im) => {
        let scaleFactor = canvas.width / m.heights.length * 50;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        m.heights.forEach((h, i) => {
          let nh = (canvas.height - h * scaleFactor) - (heightOffset * (mountainCount - im))
          ctx.lineTo(canvas.width * i / 50, nh);
          if(i == m.heights.length - 1){
            ctx.lineTo(canvas.width, nh);
          }
        })
  
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
  
        ctx.fillStyle = colors[im];
        ctx.fill();
      })
    }

    const fillSky = () => {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, "#37379a");
      skyGradient.addColorStop(0.5, "#37379a");
      skyGradient.addColorStop(0.65, "#bd413f");
      skyGradient.addColorStop(1, "#f39f3f"); 
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    const draw = (timestamp) => {
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      fillSky();
      drawMountains();

      requestId = requestAnimationFrame(draw);
    };


    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    fillSky();

    const promises = [];

    // promises.push(generateRandomMountain(97));
    // promises.push(generateRandomMountain(75));
    // promises.push(generateRandomMountain(25));
    promises.push(generateRandomMountain(49));
    promises.push(generateRandomMountain(15));
    promises.push(generateRandomMountain(0));

    Promise.all(promises).then(() => {
      mountains.sort((a, b) => b.slice - a.slice);

      draw();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="bottomCanvasContainer">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default BottomCanvas;