import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edikoyo Jam",
  description: "A community built game jam!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="dark">
            <div className="bg-zinc-100 dark:bg-zinc-950 min-h-screen">
              <Navbar />
              <div className="max-w-8xl mx-auto">{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
