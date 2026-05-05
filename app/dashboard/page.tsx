import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { PostCard } from "@/components/post-card";
import { getFeedPosts, getFeedPostsForUser, getProfileByClerkUserId } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ feed?: string }>;
}) {
  const { feed } = await searchParams;
  const isFollowingFeed = feed === "following";

  const { userId } = await auth();

  let posts = await getFeedPosts();
  let showSignInNudge = false;

  if (isFollowingFeed) {
    if (!userId) {
      showSignInNudge = true;
      posts = [];
    } else {
      const profile = await getProfileByClerkUserId(userId);
      posts = profile ? await getFeedPostsForUser(profile.id) : [];
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Dashboard</p>
          <h1 className="font-display text-4xl text-[var(--oxblood)]">Latest Posts</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="paper-panel flex rounded-full p-1">
            <Link
              href="/dashboard"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!isFollowingFeed ? "bg-[var(--oxblood)] text-[var(--cream)]" : "text-[color:rgba(61,45,51,0.78)] hover:text-[var(--oxblood)]"}`}
            >
              Everyone
            </Link>
            <Link
              href="/dashboard?feed=following"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isFollowingFeed ? "bg-[var(--oxblood)] text-[var(--cream)]" : "text-[color:rgba(61,45,51,0.78)] hover:text-[var(--oxblood)]"}`}
            >
              Following
            </Link>
          </div>
          <Link
            href="/post/new"
            className="btn-primary rounded-full px-5 py-3 text-sm font-semibold transition"
          >
            New Post
          </Link>
        </div>
      </section>

      {showSignInNudge ? (
        <div className="paper-panel rounded-[34px] p-14 text-center">
          <p className="font-display text-2xl text-[var(--oxblood)]">Sign in to see your following feed</p>
          <p className="mt-2 text-[color:rgba(61,45,51,0.72)]">Follow cooks and their posts will show up here.</p>
        </div>
      ) : posts.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <div className="paper-panel rounded-[34px] p-14 text-center">
          {isFollowingFeed ? (
            <>
              <p className="font-display text-2xl text-[var(--oxblood)]">Nothing here yet</p>
              <p className="mt-2 text-[color:rgba(61,45,51,0.72)]">
                Follow some cooks from{" "}
                <Link href="/search" className="font-semibold text-[var(--oxblood)]">
                  Search
                </Link>{" "}
                and their posts will appear here.
              </p>
            </>
          ) : (
            <Link
              href="/post/new"
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold transition"
            >
              Create the first post
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
