"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { PostSort } from "@/types/PostSort";

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>();
  const [sort, setSort] = useState<PostSort>("newest");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/posts?sort=${sort}`
          : `http://localhost:3005/api/v1/posts?sort=${sort}`
      );
      setPosts(await response.json());
    };

    fetchPosts();
  }, [sort]);

  return (
    <div>
      <div className="flex justify-between p-4 pb-0">
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm" className="text-xs" variant="faded">
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setSort(key as PostSort);
              }}
              className="text-black"
            >
              <DropdownItem key="newest">Newest</DropdownItem>
              <DropdownItem key="top">Top</DropdownItem>
              <DropdownItem key="oldest">Oldest</DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
