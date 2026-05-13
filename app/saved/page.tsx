import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { PostCard } from "@/components/post-card";
import { getProfileByClerkUserId, getSavedPostsForUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await getProfileByClerkUserId(userId);
  const posts = profile ? await getSavedPostsForUser(profile.id) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Cookbook</p>
          <h1 className="font-display text-4xl text-[var(--oxblood)]">Saved Recipes</h1>
        </div>
        <Link href="/feed" className="btn-secondary rounded-full px-5 py-3 text-sm font-semibold transition">
          Browse Feed
        </Link>
      </section>

      {posts.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} viewerCanSave initialIsSaved />
          ))}
        </section>
      ) : (
        <div className="paper-panel rounded-[34px] p-14 text-center">
          <p className="font-display text-2xl text-[var(--oxblood)]">Your cookbook is empty</p>
          <p className="mt-2 text-[color:rgba(61,45,51,0.72)]">Save recipes from the feed and they will stay here.</p>
        </div>
      )}
    </main>
  );
}
