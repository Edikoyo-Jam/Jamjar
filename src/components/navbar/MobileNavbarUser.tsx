import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import { UserType } from "@/types/UserType";
import { getCurrentJam, joinJam } from "@/helpers/jam";
import { JamType } from "@/types/JamType";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface NavbarUserProps {
  user: UserType;
  jam?: JamType | null;
  setIsInJam: Dispatch<SetStateAction<boolean | undefined>>;
  isInJam?: boolean;
}

export default function MobileNavbarUser({
  user,
  jam,
  setIsInJam,
  isInJam,
}: NavbarUserProps) {
  return (
    <NavbarItem>
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            src={user.profilePicture}
            className="cursor-pointer"
            classNames={{
              base: "bg-transparent",
            }}
          />
        </DropdownTrigger>
        <DropdownMenu>
          {jam && isInJam ? (
            <DropdownItem
              key="create-game"
              href="/create-game"
              className="text-black"
            >
              Create Game
            </DropdownItem>
          ) : null}
          {jam && !isInJam ? (
            <DropdownItem
              key="join-event"
              className="text-black"
              onPress={async () => {
                try {
                  const currentJam = await getCurrentJam();

                  if (!currentJam) {
                    toast.error("There is no jam to join");
                    return;
                  }

                  if (await joinJam(currentJam.id)) {
                    setIsInJam(true);
                  }
                } catch (error) {
                  console.error("Error during join process:", error);
                }
              }}
            >
              Join Event
            </DropdownItem>
          ) : null}
          <DropdownItem
            key="create-post"
            href="/create-post"
            className="text-black"
          >
            Create Post
          </DropdownItem>
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
