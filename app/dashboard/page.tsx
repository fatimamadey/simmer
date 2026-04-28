import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { getFeedPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const posts = await getFeedPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Dashboard</p>
          <h1 className="font-display text-4xl text-[var(--oxblood)]">Latest Posts</h1>
        </div>
        <Link
          href="/post/new"
          className="btn-primary rounded-full px-5 py-3 text-sm font-semibold transition"
        >
          New Post
        </Link>
      </section>

      {posts.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <div className="paper-panel rounded-[34px] p-14 text-center">
          <Link
            href="/post/new"
            className="btn-primary rounded-full px-6 py-3 text-sm font-semibold transition"
          >
            Create the first post
          </Link>
        </div>
      )}
    </main>
  );
}
