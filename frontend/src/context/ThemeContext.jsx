"use client";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  accent: "#00c41d",
  setAccent: () => {},
});

export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accent") || "#00c41d";
    }
    return "#00c41d";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-light", accent + "20");

    localStorage.setItem("accent", accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}
