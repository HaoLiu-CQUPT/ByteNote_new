"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // 初始化
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("bytenote-theme") as Theme | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("bytenote-theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return next;
    });
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-200 transition-colors"
    >
      {isDark ? "☀️ 浅色" : "🌙 深色"}
    </button>
  );
}



