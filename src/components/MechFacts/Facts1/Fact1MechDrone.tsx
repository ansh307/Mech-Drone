import * as THREE from "three";
import React, { JSX, useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  materials: {
    Fire: THREE.MeshStandardMaterial;
    Robot: THREE.MeshStandardMaterial;
  };
};

// type ActionName = "Take 001";
// type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Fact1MechDrone(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);

  // ✅ Load base GLTF
  const { scene, animations } = useGLTF(
    "/model/scene.gltf"
  ) as unknown as GLTFResult;

  // ✅ Deep clone to avoid shared refs
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // ✅ Animations bound to the cloned scene
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].reset().play();
    }
  }, [actions]);

  // ✅ Load Robot textures
  const robotTextures = useTexture({
    map: "/model/textures/Robot_diffuse.jpeg",
    emissiveMap: "/model/textures/Robot_emissive.jpeg",
    normalMap: "/model/textures/Robot_normal.jpeg",
    aoMap: "/model/textures/Robot_occlusion.png",
    roughnessMap: "/model/textures/Robot_specularGlossiness.png",
  });

  robotTextures.map.flipY = false;
  robotTextures.emissiveMap.flipY = false;
  robotTextures.normalMap.flipY = false;
  robotTextures.aoMap.flipY = false;

  // ✅ Load Fire textures
  const fireTextures = useTexture({
    map: "/model/textures/Fire_diffuse.png",
    emissiveMap: "/model/textures/Fire_emissive.jpeg",
  });

  // ✅ Apply textures/materials on the clonedScene instead of global materials
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;

        if (mat?.name === "Robot") {
          mat.map = robotTextures.map;
          mat.normalMap = robotTextures.normalMap;
          mat.aoMap = robotTextures.aoMap;
          mat.emissiveMap = robotTextures.emissiveMap;
          mat.emissive = new THREE.Color(0xffffff);
          mat.roughnessMap = robotTextures.roughnessMap;
          mat.metalness = 0.8;
          mat.roughness = 0.4;
          mat.needsUpdate = true;
        }

        if (mat?.name === "Fire") {
          mat.map = fireTextures.map;
          mat.emissiveMap = fireTextures.emissiveMap;
          mat.emissive = new THREE.Color(0xff6600);
          mat.emissiveIntensity = 2;
          mat.transparent = true;
          mat.depthWrite = false;
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, robotTextures, fireTextures]);

  // ✅ Animate fire flicker (works per-instance now)
  useFrame((state) => {
    clonedScene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat?.name === "Fire") {
          mat.emissiveIntensity =
            2 +
            Math.sin(state.clock.elapsedTime * 15) * 0.7 +
            Math.sin(state.clock.elapsedTime * 7) * 0.3;
        }
      }
    });
  });

  return <primitive ref={group} object={clonedScene} {...props} />;
}

useGLTF.preload("/model/scene.gltf");
