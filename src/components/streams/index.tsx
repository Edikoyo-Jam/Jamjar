"use client";

import { useEffect, useState } from "react";
import { FeaturedStreamerType } from "@/types/FeaturedStreamerType";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

export default function Streams() {
  const [streamers, setStreamers] = useState<FeaturedStreamerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the currently displayed streamer

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_MODE === "PROD"
            ? "https://d2jam.com/api/v1/streamers/get"
            : "http://localhost:3005/api/v1/streamers/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch featured streamers");
        }

        const data: FeaturedStreamerType[] = await response.json();
        setStreamers(data);
      } catch (error) {
        console.error("Error fetching featured streamers:", error);
      }
    };

    fetchStreamers();
  }, []);

  // Function to handle moving to the previous streamer
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? streamers.length - 1 : prevIndex - 1
    );
  };

  // Function to handle moving to the next streamer
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === streamers.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (streamers.length === 0) {
    return <div>Loading featured streamers...</div>;
  }

  const currentStreamer = streamers[currentIndex]; // Get the currently displayed streamer

  return (
    <div className="text-[#333] dark:text-white text-center p-6 transition-color duration-250">
      <h1>Featured Streamer</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
          margin: "0 auto",
        }}
      >
        <Image
          as={NextImage}
          src={currentStreamer.thumbnailUrl}
          alt={`${currentStreamer.userName}'s thumbnail`}
          style={{ width: "100%", borderRadius: "4px", marginBottom: "10px" }}
          width={320}
          height={180}
        />
        <a
          href={`https://twitch.tv/${currentStreamer.userName}`}
          target="_blank"
        >
          <div
            style={{
              height: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h3>{currentStreamer.userName}</h3>
            <p>{currentStreamer.streamTitle}</p>
          </div>
        </a>
        <div>
          {currentStreamer.streamTags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                padding: "2px 6px",
                marginRight: "4px",
                fontSize: "12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrev} style={{ marginRight: "10px" }}>
          &larr; Previous
        </button>
        <button onClick={handleNext}>&rarr; Next</button>
      </div>
    </div>
  );
}
