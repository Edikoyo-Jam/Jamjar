"use client";

import { Button, Form, Input } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        validationErrors={errors}
        onReset={() => {
          setUsername("");
          setPassword("");
        }}
        onSubmit={async (e) => {
          e.preventDefault();

          if (!username && !password) {
            setErrors({
              username: "Please enter a valid username",
              password: "Please enter a valid password",
            });
            return;
          }

          if (!username) {
            setErrors({ username: "Please enter a valid username" });
            return;
          }

          if (!password) {
            setErrors({ password: "Please enter a valid password" });
            return;
          }

          const response = await fetch(
            process.env.NEXT_PUBLIC_MODE === "PROD"
              ? "https://d2jam.com/api/v1/login"
              : "http://localhost:3005/api/v1/login",
            {
              body: JSON.stringify({ username: username, password: password }),
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status == 401) {
            setErrors({ password: "Invalid username or password" });
            setPassword("");
            return;
          }

          const { token, user } = await response.json();

          document.cookie = `token=${token}`;
          document.cookie = `user=${user.slug}`;

          toast.success("Successfully logged in");

          redirect("/");
        }}
      >
        <Input
          isRequired
          label="Username"
          labelPlacement="outside"
          name="username"
          placeholder="Enter your username"
          type="text"
          value={username}
          onValueChange={setUsername}
        />

        <Input
          isRequired
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onValueChange={setPassword}
        />
        <div className="flex gap-2">
          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button type="reset" variant="flat">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
