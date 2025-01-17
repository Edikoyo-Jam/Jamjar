import { Calendar } from "lucide-react";

export default function JamHeader() {
  return (
    <div className="bg-[#124a88] flex rounded-2xl overflow-hidden">
      <div className="bg-[#1892b3] p-4 px-6 flex items-center gap-2 font-bold">
        <Calendar />
        <p>Dare2Jam 1</p>
      </div>
      <div className="p-4 px-6 font-bold">
        <p>April 4th - 7th</p>
      </div>
    </div>
  );
}
