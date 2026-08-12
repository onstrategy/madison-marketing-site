import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// Contact — recreated from madisonai.com/contact.
// ============================================================================

function HeroAndFormSection() {
  return (
    <section className="dark bg-app px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">Contact</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            Let&rsquo;s get in touch.
          </h1>
          <p className="mb-10 text-pretty text-lg text-secondary">
            Looking for a demo?{" "}
            <a href="/demo/" className="font-semibold text-brand-accent">
              Book one here
            </a>
            . For everything else, fill in the form below.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <form className="light rounded-2xl border border-default bg-surface p-8 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-first-name">First name</Label>
                <Input id="contact-first-name" name="firstName" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-last-name">Last name</Label>
                <Input id="contact-last-name" name="lastName" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contact-email">Email address*</Label>
                <Input id="contact-email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contact-org">Organization</Label>
                <Input id="contact-org" name="organization" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contact-message">Message</Label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  className="w-full rounded-md border border-default bg-transparent px-3 py-2 text-sm text-primary outline-none focus-visible:border-brand focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand/50"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
              Send message <ArrowRight className="size-4" />
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function ContactPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroAndFormSection />
      </main>
      <Footer />
    </div>
  );
}
