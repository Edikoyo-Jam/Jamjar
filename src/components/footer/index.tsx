import IconLink from "../link-components/IconLink";
import { SiDiscord, SiForgejo, SiGithub } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <div className="p-8 bg-[#222] mt-8 border-t-2 border-white/15">
      <div className="flex justify-between">
        <div></div>
        <div className="flex gap-3">
          <IconLink icon={<SiGithub />} href="https://github.com/Dare2Jam" />
          <IconLink
            icon={<SiForgejo />}
            href="https://git.edikoyo.com/Ategon/Jamjar"
          />
          <IconLink icon={<SiDiscord />} href="https://discord.d2jam.com" />
        </div>
      </div>
    </div>
  );
}
