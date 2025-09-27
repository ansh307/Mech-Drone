"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  const getFontPxSize = () => {
    const fontStr = getResponsiveFont();
    const remMatch = fontStr.match(/(\d+(?:\.\d+)?)rem/);
    const remSize = remMatch ? parseFloat(remMatch[1]) : 100;
    return remSize * 16; // Approximate 1rem = 16px (standard assumption for canvas/CSS consistency)
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

    // Get text metrics for bounding box
    const textWidth = ctx.measureText(text).width;
    const approxFontPx = getFontPxSize();
    const halfHeight = approxFontPx * 0.6; // Approximate half-height for single-line text (adjust if needed)

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const left = Math.max(0, centerX - textWidth / 2 - 20); // Padding for bounds
    const right = Math.min(canvas.width, centerX + textWidth / 2 + 20);
    const top = Math.max(0, centerY - halfHeight - 20);
    const bottom = Math.min(canvas.height, centerY + halfHeight + 20);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const step = 5; // Increased step size to reduce particle count (trade-off: fewer but larger particles)
    let particles: {
      x: number;
      y: number;
      rad: number;
      vx: number;
      vy: number;
      alpha: number;
      colorR: number;
      colorG: number;
      colorB: number;
    }[] = [];

    // Limit loop to text bounding box only (major perf win: avoids full-screen scan)
    for (let y = top; y < bottom; y += step) {
      for (let x = left; x < right; x += step) {
        const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        const alpha = pixels[idx + 3];
        if (alpha > 0) {
          // Threshold can be raised to >128 for stricter text pixels
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          particles.push({
            x: Math.floor(x),
            y: Math.floor(y),
            rad: Math.random() * 1.5 + 0.5, // Smaller/variable radius (0.5-2) for perf
            vx: (Math.random() - 0.5) * 1.5, // Slightly reduced velocity
            vy: (Math.random() - 0.5) * 1.5,
            alpha: 1,
            colorR: r,
            colorG: g,
            colorB: b,
          });
        }
      }
    }

    // Optional: Cap max particles to prevent extreme cases (e.g., very large screens)
    if (particles.length > 1500) {
      particles = particles.slice(0, 1500);
    }

    setFading(true);
    setTimeout(() => setVisible(false), 300);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.rad *= 0.99; // Slightly slower radius decay for smoother feel
        p.alpha *= 0.97; // Slightly slower alpha decay
      });

      particles = particles.filter((p) => p.alpha > 0.05 && p.rad > 0.1);
      if (particles.length > 0) requestAnimationFrame(animate);
    };
    animate();

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setVisible(true);
      setTimeout(() => setFading(false), 500);
    }, 7000);
  };

  useEffect(() => {
    const dropTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#vanish-e",
        start: "top 20%",
        end: "90% bottom",
        toggleActions: "play none none none",
        // markers: true,
      },
    });

    const vanishEl = document.querySelector("#vanish-e");
    const HiddenGalaxySection = document.querySelector("#hidden-galaxy");
    if (!HiddenGalaxySection || !vanishEl) return;

    const rect = vanishEl.getBoundingClientRect();

    // Get the offset of the HiddenGalaxySection relative to the viewport
    const hiddenGalaxyTop = HiddenGalaxySection.getBoundingClientRect().top;

    // Calculate the position for 20% of the viewport height from the top of the HiddenGalaxySection
    const topDistanceFromHiddenGalaxy =
      (hiddenGalaxyTop + window.innerHeight * 0.2) / 10;

    console.log("From VanishText", rect.bottom + topDistanceFromHiddenGalaxy);

    // Drop animation
    dropTl.to("#vanish-e", {
      y: rect.bottom + topDistanceFromHiddenGalaxy,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });

    // Bounce animation
    dropTl.to("#vanish-e", {
      y: rect.bottom + topDistanceFromHiddenGalaxy + 50,
      duration: 0.6,
      ease: "bounce.out",
    });

    // Cleanup ScrollTrigger when component is unmounted
    return () => {
      dropTl.scrollTrigger?.kill();
    };
  }, []);

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
          Mech Dron
          <span id="vanish-e" className="inline-block">
            E
          </span>
        </h1>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mx-auto my-auto z-20 pointer-events-none"
      />
    </div>
  );
}
