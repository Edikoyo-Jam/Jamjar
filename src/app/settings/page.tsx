"use client";

import { getCookie, hasCookie } from "@/helpers/cookie";
import { UserType } from "@/types/UserType";
import { Button, Form, Input } from "@nextui-org/react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserPage() {
  const [user, setUser] = useState<UserType>();
  const [profilePicture, setProfilePicture] = useState("");
  const [errors] = useState({});
  const pathname = usePathname();

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
      } else {
        setUser(undefined);
      }
    }
  }, [pathname]);

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
      {!user ? (
        "Loading settings..."
      ) : (
        <Form
          className="w-full max-w-xs flex flex-col gap-4"
          validationErrors={errors}
          onReset={() => {
            setProfilePicture(user.profilePicture ?? "");
          }}
          onSubmit={async (e) => {
            e.preventDefault();

            const response = await fetch(
              process.env.NEXT_PUBLIC_MODE === "PROD"
                ? "https://d2jam.com/api/v1/user"
                : "http://localhost:3005/api/v1/user",
              {
                body: JSON.stringify({
                  slug: user.slug,
                  profilePicture: profilePicture,
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
            } else {
              toast.error("Failed to update settings");
            }
          }}
        >
          <Input
            label="Profile Picture"
            labelPlacement="outside"
            name="profilePicture"
            placeholder="Enter a url to an image"
            type="text"
            value={profilePicture}
            onValueChange={setProfilePicture}
          />

          <div className="flex gap-2">
            <Button color="primary" type="submit">
              Save
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
