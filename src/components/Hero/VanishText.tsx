"use client";

import { useRef, useState } from "react";

export default function VanishText() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getResponsiveFont = () => {
    const width = window.innerWidth;

    if (width < 640) return "bold 4.5rem Gunsan, Arial, sans-serif"; // sm:text-7xl
    if (width < 768) return "bold 6rem Gunsan, Arial, sans-serif"; // md:text-8xl
    if (width < 1024) return "bold 8rem Gunsan, Arial, sans-serif"; // lg:text-9xl
    return "bold 13rem Gunsan, Arial, sans-serif"; // xl:text-[13rem]
  };

  const vanish = () => {
    if (!visible || fading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const text = "Mech Drone";

    // responsive canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // apply responsive font
    ctx.font = getResponsiveFont();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }[] = [];

    for (let y = 0; y < canvas.height; y += 3) {
      for (let x = 0; x < canvas.width; x += 3) {
        const idx = (y * canvas.width + x) * 4;
        const alpha = pixels[idx + 3];
        if (alpha > 0) {
          particles.push({
            x,
            y,
            r: 2,
            vx: (Math.random() - 0.5) * 1.4,
            vy: (Math.random() - 0.5) * 1.4,
            alpha: 1,
            color: `rgb(${pixels[idx]},${pixels[idx + 1]},${pixels[idx + 2]})`,
          });
        }
      }
    }

    setFading(true);
    setTimeout(() => setVisible(false), 300);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.replace("rgb(", "").replace(")", "")},${
          p.alpha
        })`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        p.r *= 0.985;
        p.alpha *= 0.96;
      });

      particles = particles.filter((p) => p.alpha > 0.05);
      if (particles.length > 0) requestAnimationFrame(animate);
    };
    animate();

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setVisible(true);
      setTimeout(() => setFading(false), 500);
    }, 7000);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center min-h-screen overflow-hidden z-50">
      {visible && (
        <h1
          onClick={vanish}
          className={`text-white font-bold cursor-pointer z-10 transition-opacity duration-500 
            text-7xl sm:text-8xl md:text-9xl lg:text-[13rem] ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          style={{ fontFamily: "Gunsan, Arial, sans-serif" }}
        >
          Mech Drone
        </h1>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mx-auto my-auto z-20 pointer-events-none"
      />
    </div>
  );
}
