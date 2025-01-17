"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";
import { Button } from "@nextui-org/react";

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? "https://d2jam.com/api/v1/posts"
          : "http://localhost:3005/api/v1/posts"
      );
      setPosts(await response.json());
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex justify-between p-4 pb-0">
        <div className="flex gap-2">
          <Button size="sm" className="text-xs" variant="faded">
            Newest
          </Button>
          <Button size="sm" className="text-xs" variant="faded">
            All Tags
          </Button>
        </div>
        <div>
          <Button size="sm" className="text-xs" variant="faded">
            Cozy
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {posts &&
          posts.map((post) => (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
      </div>
    </div>
  );
  return <div></div>;
}
