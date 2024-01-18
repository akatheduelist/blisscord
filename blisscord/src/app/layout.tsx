import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blisscord: Chat with bliss not dis",
  description: "Chat with friends in real time! Isnt that cool?",
};

// RootLayout is the base of the app that all other components / pages / layouts
// will render. RootLayout takes in children of type ReactNode and passes to the interior
// of the body for page rendering.
// Wrapping body in Providers to give global context throughout app.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
