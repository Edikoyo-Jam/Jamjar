import { JamType } from "@/types/JamType";
import { getCookie } from "./cookie";
import { toast } from "react-toastify";

export interface ActiveJamResponse {
  phase: string;
  jam: JamType | null; // Jam will be null if no active jam is found
}

export async function getJams(): Promise<JamType[]> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_MODE === "PROD"
      ? "https://d2jam.com/api/v1/jams"
      : "http://localhost:3005/api/v1/jams"
  );

  return response.json();
}

export async function getCurrentJam(): Promise<ActiveJamResponse | null> {
  
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_MODE === "PROD"
        ? "https://d2jam.com/api/v1/jams"
        : "http://localhost:3005/api/v1/jams/active"
    );

    // Parse JSON response
      const data = await response.json();

      // Return the phase and jam details
      return {
        phase: data.phase,
        jam: data.jam,
      };

    } catch (error) {
      console.error("Error fetching active jam:", error);
      return null;
    }

}

export async function joinJam(jamId: number) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_MODE === "PROD"
      ? "https://d2jam.com/api/v1/join-jam"
      : "http://localhost:3005/api/v1/join-jam",
    {
      body: JSON.stringify({
        jamId: jamId,
        userSlug: getCookie("user"),
      }),
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getCookie("token")}`,
      },
    }
  );

  if (response.status == 401) {
    toast.error("You have already joined the jam");
    return false;
  } else if (response.ok) {
    toast.success("Joined jam");
    return true;
  } else {
    toast.error("Error while trying to join jam");
    return false;
  }
}

export async function hasJoinedCurrentJam(): Promise<boolean> {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_MODE === "PROD"
        ? "https://d2jam.com/api/v1/participation"
        : "http://localhost:3005/api/v1/participation",
      {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Error checking jam participation:", error);
    return false;
  }
}