import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, DM_Sans, Caveat } from "next/font/google";

import { Header } from "@/components/header";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"]
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat"
});

export const metadata: Metadata = {
  title: "Simmer",
  description: "A social cooking app for honest home-cooked recipe posts."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${playfair.variable} ${dmSans.variable} ${caveat.variable}`}>
          <div className="min-h-screen text-[var(--ink)]">
            <Header />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
