import { Button, Link } from "@nextui-org/react";
import { ReactNode } from "react";

interface ButtonLinkProps {
  icon?: ReactNode;
  href: string;
  name: string;
}

export default function ButtonLink({ icon, href, name }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className="flex justify-center duration-500 ease-in-out transition-all transform hover:scale-110"
    >
      <Button
        endContent={icon}
        className="text-[#333] dark:text-white border-[#333]/50 dark:border-white/50 transition-all transform !duration-500 ease-in-out"
        variant="bordered"
      >
        {name}
      </Button>
    </Link>
  );
}
