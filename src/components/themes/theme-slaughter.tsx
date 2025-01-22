"use client";

import React, { useState, useEffect } from "react";
import { getCookie } from "@/helpers/cookie";
import { getCurrentJam,ActiveJamResponse } from "@/helpers/jam";

export default function ThemeSlaughter() {   

  const [randomTheme, setRandomTheme] = useState(null);
  const [votedThemes, setVotedThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null); // Store token after fetching it on the client
  const [activeJamResponse, setActiveJam] = useState<ActiveJamResponse | null>(null);
  const [phaseLoading, setPhaseLoading] = useState(true); // Loading state for fetching phase

  // Fetch token on the client side
  useEffect(() => {
    const fetchedToken = getCookie("token");
    setToken(fetchedToken);
  }, []);

    // Fetch the current jam phase using helpers/jam
    useEffect(() => {
    const fetchCurrentJamPhase = async () => {
      try {
        const activeJam = await getCurrentJam();
        setActiveJam(activeJam); // Set active jam details
      } catch (error) {
        console.error("Error fetching current jam:", error);
      } finally {
        setPhaseLoading(false); // Stop loading when phase is fetched
      }
    };

    fetchCurrentJamPhase();
  }, []);


  // Fetch a random theme
  const fetchRandomTheme = async () => {
    if (!token) return; // Wait until token is available
    if( !activeJamResponse) return;
    if(activeJamResponse && activeJamResponse.jam && activeJamResponse.phase != "Survival")
        {
            return (
                <div>
                <h1>It's not Theme Survival phase.</h1>
                </div>
            );
        }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/themes/random"
          : "http://localhost:3005/api/v1/themes/random",
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRandomTheme(data);
      } else {
        console.error("Failed to fetch random theme.");
      }
    } catch (error) {
      console.error("Error fetching random theme:", error);
    }
  };

  // Fetch voted themes
  const fetchVotedThemes = async () => {
    if (!token) return; // Wait until token is available

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/themes/voteSlaughter"
          : "http://localhost:3005/api/v1/themes/voteSlaughter",
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVotedThemes(data);
      } else {
        console.error("Failed to fetch voted themes.");
      }
    } catch (error) {
      console.error("Error fetching voted themes:", error);
    }
  };

  // Handle voting
  const handleVote = async (voteType) => {
    if (!randomTheme) return;

    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/themes/voteSlaughter"
          : "http://localhost:3005/api/v1/themes/voteSlaughter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            suggestionId: randomTheme.id,
            voteType,
          }),
        }
      );

      if (response.ok) {
        // Refresh data after voting
        fetchRandomTheme();
        fetchVotedThemes();
      } else {
        console.error("Failed to submit vote.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle resetting a vote from the grid
  const handleResetVote = async (themeId) => {
    try {
      setRandomTheme(votedThemes.find((theme) => theme.id === themeId));
      setVotedThemes((prev) =>
        prev.map((theme) =>
          theme.id === themeId ? { ...theme, slaughterScore: 0 } : theme
        )
      );
    } catch (error) {
      console.error("Error resetting vote:", error);
    }
  };


  useEffect(() => {
    if (token && activeJamResponse?.phase === "Survival") {
      fetchRandomTheme();
      fetchVotedThemes();
    }
  }, [token, activeJamResponse]);

  // Render loading state while fetching phase
  if (phaseLoading) {
    return <div>Loading...</div>;
  }  

  // Render message if not in Theme Slaughter phase
  if (activeJamResponse?.phase !== "Survival") {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Not in Theme Slaughter Phase
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The current phase is <strong>{activeJamResponse?.phase || "Unknown"}</strong>. Please come back during the Theme Slaughter phase.
        </p>
      </div>
    );
  }

  const loggedIn = getCookie("token");
  
    if (!loggedIn) {
      return (
        <div>Sign in to be able to join the Theme Survival</div>
      );
    }
  

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 p-6 bg-gray-100 dark:bg-gray-800 flex flex-col justify-start items-center">
        {randomTheme ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {randomTheme.suggestion}
            </h2>
            <div className="flex gap-4">
            <button
                onClick={() => handleVote("YES")}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                disabled={loading}
              >
                YES
              </button>
              <button
                onClick={() => handleVote("NO")}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                disabled={loading}
              >
                NO
              </button>
              <button
                onClick={() => handleVote("SKIP")}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
                disabled={loading}
              >
                SKIP
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No themes available.</p>
        )}
      </div>

      {/* Right Side */}
      <div className="w-1/2 p-6 bg-white dark:bg-gray-900 overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Your Votes
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {votedThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleResetVote(theme.id)}
              className={`p-4 rounded-lg cursor-pointer ${
                theme.slaughterScore > 0
                  ? "bg-green-500 text-white"
                  : theme.slaughterScore < 0
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {theme.suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}