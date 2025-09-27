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
    const totalPanels = panels.length;

    // Horizontal scroll with momentum-like snap
    const horizontalTween = gsap.to(panels, {
      xPercent: -100 * (totalPanels - 1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.5, // allows slight dragging
        end: () => "+=" + container.offsetWidth,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (totalPanels - 1), // snap to each panel
          duration: { min: 0.6, max: 1 }, // glide duration
          ease: "power2.out",
        },
      },
    });

    // Animate content within each panel
    panels.forEach((panel) => {
      const title = panel.querySelector(".fact-title");
      const subs = panel.querySelectorAll(".facts-subs li");

      gsap.set(title, { opacity: 0, y: 50 });
      gsap.set(subs, { opacity: 0, y: 30 });

      if (title) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "left 20%",
            toggleActions: "play none none reverse", // play once when trigger hits
            // end: "right right",
            // scrub: 1,
            containerAnimation: horizontalTween,
            // markers: true,
          },
        });

        tl.to(title, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }).to(
          subs,
          { y: 0, opacity: 1, stagger: 0.5, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      }
    });

    return () => {
      horizontalTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden w-full bg-blue-500"
    >
      <div ref={containerRef} className="flex h-full w-max">
        <div className="panel w-screen h-full">
          <Facts1 />
        </div>
        <div className="panel w-screen h-full">
          <Facts2 />
        </div>
      </div>
    </section>
  );
};

export default MechFacts;
