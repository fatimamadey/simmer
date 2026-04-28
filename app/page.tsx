import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { getFeedPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getFeedPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ffb073]">Milestone 1</p>
          <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#fff5ea] sm:text-7xl">
            Recipes for the triumphs, the flops, and the almost-edible.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#f8ebd8]/74">
            Simmer is where home cooking gets honest. Post the dish photo, score how it really turned out, and keep the
            full recipe attached so friends can learn from the win or avoid the smoke.
          </p>
        </div>
        <div className="rounded-[32px] border border-[#ff8552]/20 bg-[#221b17] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffb073]">The Loop</p>
          <div className="mt-4 grid gap-3 text-[#fff5ea]">
            <div className="rounded-2xl bg-[#17120f] p-4">1. Sign in and post what you made.</div>
            <div className="rounded-2xl bg-[#17120f] p-4">2. Rate the result from 1 to 10.</div>
            <div className="rounded-2xl bg-[#17120f] p-4">3. Browse the feed and open full recipes.</div>
          </div>
          <Link
            href="/post/new"
            className="mt-6 inline-flex rounded-full bg-[#ff8552] px-5 py-3 text-sm font-bold text-[#1d1712] transition hover:bg-[#ffa16d]"
          >
            Post tonight&apos;s experiment
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8ebd8]/55">Latest cooks</p>
            <h2 className="text-2xl font-bold text-[#fff5ea]">Fresh from the stove</h2>
          </div>
          <p className="text-sm text-[#f8ebd8]/55">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
        </div>

        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-[#ff8552]/30 bg-[#1a1512]/80 p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffb073]">No posts yet</p>
            <h3 className="mt-3 text-3xl font-black text-[#fff5ea]">Start the feed with your first dish.</h3>
            <p className="mx-auto mt-3 max-w-xl text-[#f8ebd8]/70">
              The first recipe sets the tone. A perfect 10 is welcome. A chaotic 3 with a lesson learned might be even
              better.
            </p>
            <Link
              href="/post/new"
              className="mt-6 inline-flex rounded-full border border-[#ff8552]/50 px-5 py-3 text-sm font-bold text-[#fff5ea] transition hover:border-[#ff8552]"
            >
              Create the first post
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
