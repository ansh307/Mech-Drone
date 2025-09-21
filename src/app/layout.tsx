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

export const metadata: Metadata = {
  title: "Mech Drone",
  description: "Its a Dusky Drone buddy ;)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Gunsan.variable} ${Lausanne200.variable} ${Lausanne300.variable} ${Lausanne400.variable} antialiased bg-neutral-950`}
      >
        <main>
          {children}
          <ViewCanvas />
        </main>
      </body>
    </html>
  );
}
