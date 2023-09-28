import React, { useEffect, useRef } from "react";
import "./styles.css";

const TopCanvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let requestId;
    let lastTimestamp = 0;
    let stars = [];
    let shootingStar = null;
    function randomBimodal() {
      const randomValue = Math.random();
      if (randomValue < 0.5) {
        return Math.pow(-Math.log(1 - Math.random()), 3.0);
      } else {
        return 1-Math.pow(-Math.log(1-Math.random()), 3.0);
      }
    }
    
    const generateRandomStar = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * Math.pow(canvas.height, 0.95);
      const radius = Math.random() * 2;
      const color = getRandomColor();
      const targetColor = color;
      const targetRadius = radius;

      stars.push({ x, y, radius, color, targetColor, targetRadius });
    };

    const generateShootingStar = () => {
      if(shootingStar === null){
        let x, y;
        const randSide = Math.floor(Math.random() * 3);
        let directionX = 0;
        let directionY = 0;

        switch (randSide) {
          case 0: // Top side
            x = Math.random() * canvas.width;
            y = 0;
            directionY = 1;
            directionX = Math.random() * 2 - 1;
            break;
          case 1: // Right side
            x = canvas.width;
            y = Math.random() * canvas.height;
            directionX = -1;
            directionY = Math.random() * 2 - 1;
            break;
          case 2: // Bottom side
            x = 0;
            y = Math.random() * canvas.height;
            directionX = 1;
            directionY = Math.random() * 2 - 1;
            break;
          default:
            break;
        }

        

        const speed = 750 + Math.random() * 500;

        shootingStar = {x, y, directionX, directionY, speed}
      }
    }

    function lerp(start, end, t) {
      t = Math.max(0, Math.min(1, t));
      
      return start + (end - start) * t;
    }

    const getRandomColor = () => {
      const warmth = Math.random();
      let red = 255;
      let green = 0;
      let blue = 255;

      let c = Math.random() * 75 + 180;
      green = c

      if(warmth < 0.5) {
        red = c
      } else {
        blue = c
      }
    
      return `rgb(${red},${green},${blue})`;
    };

    const resizeCanvas = () => {
      // Set canvas dimensions to match its container size
      const container = canvas.parentNode;
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * devicePixelRatio;
      canvas.height = container.clientHeight * devicePixelRatio;
    };

    const animateStar = (star, deltaTime) => {
      if(Math.abs(star.radius - star.targetRadius) < 0.05){
        if (Math.random() < 0.075) {
          star.targetRadius = Math.random() * 2;
        }
      } else {
        star.radius = lerp(star.radius, star.targetRadius, 2.5 * deltaTime);
      }

      return star;
    }

    const animateShootingStar = (deltaTime) => {
      shootingStar.x += shootingStar.directionX * shootingStar.speed * deltaTime;
      shootingStar.y += shootingStar.directionY * shootingStar.speed * deltaTime;

      if(shootingStar.x > canvas.width + 50 || shootingStar.x < -50
        || shootingStar.y > canvas.height + 50 || shootingStar.y < -50){
          shootingStar = null;
      }
    }

    const draw = (timestamp) => {
      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.closePath();
      }

      for (let star of stars){
        star = animateStar(star, deltaTime);
      }

      if(shootingStar != null){
        animateShootingStar(deltaTime);
      }

      if (shootingStar != null) {
        const { x, y, directionX, directionY } = shootingStar;
        const starLength = 75 + Math.random() * 50; // Length of the shooting star
      
        // Calculate the start and end points of the shooting star
        const startX = x - starLength * directionX;
        const startY = y - starLength * directionY;
        const endX = x + starLength * directionX;
        const endY = y + starLength * directionY;
      
        // Create a gradient for the shooting star's tail (you can customize colors)
        const gradient = ctx.createLinearGradient(startX, startY, x, y);
        gradient.addColorStop(1, "#ffffff"); // Start color
        gradient.addColorStop(0, "transparent"); // End color (transparent)
      
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 5; // Adjust line width as needed
        ctx.stroke();
        ctx.closePath();
      
        // Draw a small circle at the tip of the shooting star (you can customize the size)
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff"; // Circle color
        ctx.fill();
        ctx.closePath();
      }

      requestId = requestAnimationFrame(draw);
    };

    // Resize canvas when the window is resized
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial sizing

    // Generate stars and circles at the start
    for (let i = 0; i < 50; i++) {
      generateRandomStar();
    }

    setInterval(generateShootingStar, 5000);

    draw(); // Start the animation loop

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="topCanvasContainer">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default TopCanvas;