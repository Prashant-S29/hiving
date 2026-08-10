"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hivig-theme";

export default function ThemeToggle({
  switchToLightLabel,
  switchToDarkLabel,
}: {
  switchToLightLabel: string;
  switchToDarkLabel: string;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? switchToDarkLabel : switchToLightLabel}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-rule-strong text-[13px] text-muted transition-colors hover:text-ink"
    >
      {theme === "light" ? "☀" : "☾"}
    </button>
  );
}
