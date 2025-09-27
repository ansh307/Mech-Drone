"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskContainer } from "@/components/ui/MaskContainer";

gsap.registerPlugin(ScrollTrigger);

const HiddenGalaxy = () => {
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

    const vanishEl = document.querySelector("#vanish-e");
    const HiddenGalaxySection = document.querySelector("#hidden-galaxy");
    if (!HiddenGalaxySection || !vanishEl) return;

    // Get the offset of the HiddenGalaxySection relative to the viewport
    const hiddenGalaxyTop = HiddenGalaxySection.getBoundingClientRect().top;

    // Calculate the position for 20% of the viewport height from the top of the HiddenGalaxySection
    const topDistanceFromHiddenGalaxy =
      (hiddenGalaxyTop + window.innerHeight * 0.2) / 10;

    const rect = vanishEl.getBoundingClientRect();

    // // Get document-relative positions instead of viewport-relative
    // const hiddenGalaxyTop = hiddenGalaxySection.offsetTop;
    // const vanishElRect = vanishEl.getBoundingClientRect();
    // const vanishElTop = vanishEl.offsetTop;
    // const vanishElHeight = vanishEl.offsetHeight;
    // // Calculate the position for 20% of the viewport height from the top of the HiddenGalaxySection
    // const topDistanceFromHiddenGalaxy = window.innerHeight * 0.2;
    // // Calculate the initial position relative to the document
    // const initialY = -(
    //   vanishElTop +
    //   vanishElHeight +
    //   topDistanceFromHiddenGalaxy
    // );

    // Initial position setup
    gsap.set(letter, {
      x: rect.left,
      y: -(rect.bottom + topDistanceFromHiddenGalaxy),
      z: 50,
    });

    // ScrollTrigger Timeline
    const dropTl = gsap.timeline({
      scrollTrigger: {
        trigger: vanishEl,
        start: "top 20%",
        end: "90% bottom",
        toggleActions: "play none none none",
        // markers: true,
      },
    });

    console.log(
      "From Hidden Galaxy",
      -(rect.bottom + topDistanceFromHiddenGalaxy)
    );

    // Drop animation
    dropTl.fromTo(
      letter,
      { y: -(rect.bottom + topDistanceFromHiddenGalaxy), opacity: 0 },
      {
        y: topDistanceFromHiddenGalaxy,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }
    );

    // Bounce animation
    dropTl.to(letter, {
      y: window.innerHeight * 0.02 + 50,
      duration: 0.6,
      ease: "bounce.out",
    });

    // Set circle position based on letter
    dropTl.set(circle, {
      top: letter.offsetTop + letter.offsetHeight / 2,
      left: rect.left,
    });

    // Circle expansion
    dropTl.to(
      circle,
      {
        scale: 20,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "+=0.1"
    );

    // Fade out the letter while the circle expands
    dropTl.to(
      letter,
      {
        opacity: 0,
        duration: 0.6,
      },
      "-=1"
    );

    // Change background color after circle expansion
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

    // Cleanup ScrollTrigger when component is unmounted
    return () => {
      dropTl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      id="hidden-galaxy"
      className="h-screen relative overflow-hidden"
    >
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
        className="absolute font-bold opacity-0 text-7xl sm:text-8xl md:text-9xl lg:text-[13rem] z-10"
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

export default HiddenGalaxy;
