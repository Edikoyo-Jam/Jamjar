"use client";

import { UserType } from "@/types/UserType";
import { Avatar } from "@nextui-org/react";
import Image from "next/image";
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
        <div className="border-2 border-[#222224] relative rounded-xl overflow-hidden bg-[#18181a]">
          <div className="bg-[#222222] h-28 relative">
            {user.bannerPicture && (
              <Image
                src={user.bannerPicture}
                alt={`${user.name}'s profile banner`}
                className="object-cover"
                fill
              />
            )}
          </div>
          <Avatar
            className="absolute rounded-full left-16 top-16 h-24 w-24 bg-transparent"
            src={user.profilePicture}
          />
          <div className="p-8 mt-8">
            <p className="text-3xl">{user.name}</p>
            <div
              className="prose dark:prose-invert !duration-250 !ease-linear !transition-all"
              dangerouslySetInnerHTML={{
                __html:
                  user.bio && user.bio != "<p></p>" ? user.bio : "No user bio",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
  return <div></div>;
}
