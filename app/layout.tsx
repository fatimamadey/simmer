import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Playfair_Display, DM_Sans, Caveat } from "next/font/google";

import { Header } from "@/components/header";
import { getProfileByClerkUserId, ensureProfile } from "@/lib/data";
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
  description: "A social cooking app for honest home-cooked recipe posts.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/simmer-mark.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#53131E"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  if (userId) {
    try {
      const existing = await getProfileByClerkUserId(userId);
      if (!existing) {
        const clerkUser = await currentUser();
        if (clerkUser) {
          await ensureProfile(userId, {
            username: clerkUser.username ?? null,
            firstName: clerkUser.firstName ?? null,
            lastName: clerkUser.lastName ?? null,
            imageUrl: clerkUser.imageUrl,
            emailAddress: clerkUser.primaryEmailAddress?.emailAddress ?? null,
          });
        }
      }
    } catch (err) {
      console.error("[ensureProfile]", err);
    }
  }

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
