import { Spacer } from "@nextui-org/react";
import Timer from "./Timer";

export default function Timers() {
  return (
    <div className="text-[#333] dark:text-white ease-in-out transition-color duration-500">
      <Timer
        name="Jam Start"
        targetDate={new Date("2025-04-04T18:00:00-05:00")}
      />
      <Spacer y={8} />
      <p>Site under construction</p>
    </div>
  );
}
