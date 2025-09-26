"use client";

import { Environment } from "@react-three/drei";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

import { Fact1MechDrone } from "./Fact1MechDrone";

export default function Scene() {
  const drone1Ref = useRef<THREE.Group>(null);
  const drone2Ref = useRef<THREE.Group>(null);

  useEffect(() => {
    const radius = 8;
    let angle = 0;

    // Hover animation
    // gsap.to(drone1Ref.current!.position, {
    //   y: "+=0.5",
    //   duration: 2,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // });

    // gsap.to(drone2Ref.current!.position, {
    //   y: "+=0.5",
    //   duration: 2,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // });

    // Orbit motion
    const update = () => {
      angle += 0.01;

      if (drone1Ref.current) {
        // Orbiting counter-clockwise
        drone1Ref.current.position.x = Math.cos(angle) * radius * 2;
        drone1Ref.current.position.z = Math.sin(angle) * radius * 2;
        drone1Ref.current.position.y = Math.cos(angle) * radius * 1.5 - 13;

        // Face direction of movement
        drone1Ref.current.rotation.y = -angle + Math.PI / 2;
      }

      if (drone2Ref.current) {
        // Orbiting clockwise (opposite phase)
        drone2Ref.current.position.x = Math.cos(angle + Math.PI) * radius * 2;
        drone2Ref.current.position.z = Math.sin(angle + Math.PI) * radius * 2;
        drone2Ref.current.position.y = -Math.cos(angle) * radius * 1.5 - 13;

        drone2Ref.current.rotation.y = -(angle + Math.PI) + Math.PI / 2;
      }
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <group>
      <Environment files="/hdr/warehouse-256.hdr" />

      {/* Drone 1 */}
      <group scale={[90, 90, 90]} ref={drone1Ref}>
        <Fact1MechDrone />
      </group>

      {/* Drone 2 */}
      <group scale={[90, 90, 90]} ref={drone2Ref}>
        <Fact1MechDrone />
      </group>
    </group>
  );
}
