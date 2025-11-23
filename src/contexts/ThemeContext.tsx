import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (value: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "dark";
  }

  // Check if user has a stored preference in localStorage
  const storedTheme = localStorage.getItem("theme-preference");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  // Default to dark theme for first-time users
  return "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [theme, setThemeState] = useState<"light" | "dark">(() => getSystemTheme());

  const userThemePreference = session?.user?.user_metadata?.theme;
  const hasUserPreference = userThemePreference === "light" || userThemePreference === "dark";

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (!hasUserPreference && typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (event: MediaQueryListEvent) => {
        setThemeState(event.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [hasUserPreference]);

  useEffect(() => {
    if (hasUserPreference && userThemePreference) {
      setThemeState(prev => (prev === userThemePreference ? prev : (userThemePreference as "light" | "dark")));
    }
  }, [hasUserPreference, userThemePreference]);

  const persistTheme = useCallback(
    async (value: "light" | "dark") => {
      // Always save to localStorage first (for non-authenticated users)
      localStorage.setItem("theme-preference", value);

      const userId = session?.user?.id;
      if (!userId) {
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: { theme: value },
      });

      if (error) {
        console.error("Failed to persist theme preference", error);
      }
    },
    [session?.user?.id]
  );

  const applyTheme = useCallback(
    (value: "light" | "dark") => {
      setThemeState(value);
      void persistTheme(value);
    },
    [persistTheme]
  );

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        applyTheme(theme === "light" ? "dark" : "light");
      },
      setTheme: applyTheme,
    }),
    [applyTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
