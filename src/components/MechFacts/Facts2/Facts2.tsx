"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerspectiveCamera, View } from "@react-three/drei";
import Scene from "./Scene";

gsap.registerPlugin(ScrollTrigger);

const Facts2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row-reverse h-full bg-blue-500 text-white % z-10"
    >
      {/* Model Section (Right on desktop) */}
      <div className="w-full md:w-2/5 flex justify-center items-center p-4">
        <div className=" relative w-full h-64 md:h-full flex justify-center items-center">
          <View className=" w-full h-full " style={{ pointerEvents: "auto" }}>
            <Scene containerRef={containerRef} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} />
            <PerspectiveCamera position={[0, 0, 10]} fov={60} />
          </View>
        </div>
      </div>

      {/* Content Section (Left on desktop) */}
      <div className="w-full md:w-3/5 flex flex-col justify-center p-6 space-y-4">
        <h1 className="fact-title opacity-0 font-lausanne-400 text-3xl md:text-6xl mb-10">
          Mech drones are friendly
        </h1>
        <ul className="flex flex-col gap-8 facts-subs">
          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            aliquam autem neque. Ipsum rem alias earum, repellat, in nostrum
            sunt soluta veritatis omnis ullam sequi cupiditate veniam impedit
            blanditiis excepturi.
          </li>
          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            aliquam autem neque. Ipsum rem alias earum, repellat, in nostrum
            sunt soluta veritatis omnis ullam sequi cupiditate veniam impedit
            blanditiis excepturi.
          </li>
          <li className="font-lausanne-200 opacity-0 text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            aliquam autem neque. Ipsum rem alias earum, repellat, in nostrum
            sunt soluta veritatis omnis ullam sequi cupiditate veniam impedit
            blanditiis excepturi.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Facts2;
