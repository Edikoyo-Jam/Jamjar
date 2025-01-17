import { NavbarItem } from "@nextui-org/react";
import { ReactNode } from "react";
import ButtonLink from "../link-components/ButtonLink";

interface NavbarButtonLinkProps {
  icon?: ReactNode;
  href: string;
  name: string;
}

export default function NavbarButtonLink({
  icon,
  href,
  name,
}: NavbarButtonLinkProps) {
  return (
    <NavbarItem>
      <ButtonLink icon={icon} href={href} name={name} />
    </NavbarItem>
  );
}
