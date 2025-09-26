"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Particles from "./Particles";

interface MaskContainerProps {
  children?: string | React.ReactNode;
  revealText?: string | React.ReactNode;
  size?: number;
  revealSize?: number;
  toggle?: boolean;
  className?: string;
}

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  toggle,
  className,
}: MaskContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateMousePosition = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", updateMousePosition);

    return () => {
      container.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative h-screen", className)}
      animate={{
        backgroundColor: isHovered ? "var(--slate-900)" : "var(--white)",
      }}
      transition={{
        backgroundColor: { duration: 0.3 },
      }}
    >
      <motion.div
        className="absolute flex h-full w-full items-center justify-center text-6xl [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px]"
        style={{
          backgroundColor: toggle ? "black" : "white",
        }}
        animate={{
          maskPosition: `${mousePosition.x - maskSize / 2}px ${
            mousePosition.y - maskSize / 2
          }px`,
          maskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.3, ease: "easeInOut" },
          maskPosition: { duration: 0.15, ease: "linear" },
        }}
      >
        <div
          className="absolute inset-0 z-0 h-full w-full"
          style={{
            backgroundColor: toggle ? "white" : "black",
          }}
        />
        {/* Particles layer */}
        {!toggle && (
          <div className="absolute inset-0 z-10">
            <Particles
              particleColors={["#ffffff", "#ffffff"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
            />
          </div>
        )}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold"
        >
          {children}
        </div>
      </motion.div>

      <div className="flex h-full w-full items-center justify-center">
        {revealText}
        {toggle && (
          <div className="absolute inset-0 -z-10">
            <Particles
              particleColors={["#ffffff", "#ffffff"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={80}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
