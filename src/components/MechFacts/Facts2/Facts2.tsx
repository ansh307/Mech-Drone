"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerspectiveCamera, View } from "@react-three/drei";
import Scene from "./Scene";

gsap.registerPlugin(ScrollTrigger);

const Facts2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ changeTexture: () => void }>(null);

  // const [textureIndex, setTextureIndex] = useState(0);

  // const handleTextureChange = () => {
  //   setTextureIndex((prev) => (prev === 3 ? 0 : prev + 1));
  // };

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row-reverse h-full bg-blue-500 text-white % z-10 ml-16 relative"
    >
      <button
        className="mx-4 px-2 py-2 absolute top-10 right-10 z-50 font-lausanne-300 cursor-pointer bg-transparent text-white hover:-translate-y-1 hover:scale-105 transition-all duration-300 active:scale-90 active:translate-y-2 active:animate-bounce"
        onClick={() => sceneRef.current?.changeTexture()}
      >
        Magic
      </button>

      {/* Model Section (Right on desktop) */}
      <div className="w-full md:w-2/5 flex justify-center items-center p-4">
        <div className=" relative w-full h-64 md:h-full flex justify-center items-center">
          <View className=" w-full h-full " style={{ pointerEvents: "auto" }}>
            <Scene containerRef={containerRef} ref={sceneRef} />
            <PerspectiveCamera position={[0, 0, 10]} fov={60} />
          </View>
        </div>
      </div>

      {/* Content Section (Left on desktop) */}
      <div className="w-full md:w-3/5 flex flex-col justify-center p-6 space-y-4">
        <h1 className="fact-title opacity-0 font-lausanne-400 text-3xl md:text-6xl mb-10">
          Design & Exploration
        </h1>
        <ul className="flex flex-col gap-8 facts-subs">
          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            Its exterior is reinforced to withstand micro-meteor impacts and
            radiation. Lightweight alloys allow agility without compromising
            durability.
          </li>
          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            Mech Drone can perform autonomous navigation in uncharted regions of
            space. It uses star tracking and environmental scanning to stay on
            course.
          </li>
          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            The drone is programmed to record and visualize cosmic phenomena
            creatively. This allows both scientific and aesthetic documentation.
          </li>

          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            Mech Drone maintains a careful balance between exploration and
            energy conservation. It prioritizes long-term sustainability on
            extended missions.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Facts2;
