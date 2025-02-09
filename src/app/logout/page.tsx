"use client";

import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export default function UserPage() {
  useEffect(() => {
    async function logout() {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/session"
          : "http://localhost:3005/api/v1/session",
        { method: "DELETE", credentials: "include" }
      );

      if (response.ok) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        toast.success("Successfully logged out");
        redirect("/");
      } else {
        toast.error("Error while trying to log out");
      }
    }

    logout();
  });

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
      <p>Logging out...</p>
    </div>
  );
}
