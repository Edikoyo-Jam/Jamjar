"use client";

import { Button } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";

interface ButtonActionProps {
  icon?: ReactNode;
  onPress: () => void;
  name: string;
}

export default function ButtonAction({
  icon,
  onPress,
  name,
}: ButtonActionProps) {
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Button
      endContent={icon}
      className={`text-[#333] dark:text-white border-[#333]/50 dark:border-white/50 transition-all transform duration-500 ease-in-out ${
        !reduceMotion ? "hover:scale-110" : ""
      }`}
      variant="bordered"
      onPress={onPress}
    >
      {name}
    </Button>
  );
}
