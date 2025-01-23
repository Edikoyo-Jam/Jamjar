import Timers from "@/components/timers";
import Streams from "@/components/streams";
import ThemeSuggestions from "@/components/themes/theme-suggest";

export default async function Home() {
  return (
    <div className="flex justify-between flex-wrap">
      <div className="md:w-2/3">
        <ThemeSuggestions />
      </div>
      <div>
        <Timers />
        <Streams />
      </div>
    </div>
  );
}
