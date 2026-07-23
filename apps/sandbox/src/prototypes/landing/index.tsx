import { Nav } from "./sections";
import { Hero } from "./hero";

// Madison marketing landing — an on-token demo surface for the sandbox.
// This prototype self-registers via import.meta.glob in App.tsx (route: /landing).
// Hero only for now; the sections below it are parked in ./sections pending a
// rebuild to match the new wireframe.
export default function LandingPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav />
      <main>
        <Hero />
      </main>
    </div>
  );
}
