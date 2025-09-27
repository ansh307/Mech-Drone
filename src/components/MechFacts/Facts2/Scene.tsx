"use client";

import { Environment, useTexture } from "@react-three/drei";
import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Fact1MechDrone } from "@/components/MechFacts/Facts1/Fact1MechDrone";
import { useFrame } from "@react-three/fiber";

type Props = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const Scene = forwardRef<{ changeTexture: () => void }, Props>(
  ({ containerRef }, ref) => {
    const drone1Ref = useRef<THREE.Group>(null);
    const moonRef = useRef<THREE.Mesh>(null);

    const moonTextures = useTexture([
      "/textures/JyupiterTexture.jpg",
      "/textures/MoonTexture.jpg",
      "/textures/ErisTexture.jpg",
      "/textures/CeresTexture.jpg",
    ]);

    const [textureIndex, setTextureIndex] = useState(0);

    // expose method to parent
    useImperativeHandle(ref, () => ({
      changeTexture: () =>
        setTextureIndex((prev) =>
          prev === moonTextures.length - 1 ? 0 : prev + 1
        ),
    }));

    // GSAP animation (runs only once)
    useEffect(() => {
      if (!drone1Ref.current || !moonRef.current || !containerRef.current)
        return;

      gsap.set(drone1Ref.current.position, { y: -15 });
      gsap.set(drone1Ref.current.rotation, { z: -Math.PI / 6 });
      gsap.set(moonRef.current.position, { x: -55, y: -90 });

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
          },
          duration: 3,
        }
      );

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
          },
          duration: 3,
          delay: 1,
        }
      );
    }, []);

    // 🌙 Rotate moon
    useFrame((_, delta) => {
      if (moonRef.current) {
        moonRef.current.rotation.y += delta * 0.05;
      }
    });

    return (
      <group>
        <Environment files="/hdr/warehouse-256.hdr" />

        {/* Drone */}
        <group scale={[110, 110, 110]} ref={drone1Ref}>
          <Fact1MechDrone />
        </group>

        {/* Moon */}
        <mesh position={[20, -15, -10]} scale={[90, 90, 90]} ref={moonRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial map={moonTextures[textureIndex]} />
        </mesh>
      </group>
    );
  }
);

Scene.displayName = "Scene";
export default Scene;
