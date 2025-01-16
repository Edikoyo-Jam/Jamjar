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
import {
  CalendarPlus,
  Gamepad2,
  LogInIcon,
  Menu,
  NotebookPen,
  SquarePen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { hasCookie, getCookie } from "@/helpers/cookie";
import { usePathname } from "next/navigation";
import { UserType } from "@/types/UserType";
import { getCurrentJam, joinJam } from "@/helpers/jam";
import { toast } from "react-toastify";
import { JamType } from "@/types/JamType";

export default function Navbar() {
  const [user, setUser] = useState<UserType>();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [jam, setJam] = useState<JamType | null>();
  const [isInJam, setIsInJam] = useState<boolean>();

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <NavbarContent justify="end">
        {isMobile ? (
          user ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar src={user.profilePicture} />
              </DropdownTrigger>
              <DropdownMenu className="text-black">
                {jam && isInJam ? (
                  <DropdownItem key="create-game" href="/create-game">
                    Create Game
                  </DropdownItem>
                ) : null}
                {jam && !isInJam ? (
                  <DropdownItem
                    key="join-event"
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
                <DropdownItem key="create-post" href="/create-post">
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
                  key="github"
                  href="https://github.com/Ategon/Jamjar"
                >
                  GitHub
                </DropdownItem>
                <DropdownItem
                  key="forgejo"
                  href="https://git.edikoyo.com/Ategon/Jamjar"
                >
                  Forgejo
                </DropdownItem>
                <DropdownItem
                  key="discord"
                  href="https://discord.gg/rfmKzM6ASw"
                >
                  Discord
                </DropdownItem>
                <DropdownItem key="logout" color="danger" href="/logout">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Dropdown>
              <DropdownTrigger>
                <Menu />
              </DropdownTrigger>
              <DropdownMenu className="text-black">
                <DropdownItem
                  key="github"
                  href="https://github.com/Ategon/Jamjar"
                >
                  GitHub
                </DropdownItem>
                <DropdownItem
                  key="forgejo"
                  href="https://git.edikoyo.com/Ategon/Jamjar"
                >
                  Forgejo
                </DropdownItem>
                <DropdownItem
                  key="discord"
                  href="https://discord.gg/rfmKzM6ASw"
                >
                  Discord
                </DropdownItem>
                <DropdownItem key="login" href="/login">
                  Log In
                </DropdownItem>
                <DropdownItem key="signup" href="/signup">
                  Sign Up
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )
        ) : (
          <div className="flex gap-3 items-center">
            {user && jam && isInJam && (
              <NavbarItem>
                <Link href="/create-game">
                  <Button
                    endContent={<Gamepad2 />}
                    className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                    variant="bordered"
                  >
                    Create Game
                  </Button>
                </Link>
              </NavbarItem>
            )}
            {user && jam && !isInJam && (
              <NavbarItem>
                <Button
                  endContent={<CalendarPlus />}
                  className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                  variant="bordered"
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
                >
                  Join Jam
                </Button>
              </NavbarItem>
            )}
            {user && (
              <NavbarItem className="flex items-center">
                <Link href="/create-post">
                  <Button
                    endContent={<SquarePen />}
                    className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                    variant="bordered"
                  >
                    Create Post
                  </Button>
                </Link>
              </NavbarItem>
            )}
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
                  href="https://github.com/Dare2Jam/"
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
                <NavbarItem>
                  <Link href="/signup">
                    <Button
                      endContent={<NotebookPen />}
                      className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                      variant="bordered"
                    >
                      Sign up
                    </Button>
                  </Link>
                </NavbarItem>
              </div>
            ) : (
              <Dropdown>
                <DropdownTrigger>
                  <Avatar src={user.profilePicture} />
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
            )}
          </div>
        )}
      </NavbarContent>
    </NavbarBase>
  );
}
/* 

{isMobile ? (
          // Mobile view
          user ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar src={user.profilePicture} />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="create-post" href="/create-post">
                  Create Post
                </DropdownItem>
                <DropdownItem key="logout" color="danger" href="/logout">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Dropdown>
              <DropdownTrigger>
                <Button auto flat className="text-white">
                  ☰
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="github" href="https://github.com/Ategon/Jamjar" isExternal>
                  GitHub
                </DropdownItem>
                <DropdownItem key="forgejo" href="https://git.edikoyo.com/Ategon/Jamjar" isExternal>
                  Forgejo
                </DropdownItem>
                <DropdownItem key="discord" href="https://discord.gg/rfmKzM6ASw" isExternal>
                  Discord
                </DropdownItem>
                <DropdownItem key="login" href="/login">
                  Log In
                </DropdownItem>
                <DropdownItem key="signup" href="/signup">
                  Sign Up
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )
        ) : (


        user && (
          <NavbarItem>
            <Link href="/create-post">
              <Button
                endContent={<SquarePen />}
                className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                variant="bordered"
              >
                Create Post
              </Button>
            </Link>
            <Spacer x={32} />
          </NavbarItem>
        )
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
              href="https://github.com/Dare2Jam/"
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
            <NavbarItem>
              <Link href="/signup">
                <Button
                  endContent={<NotebookPen />}
                  className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
                  variant="bordered"
                >
                  Sign up
                </Button>
              </Link>
            </NavbarItem>
          </div>
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Avatar src={user.profilePicture} />
            </DropdownTrigger>
            <DropdownMenu>
              
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
      )
      </NavbarContent> */
