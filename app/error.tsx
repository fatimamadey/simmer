"use client";

import Link from "next/link";

import { LogoMark } from "@/components/logo-mark";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-16 text-center sm:px-6">
      <section className="paper-panel rounded-[32px] p-8 sm:p-10">
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="mt-5 text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Something Broke</p>
        <h1 className="font-display mt-2 text-4xl text-[var(--oxblood)]">The kitchen needs a reset</h1>
        <p className="mt-3 text-[color:rgba(61,45,51,0.72)]">
          Try again, or head back to the feed if this recipe keeps failing to load.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary rounded-full px-5 py-3 text-sm font-semibold">
            Try Again
          </button>
          <Link href="/feed" className="btn-secondary rounded-full px-5 py-3 text-sm font-semibold">
            Back to Feed
          </Link>
        </div>
      </section>
    </main>
  );
}
