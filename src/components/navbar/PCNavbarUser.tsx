import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import { UserType } from "@/types/UserType";

interface NavbarUserProps {
  user: UserType;
}

export default function PCNavbarUser({ user }: NavbarUserProps) {
  return (
    <NavbarItem>
      <Dropdown>
        <DropdownTrigger>
          <Avatar src={user.profilePicture} className="cursor-pointer" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key="profile"
            className="text-black"
            href={`/u/${user.slug}`}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            showDivider
            key="settings"
            className="text-black"
            href="/settings"
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            className="text-danger"
            href="/logout"
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}
