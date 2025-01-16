import { JamType } from "@/types/JamType";
import { getCookie } from "./cookie";
import { toast } from "react-toastify";

export async function getJams(): Promise<JamType[]> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_MODE === "PROD"
      ? "https://d2jam.com/api/v1/jams"
      : "http://localhost:3005/api/v1/jams"
  );

  return response.json();
}

export async function getCurrentJam(): Promise<JamType | null> {
  const jams = await getJams();
  const now = new Date();

  // Get only jams that happen in the future
  const futureJams = jams.filter((jam) => new Date(jam.startTime) > now);

  // If theres no jams happening returns null
  if (futureJams.length === 0) {
    return null;
  }

  // Sort future jams by startTime (earliest first)
  futureJams.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return futureJams[0];
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
