"use client";

import {
  Image,
  Link,
  NavbarBrand,
  Navbar as NavbarBase,
  NavbarContent,
  Divider,
} from "@nextui-org/react";
import NavbarLink from "./NavbarLink";
import NavbarSearchbar from "./NavbarSearchbar";
import NavbarButtonLink from "./NavbarButtonLink";
import {
  Bell,
  CalendarPlus,
  Gamepad2,
  LogInIcon,
  NotebookPen,
  Shield,
  SquarePen,
} from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookie, hasCookie } from "@/helpers/cookie";
import { getCurrentJam, joinJam } from "@/helpers/jam";
import { JamType } from "@/types/JamType";
import { UserType } from "@/types/UserType";
import NavbarUser from "./PCNavbarUser";
import NavbarButtonAction from "./NavbarButtonAction";
import { toast } from "react-toastify";
import NavbarIconLink from "./NavbarIconLink";
import ThemeToggle from "../theme-toggle";

export default function PCNavbar() {
  const pathname = usePathname();
  const [jam, setJam] = useState<JamType | null>();
  const [isInJam, setIsInJam] = useState<boolean>();
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    loadUser();
    async function loadUser() {
      const currentJam = await getCurrentJam();
      setJam(currentJam);

      if (!hasCookie("token")) {
        setUser(undefined);
        return;
      }

      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/self?username=${getCookie("user")}`
          : `http://localhost:3005/api/v1/self?username=${getCookie("user")}`,
        {
          headers: { authorization: `Bearer ${getCookie("token")}` },
          credentials: "include",
        }
      );

      const user = await response.json();

      if (
        currentJam &&
        user.jams.filter((jam: JamType) => jam.id == currentJam.id).length > 0
      ) {
        setIsInJam(true);
      } else {
        setIsInJam(false);
      }

      if (response.status == 200) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    }
  }, [pathname]);

  return (
    <NavbarBase
      maxWidth="2xl"
      className="bg-[#fff] dark:bg-[#222] p-1 duration-500 ease-in-out transition-color"
      isBordered
      height={80}
    >
      {/* Left side navbar items */}
      <NavbarContent justify="start" className="gap-10">
        <NavbarBrand className="flex-grow-0">
          <Link
            href="/"
            className="duration-500 ease-in-out transition-all transform hover:scale-110"
          >
            <Image
              as={NextImage}
              src="/images/d2jam.png"
              className="min-w-[70px]"
              alt="Dare2Jam logo"
              width={70}
              height={59.7}
            />
          </Link>
        </NavbarBrand>

        <NavbarLink href="/about" name="About" />
        <NavbarLink href="/games" name="Games" />
      </NavbarContent>

      {/* Right side navbar items */}
      <NavbarContent justify="end" className="gap-4">
        <NavbarSearchbar />
        {user && <Divider orientation="vertical" className="h-1/2" />}
        {user && jam && isInJam && (
          <NavbarButtonLink
            icon={<Gamepad2 />}
            name="Create Game"
            href="/create-game"
          />
        )}
        {user && jam && !isInJam && (
          <NavbarButtonAction
            icon={<CalendarPlus />}
            name="Join jam"
            onPress={async () => {
              const currentJam = await getCurrentJam();

              if (!currentJam) {
                toast.error("There is no jam to join");
                return;
              }
              if (await joinJam(currentJam.id)) {
                setIsInJam(true);
              }
            }}
          />
        )}
        {user && (
          <NavbarButtonLink
            icon={<SquarePen />}
            name="Create Post"
            href="/create-post"
          />
        )}
        {user && <NavbarIconLink icon={<Bell />} href="/inbox" />}
        {user && user.mod && (
          <NavbarIconLink icon={<Shield />} href="/reports" />
        )}
        <ThemeToggle />
        <Divider orientation="vertical" className="h-1/2" />
        {!user && (
          <NavbarButtonLink icon={<LogInIcon />} name="Log In" href="/login" />
        )}
        {!user && (
          <NavbarButtonLink
            icon={<NotebookPen />}
            name="Sign Up"
            href="/signup"
          />
        )}
        {user && <NavbarUser user={user} />}
      </NavbarContent>
    </NavbarBase>
  );
}
