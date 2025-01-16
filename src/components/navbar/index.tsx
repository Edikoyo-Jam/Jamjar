"use client";

import {
  Navbar as NavbarBase,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { SiDiscord, SiForgejo, SiGithub } from "@icons-pack/react-simple-icons";
import { LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { hasCookie, getCookies } from "@/helpers/cookie";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    loadUser();
    async function loadUser() {
      if (!hasCookie()) {
        setUser("");
        return;
      }

      const response = await fetch(
        process.env.MODE === "PROD"
          ? "https://d2jam.com/api/v1/self"
          : "http://localhost:3005/api/v1/self",
        {
          headers: { authorization: `Bearer ${getCookies().token}` },
        }
      );

      if ((await response.text()) == "ok") {
        setUser("ok");
      } else {
        setUser("");
      }
    }
  }, [pathname]);

  return (
    <NavbarBase
      shouldHideOnScroll
      maxWidth="2xl"
      className="bg-transparent p-1"
    >
      <NavbarBrand>
        <Link
          href="/"
          className="duration-500 ease-in-out transition-all transform hover:scale-110"
        >
          <Image src="/images/dare2jam.png" alt="Dare2Jam logo" width={80} />
        </Link>
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <Link
            href="/app"
            className="text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-110"
          >
            Beta Site
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Tooltip
            delay={1000}
            content={
              <div className="px-1 py-2 text-black text-center">
                <div className="text-small font-bold">GitHub</div>
                <div className="text-tiny">Source Code</div>
              </div>
            }
          >
            <Link
              href="https://github.com/Ategon/Jamjar"
              className="text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-125 hover:text-red-100"
              isExternal
            >
              <SiGithub title="" />
            </Link>
          </Tooltip>
        </NavbarItem>
        <NavbarItem>
          <Tooltip
            delay={1000}
            content={
              <div className="px-1 py-2 text-black text-center">
                <div className="text-small font-bold">Forgejo</div>
                <div className="text-tiny">Source Code</div>
              </div>
            }
          >
            <Link
              href="https://git.edikoyo.com/Ategon/Jamjar"
              className="text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-125 hover:text-red-100"
              isExternal
            >
              <SiForgejo title="" />
            </Link>
          </Tooltip>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="https://discord.gg/rfmKzM6ASw"
            className="text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-125 hover:text-indigo-100"
            isExternal
          >
            <SiDiscord />
          </Link>
        </NavbarItem>
        <Divider orientation="vertical" className="h-1/2" />
        {!user ? (
          <div className="flex gap-3 items-center">
            <NavbarItem>
              <Link href="/login">
                <Button
                  endContent={<LogInIcon />}
                  className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                  variant="bordered"
                >
                  Log In
                </Button>
              </Link>
            </NavbarItem>
            {/* <NavbarItem>
              <Link href="/signup">
                <Button
                  endContent={<NotebookPen />}
                  className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                  variant="bordered"
                >
                  Sign up
                </Button>
              </Link>
            </NavbarItem> */}
          </div>
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Avatar />
            </DropdownTrigger>
            <DropdownMenu>
              {/* <DropdownItem
                key="profile"
                className="text-black"
                href="/profile"
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
              </DropdownItem> */}
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
        )}
      </NavbarContent>
    </NavbarBase>
  );
}
