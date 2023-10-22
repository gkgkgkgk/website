import React, { useEffect, useRef } from "react";
import paper from "paper";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    var paperScope1 = new paper.PaperScope();
    paperScope1.setup(canvasRef.current);

      let stars = [];

      let shootingStar = { starDot: null, x:0, y:0, directionX:0, directionY:0, speed:0 };
      let lastTimestamp = 0;

      let backgroundRect = new paperScope1.Path.Rectangle(
        paperScope1.view.bounds.topLeft,
        paperScope1.view.bounds.bottomRight
      );
      backgroundRect.fillColor = "black";

      const generateRandomStar = () => {
        const x = Math.random() * paperScope1.view.bounds.width;
        const y = Math.random() * Math.pow(paperScope1.view.bounds.height, 0.95);
        const radius = Math.random() * 2;
        const color = getRandomColor();
        const targetColor = color;
        const targetRadius = radius;

        const star = new paperScope1.Path.Circle(new paperScope1.Point(x, y), radius);
        star.fillColor = color;

        stars.push({ star, targetColor, targetRadius });
      };

      const generateShootingStar = () => {
          let x, y;
          const randSide = Math.floor(Math.random() * 3);
          let directionX = 0;
          let directionY = 0;

          switch (randSide) {
              case 0: // Top side
                  x = Math.random() * paperScope1.view.bounds.width;
                  y = 0;
                  directionY = 1;
                  directionX = Math.random() * 2 - 1;
              break;
              case 1: // Right side
                  x = paperScope1.view.bounds.width;
                  y = Math.random() * paperScope1.view.bounds.height;
                  directionX = -1;
                  directionY = Math.random() * 2 - 1;
              break;
              case 2: // Bottom side
                  x = 0;
                  y = Math.random() * paperScope1.view.bounds.height;
                  directionX = 1;
                  directionY = Math.random() * 2 - 1;
              break;
              default:
              break;
          }

          const speed = 1 + Math.random() * 1;
          shootingStar.x = x;
          shootingStar.y = y;
          shootingStar.directionX = directionX;
          shootingStar.directionY = directionY;
          shootingStar.speed = speed;
      };

      const getRandomColor = () => {
        const warmth = Math.random();
        let red = 255;
        let green = 0;
        let blue = 255;

        let c = Math.random() * 75 + 180;
        green = c;

        if (warmth < 0.5) {
          red = c;
        } else {
          blue = c;
        }

        return new paperScope1.Color(red / 255, green / 255, blue / 255);
      };

      const resizeCanvas = () => {
        console.log(canvasRef)
        paperScope1.view.viewSize = new paperScope1.Size(
          window.innerWidth,
          window.innerHeight
          // canvasRef.current.parentElement.width,
          // canvasRef.current.parentElement.height
        );
        backgroundRect.bounds.size = paperScope1.view.size
      };

      const fillSky = () => {
        const skyGradient = new paperScope1.Path.Rectangle(
          paperScope1.view.bounds.topLeft,
          paperScope1.view.bounds.bottomRight
        );
        skyGradient.fillColor = {
          gradient: {
            stops: [
              [new paperScope1.Color(0, 0, 0), 0],
              [new paperScope1.Color(12 / 255, 29 / 255, 37 / 255), 0.2],
              [new paperScope1.Color(55 / 255, 55 / 255, 154 / 255), 0.75],
              [new paperScope1.Color(121 / 255, 163 / 255, 236 / 255), 0.85],
              [new paperScope1.Color(255 / 255, 232 / 255, 178 / 255), 0.9],
              [new paperScope1.Color(243 / 255, 159 / 255, 63 / 255), 1],
            ],
            radial: false,
          },
        };
      };

      const animateStar = (star, deltaTime) => {
        if (Math.abs(star.star.bounds.width - star.targetRadius * 2) < 0.05) {
          if (Math.random() < 0.075) {
            star.targetRadius = Math.random() * 2;
          }
        } else {
          const currentRadius = star.star.bounds.width / 2;
          const newRadius = lerp(currentRadius, star.targetRadius, 2.5 * deltaTime);
          star.star.scale(newRadius / currentRadius);
        }
      };

      const animateShootingStar = (deltaTime) => {
          // shootingStar.x += shootingStar.directionX * shootingStar.speed * deltaTime;
          // shootingStar.y += shootingStar.directionY * shootingStar.speed * deltaTime;
          // console.log("x: ", shootingStar.directionX *  1000 * deltaTime)
          shootingStarGraphic.position.x += shootingStar.directionX;
          shootingStarGraphic.position.y += shootingStar.directionY; 

          if (
              shootingStar.x > paperScope1.view.bounds.width + 50 ||
              shootingStar.x < -50 ||
              shootingStar.y > paperScope1.view.bounds.height + 50 ||
              shootingStar.y < -50
          ) {
              generateShootingStar();
          }
      };

      const lerp = (start, end, t) => {
        t = Math.max(0, Math.min(1, t));
        return start + (end - start) * t;
      };

      const draw = (timestamp) => {
        // resizeCanvas();
        const deltaTime = (timestamp - lastTimestamp) / 1000.0;
        lastTimestamp = timestamp;
        // fillSky();

        for (let star of stars) {
          animateStar(star, deltaTime);
        }
        animateShootingStar(deltaTime);

        requestAnimationFrame(draw);
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      fillSky();

      generateShootingStar();

      let shootingStarGraphic = new paperScope1.Path.Circle(new paperScope1.Point(100, 100), 2);
      shootingStarGraphic.fillColor = "white";

      shootingStar.starDot = shootingStarGraphic;


      for (let i = 0; i < 50; i++) {
        generateRandomStar();
      }

      draw();

    return () => {
      paperScope1.remove();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} resize="true"></canvas>;
};

export default Canvas;