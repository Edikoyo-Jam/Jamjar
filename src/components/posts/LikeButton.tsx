"use client";

import { Button } from "@nextui-org/react";
import { PostType } from "@/types/PostType";
import { Heart, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getCookie } from "@/helpers/cookie";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function LikeButton({ post }: { post: PostType }) {
  const [likes, setLikes] = useState<number>(post.likes.length);
  const [loading, setLoading] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const { theme } = useTheme();
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Button
      size="sm"
      variant="bordered"
      style={{
        color: post.hasLiked ? (theme == "dark" ? "#5ed4f7" : "#05b7eb") : "",
        borderColor: post.hasLiked
          ? theme == "dark"
            ? "#5ed4f744"
            : "#05b7eb44"
          : "",
      }}
      onPress={async () => {
        if (loading || liked) {
          return;
        }

        setLoading(true);
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
          setLoading(false);
          if (response.status == 401) {
            redirect("/login");
          } else {
            toast.error("An error occurred");
            return;
          }
        } else {
          const data = await response.json();
          setLikes(parseInt(data.likes));
          post.hasLiked = data.action === "like";
          setLoading(false);
          setLiked(data.action === "like");
          setTimeout(() => setLiked(false), 1000);
        }
      }}
    >
      {loading ? (
        <LoaderCircle className="animate-spin" size={16} />
      ) : (
        <div
          className="flex gap-2 items-center"
          style={{ position: "relative" }}
        >
          <Heart size={16} />
          <Heart
            size={16}
            className={
              liked && !reduceMotion
                ? "animate-ping absolute top-0 left-0"
                : "absolute top-0 left-0"
            }
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: "10",
            }}
          />
          <p>{likes}</p>
        </div>
      )}
    </Button>
  );
}
