import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import { Spacer } from "@nextui-org/react";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dare2Jam",
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
            <div className="bg-gradient-to-br from-[#181818] to-[#222] min-h-screen flex flex-col">
              <Navbar />
              <Spacer y={5} />
              <div className="max-w-8xl mx-auto flex-grow w-full">
                {children}
              </div>
              <Footer />
              <ToastContainer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
