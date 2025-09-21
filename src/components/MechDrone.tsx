import * as THREE from "three";
import React, { JSX, useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import GUI from "lil-gui";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Cone1_Fire_0: THREE.Mesh;
    Cone2_Fire_0: THREE.Mesh;
    Cone3_Fire_0: THREE.Mesh;
    Cone4_Fire_0: THREE.Mesh;
    ConeBleu_Fire_0: THREE.Mesh;
    ConeBleu001_Fire_0: THREE.Mesh;
    Cone005_Fire_0: THREE.Mesh;
    Cone006_Fire_0: THREE.Mesh;
    Cone007_Fire_0: THREE.Mesh;
    Cone008_Fire_0: THREE.Mesh;
    ConeBleu002_Fire_0: THREE.Mesh;
    Cone009_Fire_0: THREE.Mesh;
    Cone010_Fire_0: THREE.Mesh;
    Cone011_Fire_0: THREE.Mesh;
    Cone012_Fire_0: THREE.Mesh;
    Object_7: THREE.SkinnedMesh;
    _rootJoint: THREE.Bone;
  };
  materials: {
    Fire: THREE.MeshStandardMaterial;
    Robot: THREE.MeshStandardMaterial;
  };
};

type ActionName = "Take 001";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function MechDrone(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    "/model/scene.gltf"
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].reset().play();
    }
  }, [actions]);

  // useEffect(() => {
  //   // Create GUI
  //   const gui = new GUI();
  //   const materialFolder = gui.addFolder("Robot Material");

  //   // Add live controls
  //   materialFolder.add(materials.Robot, "roughness", 0, 1, 0.01);
  //   materialFolder.add(materials.Robot, "metalness", 0, 1, 0.01);
  //   materialFolder.addColor(materials.Robot, "color");

  //   materialFolder.open();

  //   return () => gui.destroy(); // Clean up on unmount
  // }, [materials.Robot]);

  // Load Robot textures
  const robotTextures = useTexture({
    map: "/model/textures/Robot_diffuse.jpeg",
    emissiveMap: "/model/textures/Robot_emissive.jpeg",
    normalMap: "/model/textures/Robot_normal.jpeg",
    aoMap: "/model/textures/Robot_occlusion.png",
    // spec/gloss not directly supported in MeshStandardMaterial,
    // you can use it as roughnessMap if you want
    roughnessMap: "/model/textures/Robot_specularGlossiness.png",
  });

  // useTextureDebug(robotTextures.map);

  robotTextures.map.flipY = false;
  robotTextures.emissiveMap.flipY = false;
  robotTextures.normalMap.flipY = false;
  robotTextures.aoMap.flipY = false;

  // Load Fire textures
  const fireTextures = useTexture({
    map: "/model/textures/Fire_diffuse.png",
    emissiveMap: "/model/textures/Fire_emissive.jpeg",
  });

  // Apply textures to materials
  useEffect(() => {
    // Robot
    materials.Robot.map = robotTextures.map;
    materials.Robot.normalMap = robotTextures.normalMap;
    materials.Robot.aoMap = robotTextures.aoMap;
    materials.Robot.emissiveMap = robotTextures.emissiveMap;
    materials.Robot.emissive = new THREE.Color(0xffffff); // subtle glow
    materials.Robot.roughnessMap = robotTextures.roughnessMap;
    materials.Robot.metalness = 0.8;
    materials.Robot.roughness = 0.4;
    materials.Robot.needsUpdate = true;

    // Fire
    materials.Fire.map = fireTextures.map;
    materials.Fire.emissiveMap = fireTextures.emissiveMap;
    materials.Fire.emissive = new THREE.Color(0xff6600);
    materials.Fire.emissiveIntensity = 2;
    materials.Fire.transparent = true;
    materials.Fire.depthWrite = false;
    materials.Fire.side = THREE.DoubleSide;
    materials.Fire.needsUpdate = true;
  }, [materials, robotTextures, fireTextures]);

  // Animate fire flicker
  useFrame((state) => {
    if (materials.Fire) {
      materials.Fire.emissiveIntensity =
        2 +
        Math.sin(state.clock.elapsedTime * 15) * 0.7 +
        Math.sin(state.clock.elapsedTime * 7) * 0.3;
    }
  });

  // console.log(nodes);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.002}
        >
          <group name="DroneFBX" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Object_4">
                  <primitive object={nodes._rootJoint} />
                  <skinnedMesh
                    name="Object_7"
                    geometry={nodes.Object_7.geometry}
                    material={materials.Robot}
                    skeleton={nodes.Object_7.skeleton}
                  />
                  <group name="Object_6" rotation={[-Math.PI / 2, 0, 0]} />
                  <group name="droid" rotation={[-Math.PI / 2, 0, 0]} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/model/scene.gltf");
