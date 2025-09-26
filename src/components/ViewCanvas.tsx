"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { View } from "@react-three/drei";

// Main interactive component
export function ViewCanvas() {
  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          pointerEvents: "none", // wrapper
          zIndex: 20, // kept low
        }}
        // camera={{ position: [0, 30, -100], fov: 60 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{ position: [0, 30, -100], fov: 60 }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
    </>
  );
}
