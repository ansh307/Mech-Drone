import type { Metadata } from "next";
import localFont from "next/font/local";

import { ViewCanvas } from "@/components/ViewCanvas";
import "./globals.css";

export const Gunsan = localFont({
  src: "../../public/fonts/Gunsan-Regular/gunsan.woff2",
  variable: "--font-gunsan",
});

export const Lausanne200 = localFont({
  src: "../../public/fonts/Lausanne/TWKLausanne-200.woff2",
  variable: "--font-lausanne-200",
});

export const Lausanne300 = localFont({
  src: "../../public/fonts/Lausanne/TWKLausanne-300.woff2",
  variable: "--font-lausanne-300",
});

export const Lausanne400 = localFont({
  src: "../../public/fonts/Lausanne/TWKLausanne-400.woff2",
  variable: "--font-lausanne-400",
});

export const PressStart2P = localFont({
  src: "../../public/fonts/PressStart2P/PressStart2P-Regular.ttf",
  variable: "--font-pressstart2p",
});

export const metadata: Metadata = {
  title: "Mech Drone | The Unknown Mystery",
  description:
    "Discover Mech Drone — a mysterious cosmic explorer drifting near Saturn's rings, mastering gravity, AI, and interstellar exploration.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Mech Drone | The Unknown Mystery",
    description:
      "From Saturn's icy rings to uncharted cosmic expanses, Mech Drone explores the unknown with AI precision and dazzling maneuvers no human craft could achieve.",
    url: "https://mechdrone.netlify.app/", // replace with your actual domain
    siteName: "Mech Drone",
    images: [
      {
        url: "https://mechdrone.netlify.app/og-mechdrone.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "Mech Drone drifting past Saturn's rings with a cosmic glow",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mech Drone | The Unknown Mystery",
    description:
      "A mysterious cosmic explorer, mastering AI, gravity, and dazzling stunts. Mech Drone is more than a machine — it's the unknown in motion.",
    images: ["https://mechdrone.netlify.app/og-mechdrone.png"], // same OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Gunsan.variable} ${Lausanne200.variable} ${Lausanne300.variable} ${Lausanne400.variable}  ${PressStart2P.variable} antialiased bg-neutral-950`}
      >
        <main>
          {children}
          <ViewCanvas />
        </main>
      </body>
    </html>
  );
}
