import {
  useEffect,
  createContext,
  useState,
  type ReactNode,
  useContext,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Get the system's preferred theme. */
function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Get the persisted theme from localStorage. */
function getPersistedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("theme");
  return stored === "light" || stored === "dark" ? stored : null;
}

/** Apply the theme to the HTML element. */
function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Pin the theme, ignoring BOTH the persisted preference and the visitor's OS
   * `prefers-color-scheme`. `setTheme` becomes inert while it's set.
   *
   * `apps/site` passes `"light"`: the published marketing pages are designed and
   * reviewed only in Madison's Warm White brand look, so a visitor whose OS sits
   * in dark mode must not be served a dark rendering nobody has signed off on.
   * It also keeps the prerendered HTML (which resolves light server-side) and the
   * hydrated page in agreement, so there's no light→dark flash on first paint.
   *
   * Omit it — the sandbox, Storybook — for the normal persisted/system behavior.
   * Dark mode itself is untouched: every token still carries its dark value.
   */
  forcedTheme?: Theme;
}

export function ThemeProvider({ children, forcedTheme }: ThemeProviderProps) {
  // The visitor's OWN preference. Still tracked while pinned, so that lifting the
  // pin restores what they'd chosen rather than resetting them to light.
  const [preferredTheme, setPreferredTheme] = useState<Theme>(() => {
    // Hydrate from localStorage or system preference.
    const initialTheme = getPersistedTheme() ?? getSystemTheme();
    // Apply synchronously before React renders to prevent a flash.
    if (typeof window !== "undefined") {
      applyTheme(forcedTheme ?? initialTheme);
    }
    return initialTheme;
  });

  const theme = forcedTheme ?? preferredTheme;

  const setTheme = (newTheme: Theme) => {
    // Pinned: this app has opted out of theme switching entirely.
    if (forcedTheme) return;
    setPreferredTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);

    // A pinned theme never follows the OS — nothing to subscribe to.
    if (forcedTheme) return;

    // Follow system theme changes only while the user hasn't set a preference.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const persisted = getPersistedTheme();
      if (!persisted) {
        setPreferredTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, forcedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook to read and set the current theme. Must be used within ThemeProvider. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
