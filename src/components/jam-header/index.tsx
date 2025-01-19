import { Calendar } from "lucide-react";

export default function JamHeader() {
  return (
    <div className="bg-[#7090b9] dark:bg-[#124a88] flex rounded-2xl overflow-hidden text-white transition-color duration-500 ease-in-out">
      <div className="bg-[#85bdd2] dark:bg-[#1892b3] p-4 px-6 flex items-center gap-2 font-bold transition-color duration-500 ease-in-out">
        <Calendar />
        <p>Dare2Jam 1</p>
      </div>
      <div className="p-4 px-6 font-bold">
        <p>April 4th - 7th</p>
      </div>
    </div>
  );
}
