import React, { useEffect, useRef } from "react";
import {fromBlob} from 'geotiff'
import { darken, lighten } from 'color2k';

const BottomCanvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let requestId;
    let lastTimestamp = 0;
    
    const resizeCanvas = () => {
      const container = canvas.parentNode;
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * devicePixelRatio;
      canvas.height = container.clientHeight * devicePixelRatio;
    };

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

      requestId = requestAnimationFrame(draw);
    };


    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    fillSky();

    draw();

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