// import React, { useEffect, useRef } from "react";
// import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

// interface ParticlesProps {
//   particleCount?: number;
//   particleSpread?: number;
//   speed?: number;
//   particleColors?: string[];
//   moveParticlesOnHover?: boolean;
//   particleHoverFactor?: number;
//   alphaParticles?: boolean;
//   particleBaseSize?: number;
//   sizeRandomness?: number;
//   cameraDistance?: number;
//   disableRotation?: boolean;
//   className?: string;

//   /** New */
//   autoRepulsion?: boolean;
//   repulsionStrength?: number;
//   repulsionRadius?: number;
// }

// const defaultColors: string[] = ["#ffffff", "#ffffff", "#ffffff"];

// const hexToRgb = (hex: string): [number, number, number] => {
//   hex = hex.replace(/^#/, "");
//   if (hex.length === 3) {
//     hex = hex
//       .split("")
//       .map((c) => c + c)
//       .join("");
//   }
//   const int = parseInt(hex, 16);
//   const r = ((int >> 16) & 255) / 255;
//   const g = ((int >> 8) & 255) / 255;
//   const b = (int & 255) / 255;
//   return [r, g, b];
// };

// const vertex = /* glsl */ `
//   attribute vec3 position;
//   attribute vec4 random;
//   attribute vec3 color;

//   uniform mat4 modelMatrix;
//   uniform mat4 viewMatrix;
//   uniform mat4 projectionMatrix;
//   uniform float uBaseSize;
//   uniform float uSizeRandomness;

//   varying vec4 vRandom;
//   varying vec3 vColor;

//   void main() {
//     vRandom = random;
//     vColor = color;

//     vec3 pos = position;

//     vec4 mPos = modelMatrix * vec4(pos, 1.0);
//     vec4 mvPos = viewMatrix * mPos;

//     if (uSizeRandomness == 0.0) {
//       gl_PointSize = uBaseSize;
//     } else {
//       gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
//     }

//     gl_Position = projectionMatrix * mvPos;
//   }
// `;

// const fragment = /* glsl */ `
//   precision highp float;

//   uniform float uTime;
//   uniform float uAlphaParticles;
//   varying vec4 vRandom;
//   varying vec3 vColor;

//   void main() {
//     vec2 uv = gl_PointCoord.xy;
//     float d = length(uv - vec2(0.5));

//     if(uAlphaParticles < 0.5) {
//       if(d > 0.5) {
//         discard;
//       }
//       gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
//     } else {
//       float circle = smoothstep(0.5, 0.4, d) * 0.8;
//       gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
//     }
//   }
// `;

// const GalaxyParticles: React.FC<ParticlesProps> = ({
//   particleCount = 200,
//   particleSpread = 10,
//   speed = 0.1,
//   particleColors,
//   moveParticlesOnHover = false,
//   particleHoverFactor = 1,
//   alphaParticles = false,
//   particleBaseSize = 100,
//   sizeRandomness = 1,
//   cameraDistance = 20,
//   disableRotation = false,
//   className,

//   autoRepulsion = false,
//   repulsionStrength = 0.5,
//   repulsionRadius = 0.5,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
//   const stateRef = useRef<{
//     positions: Float32Array;
//     velocities: Float32Array;
//   } | null>(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const renderer = new Renderer({ depth: false, alpha: true });
//     const gl = renderer.gl;
//     container.appendChild(gl.canvas);
//     gl.clearColor(0, 0, 0, 0);

//     const camera = new Camera(gl, { fov: 15 });
//     camera.position.set(0, 0, cameraDistance);

//     const resize = () => {
//       const width = container.clientWidth;
//       const height = container.clientHeight;
//       renderer.setSize(width, height);
//       camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
//     };
//     window.addEventListener("resize", resize, false);
//     resize();

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = container.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
//       mouseRef.current = { x, y };
//     };
//     if (moveParticlesOnHover || autoRepulsion) {
//       container.addEventListener("mousemove", handleMouseMove);
//     }

//     const count = particleCount;
//     const positions = new Float32Array(count * 3);
//     const initialXY = new Float32Array(count * 2);
//     const velocities = new Float32Array(count * 3);
//     const randoms = new Float32Array(count * 4);
//     const colors = new Float32Array(count * 3);
//     const palette =
//       particleColors && particleColors.length > 0
//         ? particleColors
//         : defaultColors;

//     // Restore state if available
//     if (stateRef.current) {
//       positions.set(stateRef.current.positions);
//       velocities.set(stateRef.current.velocities);
//     } else {
//       for (let i = 0; i < count; i++) {
//         const x = (Math.random() - 0.5) * particleSpread;
//         const y = (Math.random() - 0.5) * particleSpread;
//         // Spawn much deeper so it looks good from frame 1
//         const z = Math.random() * cameraDistance * 4 - cameraDistance * 3;
//         positions.set([x, y, z], i * 3);
//         initialXY.set([x, y], i * 2);

//         randoms.set(
//           [Math.random(), Math.random(), Math.random(), Math.random()],
//           i * 4
//         );
//         const col = hexToRgb(
//           palette[Math.floor(Math.random() * palette.length)]
//         );
//         colors.set(col, i * 3);
//       }
//     }

//     const geometry = new Geometry(gl, {
//       position: { size: 3, data: positions },
//       random: { size: 4, data: randoms },
//       color: { size: 3, data: colors },
//     });

//     const program = new Program(gl, {
//       vertex,
//       fragment,
//       uniforms: {
//         uTime: { value: 0 },
//         uBaseSize: { value: particleBaseSize },
//         uSizeRandomness: { value: sizeRandomness },
//         uAlphaParticles: { value: alphaParticles ? 1 : 0 },
//       },
//       transparent: true,
//       depthTest: false,
//     });

//     const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

//     let animationFrameId: number;
//     let lastTime = performance.now();
//     let elapsed = 0;

//     const update = (t: number) => {
//       animationFrameId = requestAnimationFrame(update);
//       const delta = t - lastTime;
//       lastTime = t;
//       elapsed += delta * speed;
//       program.uniforms.uTime.value = elapsed * 0.001;

//       const pos = geometry.attributes.position.data as Float32Array;
//       const vel = velocities;
//       const dt = delta * 0.001;

//       let needsUpdate = false;

//       // Repulsion + hover physics
//       if (autoRepulsion || moveParticlesOnHover) {
//         needsUpdate = true;
//         if (autoRepulsion) {
//           const radiusSq = repulsionRadius * repulsionRadius;
//           const attractionStrength = 0.0005;
//           for (let i = 0; i < count; i++) {
//             let fx = 0,
//               fy = 0,
//               fz = 0;
//             const ix = i * 3;
//             const px = pos[ix],
//               py = pos[ix + 1],
//               pz = pos[ix + 2];
//             for (let j = 0; j < count; j++) {
//               if (i === j) continue;
//               const jx = j * 3;
//               const dx = pos[jx] - px;
//               const dy = pos[jx + 1] - py;
//               const dz = pos[jx + 2] - pz;
//               const distSq = dx * dx + dy * dy + dz * dz;
//               if (distSq < radiusSq && distSq > 0.0001) {
//                 const dist = Math.sqrt(distSq);
//                 let force = repulsionStrength / (dist * dist);
//                 force /= count - 1;
//                 fx += (dx / dist) * force;
//                 fy += (dy / dist) * force;
//                 fz += (dz / dist) * force;
//               }
//             }
//             fx -= px * attractionStrength;
//             fy -= py * attractionStrength;
//             fz -= pz * attractionStrength * 0.1;
//             vel[ix] += fx * dt;
//             vel[ix + 1] += fy * dt;
//             vel[ix + 2] += fz * dt;
//           }
//         }
//         if (moveParticlesOnHover) {
//           const mx = mouseRef.current.x * (particleSpread / 2);
//           const my = mouseRef.current.y * (particleSpread / 2);
//           const mouseRadiusSq = repulsionRadius * repulsionRadius;
//           const mouseForceMag = particleHoverFactor;
//           for (let i = 0; i < count; i++) {
//             const ix = i * 3;
//             const dx = mx - pos[ix];
//             const dy = my - pos[ix + 1];
//             const distSq = dx * dx + dy * dy;
//             if (distSq < mouseRadiusSq && distSq > 0.0001) {
//               const dist = Math.sqrt(distSq);
//               let force = mouseForceMag / dist;
//               const fx = (dx / dist) * force;
//               const fy = (dy / dist) * force;
//               vel[ix] += fx * dt;
//               vel[ix + 1] += fy * dt;
//             }
//           }
//         }
//         for (let i = 0; i < count; i++) {
//           const ix = i * 3;
//           vel[ix] *= 0.99;
//           vel[ix + 1] *= 0.99;
//           vel[ix + 2] *= 0.99;
//           pos[ix] += vel[ix] * dt * 50;
//           pos[ix + 1] += vel[ix + 1] * dt * 50;
//           pos[ix + 2] += vel[ix + 2] * dt * 50;
//         }
//       }

//       // Warp effect
//       // Startup boost: faster for first 2 seconds
//       const boostFactor = elapsed < 2000 ? 3 : 1;
//       const warpSpeed = 150 * speed * boostFactor;
//       for (let i = 0; i < count; i++) {
//         const ix = i * 3;
//         pos[ix + 2] += warpSpeed * dt;
//         if (pos[ix + 2] > cameraDistance) {
//           pos[ix + 2] = -cameraDistance * 3;
//           const ixy = i * 2;
//           pos[ix] = initialXY[ixy];
//           pos[ix + 1] = initialXY[ixy + 1];
//         }
//         needsUpdate = true;
//       }

//       if (needsUpdate) {
//         geometry.attributes.position.needsUpdate = true;
//       }

//       if (!disableRotation) {
//         particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
//         particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
//         particles.rotation.z += 0.01 * speed;
//       }

//       renderer.render({ scene: particles, camera });
//     };

//     animationFrameId = requestAnimationFrame(update);

//     return () => {
//       window.removeEventListener("resize", resize);
//       if (moveParticlesOnHover || autoRepulsion) {
//         container.removeEventListener("mousemove", handleMouseMove);
//       }
//       cancelAnimationFrame(animationFrameId);
//       // Save state before cleanup
//       stateRef.current = {
//         positions: new Float32Array(
//           geometry.attributes.position.data as Float32Array
//         ),
//         velocities: new Float32Array(velocities),
//       };
//       if (container.contains(gl.canvas)) {
//         container.removeChild(gl.canvas);
//       }
//     };
//   }, [
//     particleCount,
//     particleSpread,
//     speed,
//     particleColors,
//     moveParticlesOnHover,
//     particleHoverFactor,
//     alphaParticles,
//     particleBaseSize,
//     sizeRandomness,
//     cameraDistance,
//     disableRotation,
//     autoRepulsion,
//     repulsionStrength,
//     repulsionRadius,
//   ]);

//   return (
//     <div ref={containerRef} className={`relative w-full h-full ${className}`} />
//   );
// };

// export default GalaxyParticles;
