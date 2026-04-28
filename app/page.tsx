import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { getFeedPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const posts = await getFeedPosts();
  const featuredPosts = posts.slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Social Cookbook</p>
          <h1 className="font-display max-w-xl text-[2.8rem] leading-[1.02] text-[var(--oxblood)] sm:text-[3.6rem]">
            Keep the good dishes. Keep the burnt ones too.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-[color:rgba(61,45,51,0.78)]">
            A running table of what everyone cooked, loved, ruined, and tried again.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold transition"
            >
              View Dashboard
            </Link>
            <Link
              href="/post/new"
              className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold transition hover:bg-[color:rgba(181,214,178,0.38)]"
            >
              Add a Recipe
            </Link>
          </div>
        </div>

        <div className="paper-panel relative overflow-hidden rounded-[36px] p-4 sm:p-6">
          <div className="paper-inset rounded-[28px] border border-[color:rgba(83,19,30,0.08)] bg-[color:rgba(255,255,255,0.32)] p-4 sm:p-5">
            {featuredPosts.length ? (
              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <Link href={`/posts/${featuredPosts[0].id}`} className="group block overflow-hidden rounded-[24px]">
                  <img
                    src={featuredPosts[0].photoUrl}
                    alt={featuredPosts[0].notes ?? "Recipe post photo"}
                    className="h-[22rem] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="grid gap-4">
                  {featuredPosts.slice(1).map((post) => (
                    <Link key={post.id} href={`/posts/${post.id}`} className="group block overflow-hidden rounded-[24px]">
                      <img
                        src={post.photoUrl}
                        alt={post.notes ?? "Recipe post photo"}
                        className="h-[10.5rem] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  ))}
                  {featuredPosts.length === 1 ? <div className="rounded-[24px] bg-[color:rgba(255,255,255,0.3)]" /> : null}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[24rem] items-center justify-center rounded-[28px] border border-dashed border-[var(--line)] bg-[color:rgba(255,255,255,0.26)]">
                <Link href="/post/new" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
                  Start the first post
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Recent</p>
              <h2 className="font-display text-3xl text-[var(--oxblood)]">From the book</h2>
            </div>
            <Link href="/dashboard" className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--oxblood)]">
              Open all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
