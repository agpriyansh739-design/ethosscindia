import Hero from "./components/Hero";
import CloudTransition from "./components/CloudTransition";
import Mission from "./components/Mission";
import MOEVideo from "./components/MOEVideo";
import PartnershipCTA from "./components/PartnershipCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <CloudTransition />
      <Mission />
      <MOEVideo />
      <PartnershipCTA />
    </main>
  );
}
