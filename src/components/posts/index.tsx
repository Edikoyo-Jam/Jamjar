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
import { PostStyle } from "@/types/PostStyle";
import { getCookie } from "@/helpers/cookie";
import { UserType } from "@/types/UserType";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>();
  const [sort, setSort] = useState<PostSort>("newest");
  const [style, setStyle] = useState<PostStyle>("cozy");
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserAndPosts = async () => {
      setLoading(true);
      // Fetch the user
      const userResponse = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/self?username=${getCookie("user")}`
          : `http://localhost:3005/api/v1/self?username=${getCookie("user")}`,
        {
          headers: { authorization: `Bearer ${getCookie("token")}` },
          credentials: "include",
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch posts with userSlug if user is available
        const postsResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&user=${userData.slug}`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&user=${userData.slug}`
        );
        setPosts(await postsResponse.json());
        setLoading(false);
      } else {
        setUser(undefined);

        // Fetch posts without userSlug if user is not available
        const postsResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? `https://d2jam.com/api/v1/posts?sort=${sort}`
            : `http://localhost:3005/api/v1/posts?sort=${sort}`
        );
        setPosts(await postsResponse.json());
        setLoading(false);
      }
    };

    loadUserAndPosts();
  }, [sort]);

  return (
    <div>
      <div className="flex justify-between p-4 pb-0">
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                className="text-xs bg-white dark:bg-[#252525] !duration-250 !ease-linear !transition-all text-[#333] dark:text-white"
                variant="faded"
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setSort(key as PostSort);
              }}
              className="text-[#333] dark:text-white"
            >
              <DropdownItem key="newest">Newest</DropdownItem>
              <DropdownItem key="top">Top</DropdownItem>
              <DropdownItem key="oldest">Oldest</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            size="sm"
            className="text-xs bg-white dark:bg-[#252525] !duration-250 !ease-linear !transition-all text-[#333] dark:text-white"
            variant="faded"
            onPress={() => {
              toast.warning("Flair filtering functionality coming soon");
            }}
          >
            All Tags
          </Button>
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                className="text-xs bg-white dark:bg-[#252525] !duration-250 !ease-linear !transition-all text-[#333] dark:text-white"
                variant="faded"
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setStyle(key as PostStyle);
              }}
              className="text-[#333] dark:text-white"
            >
              <DropdownItem key="cozy">Cozy</DropdownItem>
              <DropdownItem key="compact">Compact</DropdownItem>
              <DropdownItem key="ultra">Ultra Compact</DropdownItem>
              <DropdownItem key="adaptive">Adaptive</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <LoaderCircle
            className="animate-spin text-[#333] dark:text-[#999]"
            size={24}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {posts &&
            posts.map((post) => (
              <PostCard key={post.id} post={post} style={style} user={user} />
            ))}
        </div>
      )}
    </div>
  );
  return <div></div>;
}
