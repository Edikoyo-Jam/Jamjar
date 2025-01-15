import {
  Navbar as NavbarBase,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import { Tooltip } from "@nextui-org/react";
import { SiDiscord, SiForgejo, SiGithub } from "@icons-pack/react-simple-icons";

export default function Navbar() {
  return (
    <NavbarBase
      shouldHideOnScroll
      maxWidth="2xl"
      className="bg-transparent p-1"
    >
      {/* <NavbarBrand>
        <Link
          href="/"
          className="duration-500 ease-in-out transition-all transform hover:scale-110"
        >
          <Image src="/images/aelios.png" width={160} />
        </Link>
      </NavbarBrand> */}
      <NavbarContent>
        {/* <NavbarItem>
          <Link
            href="/about"
            className="text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-110 hover:text-blue-700"
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/setup"
            className="text-white flex justify-center duration-500 ease-in-out transition-all transform hover:scale-110 hover:text-blue-700"
          >
            Setup
          </Link>
        </NavbarItem> */}
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
        {/* <NavbarItem>
          <Button
            endContent={<LogInIcon />}
            className="text-white border-white/50 hover:border-green-100/50 hover:text-green-100 hover:scale-110 transition-all transform duration-500 ease-in-out"
            variant="bordered"
          >
            Log In
          </Button>
        </NavbarItem> */}
      </NavbarContent>
    </NavbarBase>
  );
}
