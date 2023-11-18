import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


export const metadata: Metadata = {
  title: "Wavs",
  description: "A place to discover new chords"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
