"use client";

import { OrbitControls, Environment } from "@react-three/drei";
import { MechDrone } from "@/components/MechDrone";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function MechDroneScene() {
  const groupRef = useRef<THREE.Group | null>(null);

  // mouse in NDC (-1..1)
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // note the inversion
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  const SPHERE_CENTER = new THREE.Vector3(0, -20, 0);
  const SPHERE_RADIUS = 20;
  const MOVE_SCALE_X = 15;
  const MOVE_SCALE_Y = 5;
  const MAX_YAW = Math.PI / 4;
  const MAX_PITCH = Math.PI / 12;
  const MAX_ROLL = Math.PI / 12;
  const BOB_AMPLITUDE = 2;
  const BOB_SPEED = 2;
  const ANTICIPATION_FACTOR = 0.2;
  const DAMPING = 0.1;
  const Z_SWAY_FACTOR = 10; // how much it drifts forward/backward based on vertical speed

  // Track previous mouse position
  const prevMouse = useRef(new THREE.Vector2(0, 0));

  // Track smoothed mouse velocity for damping
  const smoothVel = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const obj = groupRef.current;
    if (!obj) return;

    // --- Mouse velocity ---
    const rawVel = new THREE.Vector2(
      mouse.current.x - prevMouse.current.x,
      mouse.current.y - prevMouse.current.y
    );
    prevMouse.current.set(mouse.current.x, mouse.current.y);

    // --- Smooth velocity for damping ---
    smoothVel.current.lerp(rawVel, DAMPING);

    // --- Target position with subtle movement ---
    const targetOffset = new THREE.Vector3(
      mouse.current.x * MOVE_SCALE_X,
      mouse.current.y * MOVE_SCALE_Y,
      0
    );
    if (targetOffset.length() > SPHERE_RADIUS)
      targetOffset.setLength(SPHERE_RADIUS);

    // --- Add bobbing and Z-axis sway based on vertical speed ---
    const bob = Math.sin(state.clock.elapsedTime * BOB_SPEED) * BOB_AMPLITUDE;
    const zSway = -smoothVel.current.y * Z_SWAY_FACTOR; // forward/back drift
    const targetPos = SPHERE_CENTER.clone()
      .add(targetOffset)
      .add(new THREE.Vector3(0, bob, zSway));

    obj.position.lerp(targetPos, 0.05);

    // --- LookAt target ---
    const lookTarget = SPHERE_CENTER.clone().add(
      new THREE.Vector3(
        -mouse.current.x * SPHERE_RADIUS,
        mouse.current.y * SPHERE_RADIUS,
        50
      )
    );

    const lookQuat = new THREE.Quaternion();
    lookQuat.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(obj.position, lookTarget, obj.up)
    );

    // --- Distance from center (0,0) in NDC ---
    const distanceFromCenter = mouse.current.length(); // scales 0..~1.4

    // Scale max rotations based on distance
    const yawFactor = distanceFromCenter * MAX_YAW;
    const pitchFactor = distanceFromCenter * MAX_PITCH;
    const rollFactor = distanceFromCenter * MAX_ROLL;

    // Base look rotation
    const euler = new THREE.Euler().setFromQuaternion(lookQuat, "YXZ");

    // Clamp yaw to scaled factor
    euler.y = THREE.MathUtils.clamp(euler.y, -yawFactor, yawFactor);

    // Apply pitch/roll scaled by distance
    euler.x += -mouse.current.y * pitchFactor;
    euler.z += -mouse.current.x * rollFactor;

    // Anticipation from smoothed velocity
    euler.x += -smoothVel.current.y * ANTICIPATION_FACTOR;
    euler.z += -smoothVel.current.x * ANTICIPATION_FACTOR;

    lookQuat.setFromEuler(euler);
    obj.quaternion.slerp(lookQuat, 0.12);
  });

  return (
    <group>
      {/* Keep controls but disable camera rotation so the model follow is not fought by OrbitControls */}
      <OrbitControls />
      <Environment files="/hdr/warehouse-256.hdr" />

      {/* Drone group (ref used for rotation and plane height) */}
      <group ref={groupRef} scale={[120, 120, 120]} position={[0, -50, 0]}>
        <MechDrone />
      </group>
    </group>
  );
}
