import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { LogoMark } from "@/components/logo-mark";
import { getProfileByClerkUserId } from "@/lib/data";

export async function Header() {
  const { userId } = await auth();
  const viewerProfile = userId ? await getProfileByClerkUserId(userId) : null;

  return (
    <header className="sticky top-0 z-20 border-b border-[color:rgba(83,19,30,0.07)] bg-[color:rgba(253,248,238,0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Simmer home">
          <LogoMark className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="font-display text-[1.75rem] italic font-normal tracking-tight text-[var(--oxblood)] sm:text-[2rem]">Simmer</span>
        </Link>
        <nav className="flex items-center gap-3 text-xs font-medium text-[color:rgba(46,32,24,0.6)] sm:gap-5 sm:text-sm">
          <Link href="/feed" className="transition hover:text-[var(--oxblood)]">
            Feed
          </Link>
          <Link href="/search" className="hidden transition hover:text-[var(--oxblood)] sm:block">
            Search
          </Link>
          {userId ? (
            <>
              <Link href="/saved" className="hidden transition hover:text-[var(--oxblood)] sm:block">
                Saved
              </Link>
              {viewerProfile ? (
                <Link
                  href={`/profile/${viewerProfile.username}`}
                  className="hidden transition hover:text-[var(--oxblood)] sm:block"
                >
                  Profile
                </Link>
              ) : null}
              <Link
                href="/post/new"
                className="btn-primary rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">+</span>
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-primary rounded-full px-4 py-2 text-sm font-semibold transition">
                Sign In
              </button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
