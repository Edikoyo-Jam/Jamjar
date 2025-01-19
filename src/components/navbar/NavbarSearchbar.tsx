import { Input, NavbarItem } from "@nextui-org/react";

export default function NavbarSearchbar() {
  return (
    <NavbarItem>
      <Input
        placeholder="Search"
        classNames={{
          inputWrapper: "!duration-500 ease-in-out transition-all",
        }}
      />
    </NavbarItem>
  );
}
