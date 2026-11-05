import {
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { Lock } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { Footer, Nav } from "../../prototypes/landing/sections";

// A light password gate for pages shared by direct link. It keeps casual
// visitors out and keeps the story off the public HTML, but it runs in the
// browser, so it is a "please ask for the password" gate, not a security
// boundary. Only a salted hash of the password lives in the repo.

async function hashPassword(storyId: string, password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${storyId}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function storageKey(storyId: string): string {
  return `madison-private-page:${storyId}`;
}

function readUnlocked(storyId: string, passwordHash: string): boolean {
  try {
    return window.sessionStorage.getItem(storageKey(storyId)) === passwordHash;
  } catch {
    return false;
  }
}

function rememberUnlocked(storyId: string, passwordHash: string): void {
  try {
    window.sessionStorage.setItem(storageKey(storyId), passwordHash);
  } catch {
    // Private mode or blocked storage: the visitor just re-enters it next time.
  }
}

function subscribeToStorage(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function PasswordGate({
  storyId,
  passwordHash,
  children,
}: {
  storyId: string;
  passwordHash: string;
  children: ReactNode;
}) {
  // The server snapshot is always "locked", so the prerendered HTML never
  // contains the story; a returning visitor is unlocked right after hydration.
  const rememberedUnlocked = useSyncExternalStore(
    subscribeToStorage,
    () => readUnlocked(storyId, passwordHash),
    () => false,
  );
  const [unlockedHere, setUnlockedHere] = useState(false);
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);
  const unlocked = rememberedUnlocked || unlockedHere;

  if (unlocked) return <>{children}</>;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attempt = await hashPassword(storyId, password.trim());
    if (attempt === passwordHash) {
      rememberUnlocked(storyId, passwordHash);
      setUnlockedHere(true);
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware activeNavItem="client-stories" />
      <main className="border-b border-default bg-surface px-gutter py-21 sm:py-30">
        <div className="mx-auto max-w-md rounded-2xl border border-default bg-panel p-8">
          <span className="flex size-9 items-center justify-center rounded-full bg-info text-info-fg">
            <Lock aria-hidden className="size-4" />
          </span>
          <h1 className="mt-4 text-balance text-2xl font-medium tracking-tight text-primary">
            This page is private
          </h1>
          <p className="mt-3 text-pretty text-sm text-secondary">
            Enter the password you were given to view this client story.
          </p>
          <form className="mt-6" onSubmit={handleSubmit}>
            <Label htmlFor="private-page-password" className="mb-1.5 block">
              Password
            </Label>
            <Input
              id="private-page-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setWrong(false);
              }}
              aria-invalid={wrong}
              aria-describedby={wrong ? "private-page-error" : undefined}
            />
            {wrong ? (
              <p
                id="private-page-error"
                role="alert"
                className="mt-2 text-sm text-error"
              >
                That password isn't right. Please try again.
              </p>
            ) : null}
            <Button type="submit" size="lg" className="mt-6 w-full">
              View client story
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
