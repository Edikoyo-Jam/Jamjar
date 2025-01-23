"use client";

import { ReactNode, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  Check,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  ClockArrowDown,
  ClockArrowUp,
  LoaderCircle,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { PostTime } from "@/types/PostTimes";
import { TagType } from "@/types/TagType";
import { useTheme } from "next-themes";
import StickyPostCard from "./StickyPostCard";

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>();
  const [stickyPosts, setStickyPosts] = useState<PostType[]>();
  const [sort, setSort] = useState<PostSort>("newest");
  const [time, setTime] = useState<PostTime>("all");
  const [style, setStyle] = useState<PostStyle>("cozy");
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<{
    [category: string]: { tags: TagType[]; priority: number };
  }>();
  const [tagRules, setTagRules] = useState<{ [key: number]: number }>();
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const { theme } = useTheme();

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

  useEffect(() => {
    const loadUserAndPosts = async () => {
      setLoading(true);

      const tagResponse = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/tags`
          : `http://localhost:3005/api/v1/tags`
      );

      if (tagResponse.ok) {
        const tagObject: {
          [category: string]: { tags: TagType[]; priority: number };
        } = {};

        for (const tag of await tagResponse.json()) {
          if (tag.name == "D2Jam") {
            continue;
          }

          if (tag.category) {
            if (tag.category.name in tagObject) {
              tagObject[tag.category.name].tags.push(tag);
            } else {
              tagObject[tag.category.name] = {
                tags: [tag],
                priority: tag.category.priority,
              };
            }
          }
        }

        setTags(tagObject);
      }

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
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&user=${
                userData.slug
              }&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key) => `${key}`)
                      .join("_")
                  : ""
              }`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&user=${
                userData.slug
              }&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key) => `${key}`)
                      .join("_")
                  : ""
              }`
        );
        setPosts(await postsResponse.json());

        // Sticky posts
        // Fetch posts with userSlug if user is available
        const stickyPostsResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&user=${
                userData.slug
              }&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key) => `${key}`)
                      .join("_")
                  : ""
              }&sticky=true`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&user=${
                userData.slug
              }&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key) => `${key}`)
                      .join("_")
                  : ""
              }&sticky=true`
        );
        setStickyPosts(await stickyPostsResponse.json());
        setLoading(false);
      } else {
        setUser(undefined);

        // Fetch posts without userSlug if user is not available
        const postsResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key, value) => `${key}-${value}`)
                      .join("_")
                  : ""
              }`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key, value) => `${key}-${value}`)
                      .join("_")
                  : ""
              }`
        );
        setPosts(await postsResponse.json());

        // Fetch posts without userSlug if user is not available
        const stickyPostsResponse = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? `https://d2jam.com/api/v1/posts?sort=${sort}&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key, value) => `${key}-${value}`)
                      .join("_")
                  : ""
              }&sticky=true`
            : `http://localhost:3005/api/v1/posts?sort=${sort}&time=${time}&tags=${
                tagRules
                  ? Object.entries(tagRules)
                      .map((key, value) => `${key}-${value}`)
                      .join("_")
                  : ""
              }&sticky=true`
        );
        setStickyPosts(await stickyPostsResponse.json());
        setLoading(false);
      }
    };

    loadUserAndPosts();
  }, [sort, time, tagRules]);

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
      name: "All Time",
      icon: <Sparkles />,
      description: "Shows all posts",
    },
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center p-6">
          <LoaderCircle
            className="animate-spin text-[#333] dark:text-[#999]"
            size={24}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {stickyPosts &&
            stickyPosts.length > 0 &&
            stickyPosts.map((post) => (
              <StickyPostCard key={post.id} post={post} />
            ))}
        </div>
      )}

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
          <Popover placement="bottom" showArrow backdrop="opaque">
            <PopoverTrigger>
              <Button
                size="sm"
                className="text-xs bg-white dark:bg-[#252525] !duration-250 !ease-linear !transition-all text-[#333] dark:text-white"
                variant="faded"
              >
                {tagRules && Object.keys(tagRules).length > 0
                  ? "Custom Tags"
                  : "All Tags"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 max-w-[800px] max-h-[400px] overflow-y-scroll">
                <p className="text-2xl">Tag Filtering</p>
                {tags && Object.keys(tags).length > 0 ? (
                  Object.keys(tags)
                    .sort(
                      (tag1, tag2) => tags[tag2].priority - tags[tag1].priority
                    )
                    .map((category: string) => (
                      <div key={category} className="w-full">
                        <p>{category}</p>
                        <div className="flex gap-1 flex-wrap p-4 w-full">
                          {tags[category].tags.map((tag) => (
                            <Chip
                              size="sm"
                              variant="faded"
                              avatar={
                                tag.icon && (
                                  <Avatar
                                    src={tag.icon}
                                    classNames={{ base: "bg-transparent" }}
                                  />
                                )
                              }
                              key={tag.id}
                              onClick={() => {
                                if (!tagRules) {
                                  setTagRules({ [tag.id]: 1 });
                                } else {
                                  if (tag.id in tagRules) {
                                    if (tagRules[tag.id] === 1) {
                                      setTagRules({
                                        ...tagRules,
                                        [tag.id]: -1,
                                      });
                                    } else {
                                      const updatedRules = { ...tagRules };
                                      delete updatedRules[tag.id];
                                      setTagRules(updatedRules);
                                    }
                                  } else {
                                    setTagRules({ ...tagRules, [tag.id]: 1 });
                                  }
                                }
                              }}
                              className={`transition-all transform duration-500 ease-in-out cursor-pointer ${
                                !reduceMotion ? "hover:scale-110" : ""
                              }`}
                              style={{
                                color:
                                  tagRules && tag.id in tagRules
                                    ? tagRules[tag.id] === 1
                                      ? theme == "dark"
                                        ? "#5ed4f7"
                                        : "#05b7eb"
                                      : theme == "dark"
                                      ? "#f78e5e"
                                      : "#eb2b05"
                                    : "",
                                borderColor:
                                  tagRules && tag.id in tagRules
                                    ? tagRules[tag.id] === 1
                                      ? theme == "dark"
                                        ? "#5ed4f7"
                                        : "#05b7eb"
                                      : theme == "dark"
                                      ? "#f78e5e"
                                      : "#eb2b05"
                                    : "",
                              }}
                              endContent={
                                tagRules &&
                                tag.id in tagRules &&
                                (tagRules[tag.id] === 1 ? (
                                  <Check size={16} />
                                ) : (
                                  <X size={16} />
                                ))
                              }
                            >
                              {tag.name}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No tags could be found</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
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
