"use client";

import { Button } from "@nextui-org/react";
import { PostType } from "@/types/PostType";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { getCookie } from "@/helpers/cookie";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LikeButton({ post }: { post: PostType }) {
  const [likes, setLikes] = useState<number>(post.likes.length);

  return (
    <Button
      size="sm"
      variant="bordered"
      onPress={async () => {
        const response = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? "https://d2jam.com/api/v1/like"
            : "http://localhost:3005/api/v1/like",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${getCookie("token")}`,
            },
            credentials: "include",
            body: JSON.stringify({
              username: getCookie("user"),
              postId: post.id,
            }),
          }
        );

        if (!response.ok) {
          if (response.status == 401) {
            redirect("/login");
          } else {
            toast.error("An error occured");
            return;
          }
        } else {
          setLikes(parseInt(await response.text()));
        }
      }}
    >
      <Heart size={16} /> {likes}
    </Button>
  );
}
