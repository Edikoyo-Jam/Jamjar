"use client"
import { Spacer } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import { getCurrentJam, ActiveJamResponse } from "@/helpers/jam";



export default function Timers() {

  const [activeJamResponse, setActiveJamResponse] = useState<ActiveJamResponse | null>(null);
  const [phaseLoading, setPhaseLoading] = useState(true); // Loading state for fetching phase

  // Fetch the current jam phase using helpers/jam
  useEffect(() => {
    const fetchCurrentJamPhase = async () => {
      try {
        const activeJam = await getCurrentJam();
        setActiveJamResponse(activeJam); // Set active jam details
      } catch (error) {
        console.error("Error fetching current jam:", error);
      } finally {
        setPhaseLoading(false); // Stop loading when phase is fetched
      }
    };

    fetchCurrentJamPhase();
  }, []);

  if(activeJamResponse && activeJamResponse.jam)
  {
    return (
      <div className="text-[#333] dark:text-white transition-color duration-250">
        <Timer
          name="Jam Start"
          targetDate={new Date(activeJamResponse.jam.startTime)}
        />
        <Spacer y={8} />
        <p>Site under construction</p>
      </div>
    );
  }
  else
  {
    return (
      <div className="text-[#333] dark:text-white transition-color duration-250">
        No upcoming jams
        <Spacer y={8} />
        <p>Site under construction</p>
      </div>
    )
  }
  
}
