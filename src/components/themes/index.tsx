"use client";

import React, { useState } from "react";

export default function ThemeSuggestions() {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!suggestion.trim()) {
      setErrorMessage("Suggestion cannot be empty.");
      setLoading(false);
      return;
    }

    try {
        const userId = localStorage.getItem("userId");
        const response = await fetch("http://localhost:3005/api/v1/themes/suggestion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
            },
            credentials: "include",
            body: JSON.stringify({ suggestionText: suggestion, userId }),
          });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit suggestion.");
      }

      setSuccessMessage("Suggestion added successfully!");
      setSuggestion(""); // Clear the input field
    } catch (error: any) {
      console.error("Error submitting suggestion:", error.message);
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Submit Your Theme Suggestion
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your theme suggestion..."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          rows={4}
        ></textarea>
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Suggestion"}
        </button>
      </form>
    </div>
  );
}