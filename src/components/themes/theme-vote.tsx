"use client";

import React, { useState, useEffect } from "react";
import { getCookie } from "@/helpers/cookie";
import { getCurrentJam, hasJoinedCurrentJam , ActiveJamResponse } from "@/helpers/jam";

export default function VotingPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeJamResponse, setActiveJamResponse] = useState<ActiveJamResponse | null>(null);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [phaseLoading, setPhaseLoading] = useState(true); // Loading state for fetching phase
  const token = getCookie("token");

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

  // Fetch top N themes with voting scores
  const fetchThemes = async () => {
    if (!token || !activeJamResponse) return;
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/themes/top-themes"
          : "http://localhost:3005/api/v1/themes/top-themes",
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (response.ok) {
        const themes = await response.json();
        console.log("Fetched themes:", themes); // Debug log
        
        // Fetch user's votes for these themes
        const votesResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? "https://d2jam.com/api/v1/themes/votes"
            : "http://localhost:3005/api/v1/themes/votes",
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
  
        if (votesResponse.ok) {
          const votes = await votesResponse.json();
          console.log("Fetched votes:", votes); // Debug log
          
          // Merge themes with user's votes
          const themesWithVotes = themes.map(theme => {
            const vote = votes.find(v => v.themeSuggestionId === theme.id);
            console.log(`Theme ${theme.id} vote:`, vote); // Debug log
            return {
              ...theme,
              votingScore: vote ? vote.votingScore : null
            };
          });
          
          console.log("Themes with votes:", themesWithVotes); // Debug log
          setThemes(themesWithVotes);
        }
      } else {
        console.error("Failed to fetch themes.");
      }
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  };

  
  // Fetch themes only when phase is "Voting"
  useEffect(() => {
    if (activeJamResponse?.phase === "Voting") {
      fetchThemes();
    }
  }, [activeJamResponse]);

  // Handle voting
  const handleVote = async (themeId, votingScore) => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/themes/vote"
          : "http://localhost:3005/api/v1/themes/vote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ suggestionId: themeId, votingScore }),
        }
      );
  
      if (response.ok) {
        // Just update the local state instead of re-fetching all themes
        setThemes((prevThemes) =>
          prevThemes.map((theme) =>
            theme.id === themeId 
              ? { ...theme, votingScore } 
              : theme
          )
        );
      } else {
        console.error("Failed to submit vote.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const joined = await hasJoinedCurrentJam();
      setHasJoined(joined);
      setLoading(false);
    };

    init();
  }, []);


  if (phaseLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!hasJoined) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Join the Jam First
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You need to join the current jam before you can vote themes.
        </p>
        <button
          onClick={() => joinJam(activeJamResponse?.jam?.id)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Join Jam
        </button>
      </div>
    );
  }


  if (activeJamResponse?.phase !== "Voting") {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Not in Voting Phase
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The current phase is <strong>{activeJamResponse?.phase || "Unknown"}</strong>. Please come back during the Voting phase.
        </p>
      </div>
    );
  }

  const loggedIn = getCookie("token");
    
    if (!loggedIn) {
    return (
        <div>Sign in to be able to vote</div>
    );
    }

  return (
    <div className="p-3 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Voting Phase
      </h1>
      <div className="space-y-2">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-md flex items-center"
          >
            {/* Voting Buttons */}
            <div className="flex gap-1 mr-4">
              <button
                onClick={() => handleVote(theme.id, -1)}
                className={`px-3 py-2 rounded-lg ${
                  theme.votingScore === -1
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-black hover:bg-red-500 hover:text-white"
                }`}
                disabled={loading}
              >
                -1
              </button>
              <button
                onClick={() => handleVote(theme.id, 0)}
                className={`px-3 py-2 rounded-lg ${
                  theme.votingScore === 0
                    ? "bg-gray-500 text-white"
                    : "bg-gray-300 text-black hover:bg-gray-500 hover:text-white"
                }`}
                disabled={loading}
              >
                0
              </button>
              <button
                onClick={() => handleVote(theme.id, +1)}
                className={`px-3 py-2 rounded-lg ${
                  theme.votingScore === +1
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-black hover:bg-green-500 hover:text-white"
                }`}
                disabled={loading}
              >
                +1
              </button>
            </div>

            {/* Theme Suggestion */}
            <div className="text-gray-800 dark:text-white">{theme.suggestion}</div>
          </div>
        ))}
      </div>
    </div>
  );
}