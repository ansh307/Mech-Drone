import Hero from "@/components/Hero/Hero";
import MechFacts from "@/components/MechFacts/MechFacts";
import SecondSection from "@/components/SecondSection/SecondSection";
import Space from "@/components/Space/Space";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <SecondSection />
      <MechFacts />
      <Space />
    </div>
  );
}
