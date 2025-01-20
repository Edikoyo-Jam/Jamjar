"use client";

import { useState, useEffect } from "react";

export default function Timer({
  name,
  targetDate,
}: {
  name: string;
  targetDate: Date;
}) {
  const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - Date.now());
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      `${days} days ${hours.toString()} hours`,
      `${minutes.toString()} minutes ${seconds.toString()} seconds`,
    ];
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <p>{name}</p>
      <p className="text-4xl text-wrap">{formatTime(timeLeft)[0]}</p>
      <p className="text-4xl text-wrap">{formatTime(timeLeft)[1]}</p>
    </div>
  );
}
