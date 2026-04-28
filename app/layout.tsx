import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Newsreader } from "next/font/google";

import { Header } from "@/components/header";
import "@/app/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces"
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader"
});

export const metadata: Metadata = {
  title: "Simmer",
  description: "A social cooking app for honest home-cooked recipe posts."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fraunces.variable} ${newsreader.variable}`}>
          <div className="min-h-screen text-[var(--ink)]">
            <Header />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
