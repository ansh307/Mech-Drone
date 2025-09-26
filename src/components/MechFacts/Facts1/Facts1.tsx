"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene";
import { PerspectiveCamera, View } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

const Facts1 = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const title = section.querySelector(".initial-fact-title");
    const subs = section.querySelectorAll(".initial-facts-subs li");

    // Timeline for animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 30%", // when section reaches ~halfway
        toggleActions: "play none none reverse", // play on enter, reverse on leave
        // markers: true,
      },
    });

    tl.from(title, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }).from(
      subs,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.5,
      },
      "-=0.4" // start a little before title finishes
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-col md:flex-row h-full bg-transparent text-white z-30"
    >
      {/* Model Section */}
      <div className="w-full md:w-2/5 flex justify-center items-center p-4">
        <div className=" relative w-full h-64 md:h-full flex justify-center items-center">
          <View className=" w-full h-full ">
            <Scene />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} />
            <PerspectiveCamera position={[0, 0, 10]} fov={60} />
          </View>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full md:w-3/5 flex flex-col justify-center p-6 space-y-4">
        <h1 className="initial-fact-title font-lausanne-400 text-3xl md:text-6xl mb-10">
          Mech drones are friendly
        </h1>
        <ul className="flex flex-col gap-8 initial-facts-subs">
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            aliquam autem neque. Ipsum rem alias earum, repellat, in nostrum
            sunt soluta veritatis omnis ullam sequi cupiditate veniam impedit
            blanditiis excepturi.
          </li>
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            aliquam autem neque. Ipsum rem alias earum, repellat, in nostrum
            sunt soluta veritatis omnis ullam sequi cupiditate veniam impedit
            blanditiis excepturi.
          </li>
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
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

export default Facts1;
