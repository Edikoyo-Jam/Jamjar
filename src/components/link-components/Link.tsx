import { Link as BaseLink } from "@nextui-org/react";

interface LinkProps {
  name: string;
  href: string;
}

export default function Link({ name, href }: LinkProps) {
  return (
    <BaseLink
      href={href}
      className="text-[#333] dark:text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-110 duration-500 ease-in-out transition-color"
    >
      {name}
    </BaseLink>
  );
}
