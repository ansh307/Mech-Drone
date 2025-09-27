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
      className="flex flex-col md:flex-row h-full bg-transparent text-white z-30 mr-16"
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
          Cosmic Explorer Unleashed
        </h1>
        <ul className="flex flex-col gap-8 initial-facts-subs">
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Mech Drone was discovered near Saturn&apos;s rings and is built for
            long-range interstellar exploration. It can navigate harsh
            environments with high precision sensors.
          </li>
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Its propulsion system allows it to perform complex maneuvers in zero
            gravity. This makes it capable of stunts and precise exploration
            alike.
          </li>
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Mech Drone carries advanced mapping tools to scan and document
            cosmic structures. It collects data for scientific research while
            traveling.
          </li>
          {/* <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Mech Drone once surfed the icy rings of Saturn just for fun —
            leaving behind a sparkling trail like cosmic graffiti.
          </li> */}
          <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Equipped with adaptive AI, it learns from its environment to
            optimize performance. The drone can react to unexpected obstacles or
            cosmic events.
          </li>

          {/* <li className="font-lausanne-200 text-base md:text-lg leading-relaxed">
            Its favorite trick? Pretending to malfunction, only to burst out in
            a dazzling stunt a moment later.
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Facts1;
