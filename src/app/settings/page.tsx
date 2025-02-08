"use client";

import Editor from "@/components/editor";
import sanitizeHtml from "sanitize-html";
import { getCookie, hasCookie } from "@/helpers/cookie";
import { UserType } from "@/types/UserType";
import { Avatar, Button, Form, Input } from "@nextui-org/react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

export default function UserPage() {
  const [user, setUser] = useState<UserType>();
  const [profilePicture, setProfilePicture] = useState("");
  const [name, setName] = useState("");
  const [bannerPicture, setBannerPicture] = useState("");
  const [bio, setBio] = useState("");
  const [errors] = useState({});
  const pathname = usePathname();
  const [waitingSave, setWaitingSave] = useState(false);

  useEffect(() => {
    loadUser();
    async function loadUser() {
      if (!hasCookie("token")) {
        setUser(undefined);
        redirect("/");
        return;
      }

      const response = await fetch(
        process.env.NEXT_PUBLIC_MODE === "PROD"
          ? `https://d2jam.com/api/v1/self?username=${getCookie("user")}`
          : `http://localhost:3005/api/v1/self?username=${getCookie("user")}`,
        {
          headers: { authorization: `Bearer ${getCookie("token")}` },
          credentials: "include",
        }
      );

      if (response.status == 200) {
        const data = await response.json();
        setUser(data);

        setProfilePicture(data.profilePicture ?? "");
        setBannerPicture(data.bannerPicture ?? "");
        setBio(data.bio ?? "");
        setName(data.name ?? "");
      } else {
        setUser(undefined);
      }
    }
  }, [pathname]);

  return (
    <div className="flex items-center justify-center">
      {!user ? (
        "Loading settings..."
      ) : (
        <Form
          className="w-full max-w-2xl flex flex-col gap-4"
          validationErrors={errors}
          onReset={() => {
            setProfilePicture(user.profilePicture ?? "");
            setBannerPicture(user.bannerPicture ?? "");
            setBio(user.bio ?? "");
            setName(user.name ?? "");
          }}
          onSubmit={async (e) => {
            e.preventDefault();

            const sanitizedBio = sanitizeHtml(bio);

            if (!name) {
              toast.error("You need to enter a name");
              return;
            }

            setWaitingSave(true);

            const response = await fetch(
              process.env.NEXT_PUBLIC_MODE === "PROD"
                ? "https://d2jam.com/api/v1/user"
                : "http://localhost:3005/api/v1/user",
              {
                body: JSON.stringify({
                  slug: user.slug,
                  name: name,
                  bio: sanitizedBio,
                  profilePicture: profilePicture,
                  bannerPicture: bannerPicture,
                }),
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${getCookie("token")}`,
                },
              }
            );

            if (response.ok) {
              toast.success("Changed settings");
              setUser(await response.json());
              setWaitingSave(false);
            } else {
              toast.error("Failed to update settings");
              setWaitingSave(false);
            }
          }}
        >
          <p className="text-3xl">Settings</p>

          <Input
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Enter a name"
            type="text"
            value={name}
            onValueChange={setName}
          />

          <p>Bio</p>
          <Editor content={bio} setContent={setBio} />

          <Input
            label="Profile Picture"
            labelPlacement="outside"
            name="profilePicture"
            placeholder="Enter a url to an image"
            type="text"
            value={profilePicture}
            onValueChange={setProfilePicture}
          />

          {profilePicture && <Avatar src={profilePicture} />}

          <Input
            label="Banner Picture"
            labelPlacement="outside"
            name="bannerPicture"
            placeholder="Enter a url to an image"
            type="text"
            value={bannerPicture}
            onValueChange={setBannerPicture}
          />

          {bannerPicture &&
            bannerPicture.startsWith("https://") &&
            bannerPicture.length > 8 && (
              <div className="bg-[#222222] h-28 w-full relative">
                <Image
                  src={bannerPicture}
                  alt={`${user.name}'s profile banner`}
                  className="object-cover"
                  fill
                />
              </div>
            )}

          <div className="flex gap-2">
            <Button color="primary" type="submit">
              {waitingSave ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <p>Save</p>
              )}
            </Button>
            <Button type="reset" variant="flat">
              Reset
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
