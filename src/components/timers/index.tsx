import Timer from "./Timer";

export default function Timers() {
  return (
    <div>
      <Timer
        name="Jam Start"
        targetDate={new Date("2025-04-04T18:00:00-05:00")}
      />
    </div>
  );
}
