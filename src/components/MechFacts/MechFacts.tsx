"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Facts1 from "@/components/MechFacts/Facts1/Facts1";
import Facts2 from "@/components/MechFacts/Facts2/Facts2";

gsap.registerPlugin(ScrollTrigger);

const MechFacts = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const panels = gsap.utils.toArray<HTMLElement>(".panel");

    // 1️⃣ Horizontal scroll tween
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + container.offsetWidth,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // 2️⃣ Panel animations (text/images) using containerAnimation
    panels.forEach((panel) => {
      const title = panel.querySelector(".fact-title");
      const subs = panel.querySelectorAll(".facts-subs li");

      //   gsap.set([title, subs], { opacity: 0, x: -30 }); // initial state
      gsap.set(title, { opacity: 0, y: 50 }); // initial state
      gsap.set(subs, { opacity: 0, y: 30 }); // initial state

      if (title) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "left 20%",
            end: "right right",
            scrub: 1,
            containerAnimation: scrollTween,
            // markers: true, // uncomment for debugging
          },
        });

        tl.to(title, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }).to(
          subs,
          {
            y: 0,
            opacity: 1,
            stagger: 0.5,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }
    });

    // 3️⃣ Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden w-[99.9%] z- bg-blue-500"
    >
      <div
        ref={containerRef}
        className="flex h-full w-max" // width adapts to number of panels
      >
        <div className="panel w-screen h-full ">
          <Facts1 />
        </div>
        <div className="panel w-screen h-full">
          <Facts2 />
        </div>
        {/* you can keep adding Facts3, Facts4, etc. */}
      </div>
    </section>
  );
};

export default MechFacts;
