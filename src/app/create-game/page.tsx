"use client";

import Editor from "@/components/editor";
import { getCookie, hasCookie } from "@/helpers/cookie";
import { Avatar, Button, Form, Input, Spacer } from "@nextui-org/react";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import sanitizeHtml from "sanitize-html";
import Select, { MultiValue, StylesConfig } from "react-select";
import { useTheme } from "next-themes";
import Timers from "@/components/timers";
import Streams from "@/components/streams";

export default function CreateGamePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [waitingPost, setWaitingPost] = useState(false);
  const [selectedTags, setSelectedTags] = useState<MultiValue<{
    value: string;
    label: ReactNode;
    isFixed: boolean;
  }> | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [options, setOptions] = useState<
    {
      value: string;
      label: ReactNode;
      id: number;
      isFixed: boolean;
    }[]
  >();
  const { theme } = useTheme();
  // Add these state variables after existing useState declarations
const [windowsLink, setWindowsLink] = useState("");
const [linuxLink, setLinuxLink] = useState("");
const [macLink, setMacLink] = useState("");
const [webGLLink, setWebGLLink] = useState("");
const [gameSlug, setGameSlug] = useState("");
const [thumbnailUrl, setThumbnailUrl] = useState("");
const [authorSearch, setAuthorSearch] = useState("");
const [selectedAuthors, setSelectedAuthors] = useState<Array<{id: number, name: string}>>([]);
const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string }>>([]);

// Add this function to handle author search
const handleAuthorSearch = async (query: string) => {
  if (query.length < 2) return;
  
  const response = await fetch(
    process.env.NEXT_PUBLIC_MODE === "PROD"
      ? `https://d2jam.com/api/v1/users/search?q=${query}`
      : `http://localhost:3005/api/v1/users/search?q=${query}`,
    {
      headers: { authorization: `Bearer ${getCookie("token")}` },
      credentials: "include",
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    setSearchResults(data);
  }
};

  useEffect(() => {
    setMounted(true);

    const load = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/self?username=${getCookie("user")}`
          : `http://localhost:3005/api/v1/self?username=${getCookie("user")}`,
        {
          headers: { authorization: `Bearer ${getCookie("token")}` },
          credentials: "include",
        }
      );

      const user = await response.json();

      const tagResponse = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/tags`
          : `http://localhost:3005/api/v1/tags`
      );

      if (tagResponse.ok) {
        const newoptions: {
          value: string;
          label: ReactNode;
          id: number;
          isFixed: boolean;
        }[] = [];

        for (const tag of await tagResponse.json()) {
          if (tag.modOnly && !user.mod) {
            continue;
          }
          newoptions.push({
            value: tag.name,
            id: tag.id,
            label: (
              <div className="flex gap-2 items-center">
                {tag.icon && (
                  <Avatar
                    className="w-6 h-6 min-w-6 min-h-6"
                    size="sm"
                    src={tag.icon}
                    classNames={{ base: "bg-transparent" }}
                  />
                )}
                <p>
                  {tag.name}
                  {tag.modOnly ? " (Mod Only)" : ""}
                </p>
              </div>
            ),
            isFixed: tag.alwaysAdded,
          });
        }

        setOptions(newoptions);
        setSelectedTags(newoptions.filter((tag) => tag.isFixed));
      }
    };
    load();
  }, []);

  const styles: StylesConfig<
    {
      value: string;
      label: ReactNode;
      isFixed: boolean;
    },
    true
  > = {
    multiValue: (base, state) => {
      return {
        ...base,
        backgroundColor: state.data.isFixed
          ? theme == "dark"
            ? "#222"
            : "#ddd"
          : theme == "dark"
          ? "#444"
          : "#eee",
      };
    },
    multiValueLabel: (base, state) => {
      return {
        ...base,
        color: state.data.isFixed
          ? theme == "dark"
            ? "#ddd"
            : "#222"
          : theme == "dark"
          ? "#fff"
          : "#444",
        fontWeight: state.data.isFixed ? "normal" : "bold",
        paddingRight: state.data.isFixed ? "8px" : "2px",
      };
    },
    multiValueRemove: (base, state) => {
      return {
        ...base,
        display: state.data.isFixed ? "none" : "flex",
        color: theme == "dark" ? "#ddd" : "#222",
      };
    },
    control: (styles) => ({
      ...styles,
      backgroundColor: theme == "dark" ? "#181818" : "#fff",
      minWidth: "300px",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: theme == "dark" ? "#181818" : "#fff",
      color: theme == "dark" ? "#fff" : "#444",
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused
        ? theme == "dark"
          ? "#333"
          : "#ddd"
        : undefined,
    }),
  };

  return (
    <div className="static flex items-top mt-20 justify-center top-0 left-0">
      <Form
        className="w-full max-w-2xl flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={async (e) => {
          e.preventDefault();

          if (!title && !content) {
            setErrors({
              title: "Please enter a valid title",
              content: "Please enter valid content",
            });
            toast.error("Please enter valid content");
            return;
          }

          if (!title) {
            setErrors({ title: "Please enter a valid title" });
            return;
          }

          if (!content) {
            setErrors({ content: "Please enter valid content" });
            toast.error("Please enter valid content");
            return;
          }

          if (!hasCookie("token")) {
            setErrors({ content: "You are not logged in" });
            return;
          }

          const sanitizedHtml = sanitizeHtml(content);
          setWaitingPost(true);

          const tags = [];

          if (selectedTags) {
            for (const tag of selectedTags) {
              tags.push(
                options?.filter((option) => option.value == tag.value)[0].id
              );
            }
          }

          const response = await fetch(
            process.env.NEXT_PUBLIC_MODE === "PROD"
              ? "https://d2jam.com/api/v1/post"
              : "http://localhost:3005/api/v1/post",
            {
              body: JSON.stringify({
                title: title,
                content: sanitizedHtml,
                username: getCookie("user"),
                tags,
                gameSlug,
                thumbnailUrl,
                windowsLink,
                linuxLink,
                macLink,
                webGLLink,
                authors: selectedAuthors.map(author => author.id)
              }),
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${getCookie("token")}`,
              },
              credentials: "include",
            }
          );

          if (response.status == 401) {
            setErrors({ content: "Invalid user" });
            setWaitingPost(false);
            return;
          }

          if (response.ok) {
            toast.success("Successfully created post");
            setWaitingPost(false);
            redirect("/");
          } else {
            toast.error("An error occured");
            setWaitingPost(false);
          }
        }}
      >
        <Input
          isRequired
          label="Game Name"
          labelPlacement="outside"
          name="title"
          placeholder="Enter your game name"
          type="text"
          value={title}
          onValueChange={setTitle}
        />

        <Input
            label="Game Slug"
            labelPlacement="outside"
            placeholder="your-game-name"
            value={gameSlug}
            onValueChange={setGameSlug}
            description="This will be used in the URL: d2jam.com/games/your-game-name"
          />

<div className="flex flex-col gap-2">
    <label className="text-sm font-medium">Add Authors</label>
    <Input
      placeholder="Search users..."
      value={authorSearch}
      onValueChange={(value) => {
        setAuthorSearch(value);
        handleAuthorSearch(value);
      }}
    />
    {searchResults.length > 0 && (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
        {searchResults.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => {
              setSelectedAuthors([...selectedAuthors, user]);
              setSearchResults([]);
              setAuthorSearch("");
            }}
          >
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    )}
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedAuthors.map((author) => (
        <div
          key={author.id}
          className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
        >
          <span>{author.name}</span>
          <button
            onClick={() => setSelectedAuthors(selectedAuthors.filter(a => a.id !== author.id))}
            className="text-sm hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  </div>
  <label className="text-sm font-medium">Game Description</label>
        <Editor content={content} setContent={setContent} gameEditor />

        <Spacer />

        {mounted && (
          <Select
            styles={styles}
            isMulti
            value={selectedTags}
            onChange={(value) => setSelectedTags(value)}
            options={options}
            isClearable={false}
            isOptionDisabled={() =>
              selectedTags != null && selectedTags.length >= 5
            }
          />
        )}

        <Spacer />

        
        
<div className="flex flex-col gap-4">
  

  <Input
    label="Thumbnail URL"
    labelPlacement="outside"
    placeholder="https://example.com/thumbnail.png"
    value={thumbnailUrl}
    onValueChange={setThumbnailUrl}
  />

  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Windows Download"
      placeholder="https://example.com/game-windows.zip"
      value={windowsLink}
      onValueChange={setWindowsLink}
    />
    <Input
      label="Linux Download"
      placeholder="https://example.com/game-linux.zip"
      value={linuxLink}
      onValueChange={setLinuxLink}
    />
    <Input
      label="Mac Download"
      placeholder="https://example.com/game-mac.zip"
      value={macLink}
      onValueChange={setMacLink}
    />
    <Input
      label="WebGL Link"
      placeholder="https://example.com/game-webgl"
      value={webGLLink}
      onValueChange={setWebGLLink}
    />
  </div>

  

  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
    <h3 className="text-lg font-bold mb-4">Game Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
        <p className="text-2xl font-bold">N/A</p>
      </div>
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
        <p className="text-2xl font-bold">0</p>
      </div>
    </div>
  </div>
  <div className="flex gap-2">
          <Button color="primary" type="submit">
            {waitingPost ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <p>Create</p>
            )}
          </Button>
        </div>
</div>
      </Form>
      <div className="flex flex-col gap-4 px-8 items-end">
        <Timers />
        <Streams />
      </div>
    </div>    
  );
}
