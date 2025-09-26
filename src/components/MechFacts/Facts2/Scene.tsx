"use client";

import { Environment, useTexture } from "@react-three/drei";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Fact1MechDrone } from "@/components/MechFacts/Facts1/Fact1MechDrone";
import { useFrame } from "@react-three/fiber";

type Props = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function Scene({ containerRef }: Props) {
  const drone1Ref = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  // Load multiple moon textures
  const moonTextures = useTexture([
    "/textures/JyupiterTexture.jpg",
    "/textures/SaturnTexture.jpg",
    "/textures/MoonTexture.jpg",
    "/textures/ErisTexture.jpg",
    "/textures/CeresTexture.jpg",
  ]);

  const [textureIndex, setTextureIndex] = useState(2);

  useEffect(() => {
    if (!drone1Ref.current || !moonRef.current || !containerRef.current) return;

    gsap.set(drone1Ref.current.position, { y: -15 });
    gsap.set(drone1Ref.current.rotation, { z: -Math.PI / 6 });
    gsap.set(moonRef.current.position, { x: -55, y: -90 });

    // Drone entrance animation
    gsap.fromTo(
      drone1Ref.current.position,
      { x: -75, y: -90 },
      {
        x: 0,
        y: -15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top-=80%",
          toggleActions: "play none none reverse",
          // markers: true,
        },
        duration: 3,
      }
    );

    // Moon entrance animation
    gsap.fromTo(
      moonRef.current.position,
      { x: -125, y: -140 },
      {
        x: -55,
        y: -90,

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top-=80%",
          toggleActions: "play none none reverse",
          // markers: true,
        },
        duration: 3,
        delay: 1,
      }
    );
  }, [containerRef]);

  // 🌙 Rotate moon
  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05;
    }
  });

  const handleMoonClick = () => {
    setTextureIndex((prev) => (prev + 1) % moonTextures.length);
    console.log("🌙 Moon clicked!");
  };

  return (
    <group>
      <Environment files="/hdr/warehouse-256.hdr" />

      {/* Drone */}
      <group scale={[110, 110, 110]} ref={drone1Ref}>
        <Fact1MechDrone />
      </group>

      {/* Moon */}
      <mesh
        position={[20, -15, -10]}
        scale={[90, 90, 90]}
        ref={moonRef}
        onClick={handleMoonClick}
        onPointerOver={() => console.log("hovering moon")}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={moonTextures[textureIndex]} />
      </mesh>
    </group>
  );
}
