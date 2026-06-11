import { useEffect } from "react";
import {
  Nav,
  Hero,
  LogoStrip,
  Problem,
  HowItWorks,
  SystemSection,
  Audiences,
  Showcase,
  Testimonials,
  Pricing,
  Notifications,
  FinalCta,
  Footer,
} from "./sections";

// Northwind marketing landing — an on-token demo surface for the sandbox.
// This prototype self-registers via import.meta.glob in App.tsx (route: /landing).
// meta.ts powers the gallery card; this file is the lazy-loaded page.
export default function LandingPrototype() {
  // Smooth in-page anchor scrolling. Reduced-motion users keep instant jumps —
  // the global `prefers-reduced-motion` rule forces scroll-behavior: auto.
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("scroll-smooth");
    return () => el.classList.remove("scroll-smooth");
  }, []);

  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Problem />
        <HowItWorks />
        <SystemSection />
        <Audiences />
        <Showcase />
        <Testimonials />
        <Pricing />
        <Notifications />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
