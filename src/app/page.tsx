"use client";

import Hero from "@/components/Hero/Hero";
import SecondSection from "@/components/SecondSection/SecondSection";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <SecondSection />
      <div className="h-screen bg-blue-500">
        <h1 className="font-lausanne-200 text-5xl">
          This is a headline with Lausanne 200.
        </h1>
        <p className="font-lausanne-400 text-5xl">
          This is a paragraph with Lausanne 400.
        </p>
      </div>
    </div>
  );
}
