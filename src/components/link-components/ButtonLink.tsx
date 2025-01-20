"use client";

import { Button, Link } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";

interface ButtonLinkProps {
  icon?: ReactNode;
  href: string;
  name: string;
}

export default function ButtonLink({ icon, href, name }: ButtonLinkProps) {
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
    <Link
      href={href}
      className={`flex justify-center duration-500 ease-in-out transition-all transform ${
        !reduceMotion ? "hover:scale-110" : ""
      }`}
    >
      <Button
        endContent={icon}
        className={`text-[#333] dark:text-white border-[#333]/50 dark:border-white/50 transition-all transform !duration-500 ease-in-out ${
          !reduceMotion ? "hover:scale-110" : ""
        }`}
        variant="bordered"
      >
        {name}
      </Button>
    </Link>
  );
}
