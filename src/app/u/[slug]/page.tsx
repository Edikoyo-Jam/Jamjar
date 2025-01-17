"use client";

import { UserType } from "@/types/UserType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const [user, setUser] = useState<UserType>();
  const { slug } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/user?slug=${slug}`
          : `http://localhost:3005/api/v1/user?slug=${slug}`
      );
      setUser(await response.json());
    };

    fetchUser();
  }, [slug]);

  return (
    <div>
      {user && (
        <div>
          <p>{user.name}</p>
        </div>
      )}
    </div>
  );
  return <div></div>;
}
