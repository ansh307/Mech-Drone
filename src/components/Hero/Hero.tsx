"use client";

import React from "react";
import MechDroneScene from "./HeroScene";
import { View } from "@react-three/drei";
import localFont from "next/font/local";
// import { Gunsan } from "@/app/layout";

export const Gunsan = localFont({
  src: "../../../public/fonts/Gunsan-Regular/gunsan.woff2",
  variable: "--font-gunsan",
});

const Hero = () => {
  return (
    <div className="h-screen bg-blue-500 relative">
      <View className="hero-scene sticky top-20 z-30 h-screen">
        <MechDroneScene />
      </View>

      <div className="absolute inset-0 flex items-center justify-center z-50">
        <h1 className={`${Gunsan.className} text-[13rem] font-bold text-white`}>
          Mech Drone
        </h1>
      </div>
    </div>
  );
};

export default Hero;
