"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://jam.edikoyo.com/api/v1/posts");
      setPosts(await response.json());
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-3 p-4">
      {posts &&
        posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
    </div>
  );
  return <div></div>;
}
