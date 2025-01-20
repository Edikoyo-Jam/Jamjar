"use client";

import { ReactNode, useEffect, useState } from "react";
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
import {
  Calendar,
  Calendar1,
  CalendarArrowDown,
  CalendarCog,
  CalendarDays,
  CalendarFold,
  CalendarRange,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  ClockArrowDown,
  ClockArrowUp,
  LoaderCircle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { toast } from "react-toastify";
import { PostTime } from "@/types/PostTimes";

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>();
  const [sort, setSort] = useState<PostSort>("newest");
  const [time, setTime] = useState<PostTime>("all");
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
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&user=${userData.slug}&time=${time}`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&user=${userData.slug}&time=${time}`
        );
        setPosts(await postsResponse.json());
        setLoading(false);
      } else {
        setUser(undefined);

        // Fetch posts without userSlug if user is not available
        const postsResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&time=${time}`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&time=${time}`
        );
        setPosts(await postsResponse.json());
        setLoading(false);
      }
    };

    loadUserAndPosts();
  }, [sort, time]);

  const sorts: Record<
    PostSort,
    { name: string; icon: ReactNode; description: string }
  > = {
    top: {
      name: "Top",
      icon: <Trophy />,
      description: "Shows the most liked posts first",
    },
    newest: {
      name: "Newest",
      icon: <ClockArrowUp />,
      description: "Shows the newest posts first",
    },
    oldest: {
      name: "Oldest",
      icon: <ClockArrowDown />,
      description: "Shows the oldest posts first",
    },
  };

  const times: Record<
    PostTime,
    { name: string; icon: ReactNode; description: string }
  > = {
    hour: {
      name: "Hour",
      icon: <Clock1 />,
      description: "Shows posts from the last hour",
    },
    three_hours: {
      name: "Three Hours",
      icon: <Clock2 />,
      description: "Shows posts from the last three hours",
    },
    six_hours: {
      name: "Six Hours",
      icon: <Clock3 />,
      description: "Shows posts from the last six hours",
    },
    twelve_hours: {
      name: "Twelve Hours",
      icon: <Clock4 />,
      description: "Shows posts from the last twelve hours",
    },
    day: {
      name: "Day",
      icon: <Calendar />,
      description: "Shows posts from the last day",
    },
    week: {
      name: "Week",
      icon: <CalendarDays />,
      description: "Shows posts from the last week",
    },
    month: {
      name: "Month",
      icon: <CalendarRange />,
      description: "Shows posts from the last month",
    },
    three_months: {
      name: "Three Months",
      icon: <CalendarFold />,
      description: "Shows posts from the last three months",
    },
    six_months: {
      name: "Six Months",
      icon: <CalendarCog />,
      description: "Shows posts from the last six months",
    },
    nine_months: {
      name: "Nine Months",
      icon: <CalendarArrowDown />,
      description: "Shows posts from the last nine months",
    },
    year: {
      name: "Year",
      icon: <Calendar1 />,
      description: "Shows posts from the last year",
    },
    all: {
      name: "All Times",
      icon: <Sparkles />,
      description: "Shows all posts",
    },
  };

  return (
    <div>
      <div className="flex justify-between p-4 pb-0">
        <div className="flex gap-2">
          <Dropdown backdrop="opaque">
            <DropdownTrigger>
              <Button
                size="sm"
                className="text-xs bg-white dark:bg-[#252525] !duration-250 !ease-linear !transition-all text-[#333] dark:text-white"
                variant="faded"
              >
                {sorts[sort]?.name}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setSort(key as PostSort);
              }}
              className="text-[#333] dark:text-white"
            >
              {Object.entries(sorts).map(([key, sort]) => (
                <DropdownItem
                  key={key}
                  startContent={sort.icon}
                  description={sort.description}
                >
                  {sort.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown backdrop="opaque">
            <DropdownTrigger>
              <Button
                size="sm"
                className="text-xs bg-white dark:bg-[#252525] !duration-250 !ease-linear !transition-all text-[#333] dark:text-white"
                variant="faded"
              >
                {times[time]?.name}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setTime(key as PostTime);
              }}
              className="text-[#333] dark:text-white"
            >
              {Object.entries(times).map(([key, sort]) => (
                <DropdownItem
                  key={key}
                  startContent={sort.icon}
                  description={sort.description}
                >
                  {sort.name}
                </DropdownItem>
              ))}
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
          <Dropdown backdrop="opaque">
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
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} style={style} user={user} />
            ))
          ) : (
            <p className="text-center text-[#333] dark:text-white transition-color duration-250 ease-linear">
              No posts match your filters
            </p>
          )}
        </div>
      )}
    </div>
  );
  return <div></div>;
}
