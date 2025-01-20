"use client";

import { Link as BaseLink } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface LinkProps {
  name: string;
  href: string;
}

export default function Link({ name, href }: LinkProps) {
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
    <BaseLink
      href={href}
      className={`text-[#333] dark:text-white flex justify-center duration-500 ease-in-out transition-all transform ${
        !reduceMotion ? "hover:scale-110" : ""
      } transition-color`}
    >
      {name}
    </BaseLink>
  );
}
