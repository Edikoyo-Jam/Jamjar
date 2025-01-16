"use client";

import { redirect } from "next/navigation";
import React, { useEffect } from "react";

export default function UserPage() {
  useEffect(() => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    redirect("/");
  });

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
      <p>Logging out...</p>
    </div>
  );
}
