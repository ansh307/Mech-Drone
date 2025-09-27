import Hero from "@/components/Hero/Hero";
import MechFacts from "@/components/MechFacts/MechFacts";
import HiddenGalaxy from "@/components/HiddenGalaxy/HiddenGalaxy";
import Space from "@/components/Space/Space";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <HiddenGalaxy />
      <MechFacts />
      <Space />
    </div>
  );
}
