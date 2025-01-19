"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);

    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      onClick={handleToggle}
      style={{ cursor: "pointer" }}
      className={`${isSpinning && "animate-[spin_0.5s_ease-out]"}  `}
    >
      <div className="duration-500 ease-in-out transition-all transform text-[#333] dark:text-white hover:scale-125">
        {theme === "dark" && <Moon />}
        {theme === "light" && <Sun />}
      </div>
    </div>
  );
}
