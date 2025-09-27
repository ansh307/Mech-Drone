"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Fact1MechDrone } from "@/components/MechFacts/Facts1/Fact1MechDrone";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

type Props = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  animationIndex: number;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Scene({
  containerRef,
  animationIndex,
  setIsAnimating,
}: Props) {
  const droneRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!droneRef.current || !containerRef.current) return;

    // kill previous animations
    gsap.killTweensOf(droneRef.current.position);
    gsap.killTweensOf(droneRef.current.rotation);

    // Drone entrance animation
    const EntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 20%",
        end: "90% bottom",
        toggleActions: "play none none none",
      },
      onStart: () => setIsAnimating(true), // 🚀 disable button
      onComplete: () => setIsAnimating(false), // ✅ enable button
    });

    // Phase1
    if (animationIndex === 1) {
      // Pop up Animation
      EntranceTl.fromTo(
        droneRef.current.position,
        {
          x: 100,
          y: -100,
        },
        {
          x: 60,
          y: -40,
          // duration: 2,
        }
      );

      // Left Right Sight
      EntranceTl.to(droneRef.current.rotation, {
        y: Math.PI / 12,
        // delay: 1,
      });

      EntranceTl.fromTo(
        droneRef.current.rotation,
        {
          y: Math.PI / 12,
        },
        {
          y: Math.PI / 4,
        },
        "-=1"
      );

      EntranceTl.to(droneRef.current.rotation, {
        y: Math.PI / 4,
      });

      // Moving To point A with parabolic trajectory
      EntranceTl.to(droneRef.current.position, {
        duration: 2,
        ease: "power1.inOut",
        motionPath: {
          path: [
            { x: 60, y: -40, z: 0 }, // start
            { x: 30, y: -50, z: -30 }, // control point (arc peak)
            { x: 0, y: -10, z: -60 }, // end
          ],
          curviness: 1.5,
        },
      });

      EntranceTl.to(
        droneRef.current.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
        },
        "-=1"
      );
    }

    // Phase2
    if (animationIndex === 2) {
      EntranceTl.to(droneRef.current.position, {
        duration: 2,
        ease: "power1.inOut",
        motionPath: {
          path: [
            { x: 0, y: -10, z: -60 }, // start
            { x: 15, y: -35, z: -75 }, // control point (arc peak)
            { x: 20, y: -15, z: -85 }, // end
          ],
          curviness: 1.5,
        },
      });

      EntranceTl.to(droneRef.current.rotation, {
        y: Math.PI / 4,
      });
    }

    // Phase3
    if (animationIndex === 3) {
      EntranceTl.to(droneRef.current.position, {
        x: -10,
        duration: 2,
        ease: "power1.inOut",
      });

      EntranceTl.to(droneRef.current.rotation, {
        y: -Math.PI / 4,
      });
    }

    // Phase4
    if (animationIndex === 4) {
      EntranceTl.to(droneRef.current.position, {
        x: 100,
        y: -140,
        duration: 2,
        ease: "power1.inOut",
      });
    }

    return () => {
      EntranceTl.kill(); // clean up when unmount or index change
    };
  }, [animationIndex, containerRef]);

  return (
    <group>
      <Environment files="/hdr/warehouse-256.hdr" />

      <group scale={[60, 60, 60]} position={[0, 0, 0]} ref={droneRef}>
        <Fact1MechDrone />
      </group>
      <OrbitControls />
    </group>
  );
}

// M 285 41 C 152 158 103 -30 32 140 (FOR MOTION PATH)
