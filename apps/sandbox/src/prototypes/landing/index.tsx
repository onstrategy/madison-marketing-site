import {
  Nav,
  ClientLogos,
  IntelligenceLayer,
  Capabilities,
  ClientStories,
  Roles,
  TheMoment,
  Vision,
  Security,
  FinalCta,
  Footer,
} from "./sections";
import { Hero } from "./hero";

// Madison marketing landing — the "Platform Home 2a" design, built on-token.
// This prototype self-registers via import.meta.glob in App.tsx (route: /landing).
export default function LandingPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <Hero />
        <ClientLogos />
        <IntelligenceLayer />
        <Capabilities />
        <ClientStories />
        <Roles />
        <TheMoment />
        <Vision />
        <Security />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
