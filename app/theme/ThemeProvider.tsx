import React, { createContext, useContext, useEffect, useState } from "react";

type TThemeMode = "light" | "dark";

type TThemeState = {
  themeMode: TThemeMode;
  toggleTheme?: () => void;
};

const initialThemeState: TThemeState = {
  themeMode: "light",
};

const THEME = "theme";

export const ThemeContext = createContext<TThemeState>(initialThemeState);

export function useThemeContext() {
  return useContext(ThemeContext);
}

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") || "light";
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState(getInitialTheme());

  // Hydrate theme from localStorage / system preference on client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(THEME) as TThemeMode | null;
    if (stored === "light" || stored === "dark") {
      setThemeMode(stored);
      return;
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    setThemeMode(prefersDark ? "dark" : "light");
  }, []);

  // Sync theme to DOM and localStorage when it changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", themeMode);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME, themeMode);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode: themeMode as TThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
