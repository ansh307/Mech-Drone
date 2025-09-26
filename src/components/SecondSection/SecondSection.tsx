"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { MaskContainer } from "@/components/ui/MaskContainer";

const SecondSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLHeadingElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const [maskActive, setMaskActive] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const letter = letterRef.current;
    const circle = circleRef.current;
    if (!section || !letter || !circle) return;

    const handleScroll = () => {
      const vanishEl = document.querySelector("#vanish-text");
      if (!vanishEl) return;

      const rect = vanishEl.getBoundingClientRect();

      if (rect.top <= 500) {
        window.removeEventListener("scroll", handleScroll);

        const dropTl = gsap.timeline();

        // Drop in
        dropTl.fromTo(
          letter,
          { y: -500, opacity: 0 },
          {
            y: window.innerHeight * 0.02 - 200, // 20% from top
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          }
        );

        // Bounce
        dropTl.to(letter, {
          y: window.innerHeight * 0.02 + 50,
          duration: 0.6,
          ease: "bounce.out",
        });

        // Expand circle from letter’s position
        dropTl.set(circle, {
          top: letter.offsetTop + letter.offsetHeight / 2,
          left: letter.offsetLeft + letter.offsetWidth / 2,
          xPercent: -50,
          yPercent: -50,
        });

        dropTl.to(
          circle,
          {
            scale: 20,
            duration: 1.2,
            ease: "power2.inOut",
          },
          "+=0.1"
        );

        // Fade out letter as circle grows
        dropTl.to(
          letter,
          {
            opacity: 0,
            duration: 0.6,
          },
          "-=1" // overlap with circle expansion
        );

        // After circle fill → switch to mask
        dropTl.to(
          section,
          {
            backgroundColor: "black",
            color: "white",
            duration: 0.8,
            onComplete: () => setMaskActive(true),
          },
          "-=0.3"
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className="h-screen relative overflow-hidden">
      {/* Expanding circle */}
      <div
        ref={circleRef}
        className="absolute w-40 h-40 rounded-full z-0"
        style={{
          transform: "scale(0)",
          backgroundColor: toggle ? "black" : "white",
          color: toggle ? "black" : "white",
        }}
      />

      {/* E letter */}
      <h1
        ref={letterRef}
        className="font-bold absolute right-20 opacity-0 text-7xl sm:text-8xl md:text-9xl lg:text-[13rem] z-10"
        style={{
          fontFamily: "Gunsan, Arial, sans-serif",
          color: toggle ? "black" : "white",
        }}
      >
        E
      </h1>

      {/* MaskContainer */}
      {maskActive && (
        <MaskContainer
          toggle={toggle}
          className=" font-lausanne-400  z-50"
          revealText={
            toggle ? (
              <div className="">
                <p className="mx-auto max-w-4xl text-center text-4xl font-bold text-black dark:text-white">
                  Mech Drone was discovered drifting near the{" "}
                  <span className="text-blue-500">rings of Saturn</span>, an
                  interstellar{" "}
                  <span className="text-blue-500">robotic explorer</span> with a
                  spark of cosmic mischief. Equipped with playful stunts and
                  galactic tricks, it turns every moment into an <br />
                  <span className="text-blue-500">adventure!</span>
                </p>
              </div>
            ) : (
              <div className="">
                <p className="mx-auto max-w-4xl text-center text-4xl font-bold text-black">
                  Mech Drone ventures across galaxies, performing{" "}
                  <span className="text-blue-500">cosmic stunts</span> and
                  engaging in{" "}
                  <span className="text-blue-500">stellar tricks</span>. Fun,
                  friendly, and endlessly curious, it sparks joy across the
                  universe!
                </p>
              </div>
            )
          }
        >
          <div
            className={`text-center font-bold ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            {toggle ? (
              <>
                Meet Mech Drone — a clever, fun-loving{" "}
                <span className="text-blue-500">robotic drone</span> with a
                playful spirit, constantly performing quirky stunts,{" "}
                <span className="text-blue-500">impressive tricks</span>, and
                unexpected antics. Friendly, entertaining, and always exploring.
              </>
            ) : (
              <>
                Meet Mech Drone — the interstellar{" "}
                <span className="text-blue-500">robotic drone</span> from
                Saturn&apos;s rings, performing{" "}
                <span className="text-blue-500">galactic stunts</span> and
                spreading fun everywhere.
              </>
            )}
            <p
              className="text-blue-500 cursor-pointer"
              onClick={() => setToggle((prev) => !prev)}
            >
              Keep exploring...
            </p>
          </div>
        </MaskContainer>
      )}
    </div>
  );
};

export default SecondSection;
