"use client";

import { Button, Form, Input } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="absolute flex items-center justify-center top-0 left-0 w-screen h-screen">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        validationBehavior="native"
        onReset={() => {
          setUsername("");
          setPassword("");
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await fetch(
            process.env.MODE === "PROD"
              ? "https://d2jam.com/api/v1/login"
              : "http://localhost:3005/api/v1/login",
            {
              body: JSON.stringify({ username: username, password: password }),
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status == 401) {
            setError("Invalid username or password");
            setPassword("");
            return;
          }

          const token = await response.json();
          document.cookie = `token=${token}`;

          redirect("/");
        }}
      >
        <Input
          isRequired
          errorMessage="Please enter a valid username"
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
          errorMessage="Please enter a valid password"
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
        <p>Sign up is being worked on currently</p>
        {error && <p className="text-red-500">{error}</p>}
        {}
      </Form>
    </div>
  );
}
