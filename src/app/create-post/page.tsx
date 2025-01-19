"use client";

import Editor from "@/components/editor";
import { getCookie, hasCookie } from "@/helpers/cookie";
import { Button, Form, Input } from "@nextui-org/react";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import sanitizeHtml from "sanitize-html";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [waitingPost, setWaitingPost] = useState(false);

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
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

          const response = await fetch(
            process.env.NEXT_PUBLIC_MODE === "PROD"
              ? "https://d2jam.com/api/v1/post"
              : "http://localhost:3005/api/v1/post",
            {
              body: JSON.stringify({
                title: title,
                content: sanitizedHtml,
                username: getCookie("user"),
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
          label="Title"
          labelPlacement="outside"
          name="title"
          placeholder="Enter a title"
          type="text"
          value={title}
          onValueChange={setTitle}
        />

        <Editor content={content} setContent={setContent} />

        <div className="flex gap-2">
          <Button color="primary" type="submit">
            {waitingPost ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <p>Create</p>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
