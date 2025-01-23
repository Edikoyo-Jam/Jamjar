import Timers from "@/components/timers";
import Streams from "@/components/streams";
import ThemeVoting from "@/components/themes/theme-vote";

export default async function Home() {
  return (
    <div className="flex justify-between flex-wrap">
      <div className="md:w-2/3">
        <ThemeVoting />
      </div>
      <div>
        <Timers />
        <Streams />
      </div>
    </div>
  );
}
