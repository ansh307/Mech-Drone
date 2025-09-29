"use client";

import React, { useEffect, useRef, useState } from "react";
import TextType from "@/components/ui/TextType";
import { PerspectiveCamera, View } from "@react-three/drei";
import Scene from "./Scene";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import TargetCursor from "@/components/ui/TargetCursor";
import Particles from "@/components/ui/Particles";
import GameOverlay from "@/components/Space/GameOverlay";

gsap.registerPlugin(ScrollTrigger);

const Space = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainer1Ref = useRef<HTMLDivElement>(null);
  const textContainer2Ref = useRef<HTMLDivElement>(null);
  const textContainer3Ref = useRef<HTMLDivElement>(null);
  const textContainer4Ref = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(1);

  useEffect(() => {
    if (
      !textContainer1Ref.current ||
      !textContainer2Ref.current ||
      !textContainer3Ref.current ||
      !textContainer4Ref.current
    )
      return;

    const tl = gsap.timeline();

    if (animationIndex === 1) {
      // Reset to container1
      tl.to(
        [
          textContainer2Ref.current,
          textContainer3Ref.current,
          textContainer4Ref.current,
        ],
        {
          autoAlpha: 0,
          x: 50,
          duration: 0.6,
          ease: "power2.inOut",
          pointerEvents: "none",
        }
      );

      tl.fromTo(
        textContainer1Ref.current,
        { autoAlpha: 0, y: -50, pointerEvents: "none" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.inOut",
          pointerEvents: "auto",
        },
        "-=0.3"
      );
    }

    if (animationIndex === 2) {
      // Container1 -> Container2
      tl.to(textContainer1Ref.current, {
        autoAlpha: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.inOut",
        pointerEvents: "none",
      });

      tl.fromTo(
        textContainer2Ref.current,
        { autoAlpha: 0, x: 100, pointerEvents: "none" },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.inOut",
          pointerEvents: "auto",
        },
        "-=0.4"
      );
    }

    if (animationIndex === 3) {
      // Container2 -> Container3
      tl.to(textContainer2Ref.current, {
        autoAlpha: 0,
        x: 300,
        duration: 1.5,
        ease: "power2.inOut",
        pointerEvents: "none",
      });

      tl.fromTo(
        textContainer3Ref.current,
        { autoAlpha: 0, x: -100, pointerEvents: "none" },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1.5,
          ease: "power2.inOut",
          pointerEvents: "auto",
        },
        "-=0.4"
      );
    }

    if (animationIndex === 4) {
      // Container3 -> Container4
      tl.to(textContainer3Ref.current, {
        autoAlpha: 0,
        x: -200,
        duration: 1.2,
        ease: "power2.inOut",
        pointerEvents: "none",
      });

      tl.fromTo(
        textContainer4Ref.current,
        { autoAlpha: 0, y: 100, pointerEvents: "none" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.inOut",
          pointerEvents: "auto",
        },
        "-=0.5"
      );
    }

    return () => {
      tl.kill();
    };
  }, [animationIndex]);

  return (
    <div
      className="h-screen bg-black text-white text-3xl overflow-hidden relative  "
      ref={containerRef}
    >
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        containerRef={containerRef}
      />

      <GameOverlay
        containerRef={containerRef}
        duration={30}
        imageSrc={["/alien.png", "/ufo.png", "/mimikyu.png"]}
      />

      <View className=" top-20 w-full h-full z-0">
        <Scene
          containerRef={containerRef}
          animationIndex={animationIndex}
          setIsAnimating={setIsAnimating}
        />
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} />
        <PerspectiveCamera position={[0, 0, -150]} fov={30} makeDefault />
      </View>

      <div className="absolute inset-0  h-[100%] w-[100%] z-10 ">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
          className=""
        />

        {/* animation 1 */}
        <div
          className="absolute top-10 right-10 md:top-24 md:right-24 lg:top-32 lg:right-32 w-96"
          ref={textContainer1Ref}
        >
          <h2 className="font-lausanne-400 mb-4">File 01: The Beginning</h2>
          <TextType
            text={[
              "No record of its creation exists.",
              "Some claim it was never engineered, only discovered adrift near Saturn&apos;s rings. As if it had always been waiting.",
              "Others whisper it had been there for centuries, dormant, waiting for someone to notice.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="▍"
            deletingSpeed={3}
            className=" text-base font-lausanne-300 h-20 overflow-hidden"
          />
          {/* Next Button */}
          <div className="w-full overflow-hidden ">
            <Button
              disabled={isAnimating}
              onClick={() => setAnimationIndex(2)}
              className="text-base p-1 cursor-target"
            />
          </div>
        </div>

        {/* animation 2 */}
        <div
          className="absolute top-10 right-10 md:top-24 md:right-24 lg:top-2/5 lg:right-1/7 w-[28rem] "
          style={{ opacity: 0, pointerEvents: "none" }} // start hidden
          ref={textContainer2Ref}
        >
          <h2 className="font-lausanne-400 mb-4 text-5xl">
            File 02: The Shell
          </h2>
          <TextType
            text={[
              "Its surface shows unknown metal, no fracture, no sign of assembly.",
              "A body seamless and impossibly precise—too flawless for human hands. Examiners describe it not as manufactured, but as if it had been grown.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="▍"
            deletingSpeed={3}
            className=" text-base font-lausanne-300 h-20 overflow-hidden"
          />
          <div className="w-full overflow-hidden ">
            <Button
              disabled={isAnimating}
              onClick={() => setAnimationIndex(3)}
              className="text-base p-1 cursor-target"
            />
          </div>
        </div>

        {/* animation 3 */}
        <div
          className="absolute top-10 right-10 md:top-24 md:right-24 lg:top-2/5 lg:left-1/7 w-[28rem]"
          style={{ opacity: 0, pointerEvents: "none" }} // start hidden
          ref={textContainer3Ref}
        >
          <h2 className="font-lausanne-400 mb-4 text-5xl">
            File 03: The Watcher
          </h2>

          <TextType
            text={[
              "It moves without command, as though guided by something hungry.",
              "It hovers in the silence, cold and unblinking, watching with an emptiness that chills the soul. Those who encounter it say it does not wait—it stalks, drawn to something ancient, something alive.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="▍"
            deletingSpeed={3}
            className=" text-base font-lausanne-300 h-20 overflow-hidden"
          />
          <div className="w-full overflow-hidden ">
            <Button
              disabled={isAnimating}
              onClick={() => setAnimationIndex(4)}
              className="text-base p-1 cursor-target"
            />
          </div>
        </div>

        {/* animation 4 */}
        <div
          className="absolute top-10 right-10 md:top-24 md:right-24 lg:top-2/5 lg:left-2/6 w-[32rem]"
          style={{ opacity: 0, pointerEvents: "none" }} // start hidden
          ref={textContainer4Ref}
        >
          <div className="text-center">
            <h2 className="font-gunsan mb-4 text-8xl">Mech Drone</h2>
            <TextType
              text={["is still a mystery", "is still a mystery"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="▍"
              deletingSpeed={3}
              className=" text-xl font-lausanne-300 h-24 overflow-hidden"
            />
          </div>
          <div className="w-full overflow-hidden text-center ">
            <Button
              disabled={isAnimating}
              onClick={() => setAnimationIndex(1)}
              className="text-base p-1 px-10 cursor-target"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Space;
