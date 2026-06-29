import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luis Photography — Moments that Last",
  description:
    "Professional photographer specializing in weddings, portraits, and events. Capturing authentic emotions with a unique artistic vision.",
  keywords: ["photography", "professional photographer", "weddings", "portraits", "photoshoots"],
  openGraph: {
    title: "Luis Photography — Moments that Last",
    description: "Professional photographer specializing in weddings, portraits, and events.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
