"use client"
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentJam, ActiveJamResponse } from "../../helpers/jam"
import ThemeSuggestions from "../themes";

export default function JamHeader() {

  const [activeJamResponse, setActiveJam] = useState<ActiveJamResponse | null>(null);

  useEffect(() => {
    const fetchActiveJam = async () => {
      const jamData = await getCurrentJam();
      setActiveJam(jamData);
    };

    fetchActiveJam();
  }, []);


  return (
    <div className="bg-[#7090b9] dark:bg-[#124a88] flex flex-col rounded-2xl overflow-hidden text-white transition-color duration-250">
      {/* Jam Header */}
      <div className="flex">
        <div className="bg-[#85bdd2] dark:bg-[#1892b3] p-4 px-6 flex items-center gap-2 font-bold transition-color duration-250">
          <Calendar />
          <p>
            {activeJamResponse?.jam && activeJamResponse.phase ? (
              <span className="text-sm font-normal">
                {activeJamResponse?.jam.name} - {activeJamResponse.phase} Phase
              </span>
            ) : (
              <span className="text-sm font-normal">(No Active Jams)</span>
            )}
          </p>
        </div>
        <div className="p-4 px-6 font-bold">
          <p>April 4th - 7th</p>
        </div>
      </div>
  
      {/* Conditional Link for Suggestion Phase */}
      {activeJamResponse?.phase === "Suggestion" && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 text-center rounded-b-2x transition-color duration-250">
          <a
            href="/theme-suggestion"
            className="text-blue-300 dark:text-blue-500 hover:underline font-semibold transition-color duration-250"
          >
            Go to Theme Suggestion Page
          </a>
          <ThemeSuggestions />
        </div>
      )}
    </div>
  );
}
