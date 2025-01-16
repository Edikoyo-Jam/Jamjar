"use client";

import { getCookie, hasCookie } from "@/helpers/cookie";
import { Button, Form, Input, Textarea } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        validationErrors={errors}
        onReset={() => {
          setTitle("");
          setContent("");
        }}
        onSubmit={async (e) => {
          e.preventDefault();

          if (!title && !content) {
            setErrors({
              title: "Please enter a valid title",
              content: "Please enter valid content",
            });
            return;
          }

          if (!title) {
            setErrors({ title: "Please enter a valid title" });
            return;
          }

          if (!content) {
            setErrors({ content: "Please enter valid content" });
            return;
          }

          if (!hasCookie("token")) {
            setErrors({ content: "You are not logged in" });
            return;
          }

          const response = await fetch(
            process.env.NEXT_PUBLIC_MODE === "PROD"
              ? "https://d2jam.com/api/v1/post"
              : "http://localhost:3005/api/v1/post",
            {
              body: JSON.stringify({
                title: title,
                content: content,
                username: getCookie("user"),
              }),
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${getCookie("token")}`,
              },
            }
          );

          if (response.status == 401) {
            setErrors({ content: "Invalid user" });
            return;
          }

          toast.success("Successfully created post");

          redirect("/");
        }}
      >
        <Input
          isRequired
          label="Title"
          labelPlacement="outside"
          name="title"
          placeholder="Enter a title"
          type="text"
          value={title}
          onValueChange={setTitle}
        />

        <Textarea
          isRequired
          label="Content"
          labelPlacement="outside"
          name="content"
          placeholder="Enter the post body"
          value={content}
          onValueChange={setContent}
        />
        <div className="flex gap-2">
          <Button color="primary" type="submit">
            Create
          </Button>
          <Button type="reset" variant="flat">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
