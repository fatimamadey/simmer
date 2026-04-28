import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { Header } from "@/components/header";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Simmer",
  description: "A social cooking app for honest home-cooked recipe posts."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,133,82,0.24),_transparent_34%),linear-gradient(180deg,_#17120f_0%,_#0f0b09_100%)] text-[#fff5ea]">
            <Header />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
