import Posts from "@/components/posts";
import Timers from "@/components/timers";
import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <div>
      <div className="absolute left-0 top-0 w-full h-full z-0">
        <Image
          src="/images/bg.jpg"
          alt="Home background"
          className="object-cover w-full h-full"
          radius="none"
          loading="eager"
          removeWrapper
        />
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black/50 to-transparent z-10" />
      </div>
      <div className="z-10 relative flex">
        <div>
          <Posts />
        </div>
        <div className="w-1/3 flex justify-end">
          <Timers />
        </div>
      </div>
    </div>
  );
}
