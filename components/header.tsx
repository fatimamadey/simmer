import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function Header() {
  const { userId } = await auth();

  return (
    <header className="border-b border-white/10 bg-[#120f0d]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-black uppercase tracking-[0.24em] text-[#ff8552]">Simmer</span>
          <span className="text-sm text-[#f8ebd8]/70">post the wins and the wrecks</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-[#f8ebd8]">
          <Link href="/">Feed</Link>
          {userId ? (
            <>
              <Link
                href="/post/new"
                className="rounded-full bg-[#ff8552] px-4 py-2 text-[#1e1712] transition hover:bg-[#ffa16d]"
              >
                New Post
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-full border border-[#ff8552]/40 px-4 py-2 transition hover:border-[#ff8552]">
                Sign In
              </button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
