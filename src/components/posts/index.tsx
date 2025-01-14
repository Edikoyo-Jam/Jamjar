"use client";

import { Button, Card, CardBody, Chip, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import PostCard from "./PostCard";

export default function Posts() {
  const [posts, setPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:3005/api/v1/posts");
      setPosts(await response.json());
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-3 p-4">
      {posts &&
        posts.map((post) => (
          <div key={post.key}>
            <PostCard post={post} />
          </div>
        ))}
    </div>
  );
}
