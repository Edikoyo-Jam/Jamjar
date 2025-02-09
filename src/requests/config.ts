export const BASE_URL =
  process.env.NEXT_PUBLIC_MODE === "PROD"
    ? "https://d2jam.com/api/v1"
    : "http://localhost:3005/api/v1";
