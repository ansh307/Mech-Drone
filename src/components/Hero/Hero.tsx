"use client";

import React, { useEffect, useRef } from "react";
import MechDroneScene from "./HeroScene";
import { View } from "@react-three/drei";
import localFont from "next/font/local";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VanishText from "./VanishText";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  useEffect(() => {
    // Top-left
    gsap.to(".bg-text-top-left", {
      x: -300,
      ease: "none",
      scrollTrigger: {
        trigger: ".bg-text-top-left",
        start: "top 5%",
        end: "bottom+=200% 5%",
        scrub: true,
      },
    });

    // Top-right
    gsap.to(".bg-text-top-right", {
      x: 300,
      ease: "none",
      scrollTrigger: {
        trigger: ".bg-text-top-right",
        start: "top-=20% 20%",
        end: "bottom+=150% 5%",
        scrub: true,
      },
    });

    // Bottom-left
    gsap.to(".bg-text-bottom-left", {
      x: -300,
      ease: "none",
      scrollTrigger: {
        trigger: ".bg-text-bottom-left",
        start: "top 80%",
        end: "bottom 30%",
        scrub: true,
      },
    });

    // Bottom-right
    gsap.to(".bg-text-bottom-right", {
      x: 300,
      ease: "none",
      scrollTrigger: {
        trigger: ".bg-text-bottom-right",
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="h-screen bg-blue-500 relative overflow-hidden">
      <View className="hero-scene sticky top-20 z-10 h-screen">
        <MechDroneScene />
      </View>

      {/* Background texts */}
      <h1
        className={` bg-text-top-left absolute font-bold text-white/10 
          text-5xl sm:text-7xl lg:text-7xl`}
        style={{
          top: "5%",
          left: "10%",
          fontFamily: "Gunsan, Arial, sans-serif",
        }}
      >
        Mech Drone
      </h1>

      <h1
        className={` bg-text-top-right absolute font-bold text-white/10 
          text-5xl sm:text-7xl lg:text-7xl`}
        style={{
          top: "20%",
          right: "10%",
          fontFamily: "Gunsan, Arial, sans-serif",
        }}
      >
        Mech Drone
      </h1>

      <h1
        className={` bg-text-bottom-left absolute font-bold text-white/10 
          text-5xl sm:text-7xl lg:text-7xl`}
        style={{
          top: "65%",
          left: "10%",
          fontFamily: "Gunsan, Arial, sans-serif",
        }}
      >
        Mech Drone
      </h1>

      <h1
        className={` bg-text-bottom-right absolute font-bold text-white/10 
          text-5xl sm:text-7xl lg:text-7xl`}
        style={{
          top: "80%",
          right: "5%",
          fontFamily: "Gunsan, Arial, sans-serif",
        }}
      >
        Mech Drone
      </h1>

      {/* Main centered text */}
      {/* <div className="absolute inset-0 flex items-center justify-center z-50">
        <h1
          className={` font-bold text-white 
          text-7xl sm:text-8xl md:text-9xl lg:text-[13rem]`}
        >
          Mech Drone
        </h1>
      </div> */}
      <div id="vanish-text" className="...">
        <VanishText />
      </div>
    </div>
  );
};

export default Hero;
