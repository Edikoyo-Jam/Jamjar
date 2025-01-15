"use client";

import { useState, useEffect } from "react";

export default function Timer({
  name,
  targetDate,
}: {
  name: String;
  targetDate: Date;
}) {
  const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = targetDate.getTime() - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    // const minutes = Math.floor((totalSeconds % 3600) / 60);
    // const seconds = totalSeconds % 60;

    return `${days} days ${hours.toString()} hours`;
  };

  return (
    <div>
      <p>{name}</p>
      <p className="text-4xl">{formatTime(timeLeft)}</p>
    </div>
  );
}
