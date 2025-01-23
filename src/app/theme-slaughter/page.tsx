import Timers from "@/components/timers";
import Streams from "@/components/streams";
import JamHeader from "@/components/jam-header";
import ThemeSlaughter from "@/components/themes/theme-slaughter";

export default async function Home() {
  return (
    <div className="flex justify-between flex-wrap">
      <div className="md:w-2/3">
        <ThemeSlaughter />
      </div>
      <div>
        <Timers />
        <Streams />
      </div>
    </div>
  );
}