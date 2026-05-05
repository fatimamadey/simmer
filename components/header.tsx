import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function Header() {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-20 border-b border-[color:rgba(90,70,76,0.12)] bg-[color:rgba(255,253,242,0.82)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[color:rgba(83,19,30,0.18)] bg-[color:rgba(181,214,178,0.42)] text-sm font-semibold uppercase tracking-[0.18em] text-[var(--oxblood)]">
            S
          </span>
          <span className="font-display text-3xl font-semibold tracking-[0.04em] text-[var(--oxblood)] sm:text-4xl">Simmer</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium uppercase tracking-[0.14em] text-[color:rgba(61,45,51,0.86)]">
          <Link href="/" className="transition hover:text-[var(--oxblood)]">
            Home
          </Link>
          <Link href="/dashboard" className="transition hover:text-[var(--oxblood)]">
            Dashboard
          </Link>
          <Link href="/search" className="transition hover:text-[var(--oxblood)]">
            Search
          </Link>
          {userId ? (
            <>
              <Link
                href="/post/new"
                className="btn-primary rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                New Post
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
