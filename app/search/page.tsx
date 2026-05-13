import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { searchProfiles, searchPosts, isFollowing, getProfileByClerkUserId, getSavedPostIds } from "@/lib/data";
import { FollowButton } from "@/components/follow-button";
import { PostCard } from "@/components/post-card";
import { SearchInput } from "@/components/search-input";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const { userId } = await auth();

  const [profiles, recipePosts, viewerProfile] = await Promise.all([
    query ? searchProfiles(query) : Promise.resolve([]),
    query ? searchPosts(query) : Promise.resolve([]),
    userId ? getProfileByClerkUserId(userId) : Promise.resolve(null)
  ]);

  const followStates = viewerProfile
    ? await Promise.all(
        profiles
          .filter((p) => p.id !== viewerProfile.id)
          .map((p) => isFollowing(viewerProfile.id, p.id).then((val) => [p.id, val] as const))
      )
    : [];
  const followMap = Object.fromEntries(followStates);
  const savedPostIds = viewerProfile ? await getSavedPostIds(viewerProfile.id, recipePosts.map((post) => post.id)) : new Set<string>();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Find Friends</p>
        <h1 className="font-display text-4xl text-[var(--oxblood)]">Search</h1>
      </div>

      <div className="mb-8">
        <SearchInput defaultValue={query} />
      </div>

      {query && profiles.length === 0 && recipePosts.length === 0 ? (
        <div className="paper-panel rounded-[28px] p-10 text-center text-[color:rgba(61,45,51,0.72)]">
          No cooks or recipes found for &ldquo;{query}&rdquo;.
        </div>
      ) : null}

      {profiles.length > 0 ? (
        <section className="mb-10">
          <h2 className="font-display mb-4 text-2xl text-[var(--oxblood)]">Cooks</h2>
          <ul className="space-y-3">
            {profiles.map((profile) => {
              const isOwn = profile.id === viewerProfile?.id;
              const initials = (profile.displayName ?? profile.username).slice(0, 2).toUpperCase();

              return (
                <li key={profile.id} className="paper-panel flex items-center justify-between gap-4 rounded-[24px] px-5 py-4">
                  <Link href={`/profile/${profile.username}`} className="flex items-center gap-4">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.displayName ?? profile.username} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--sage)] text-base font-black text-[var(--oxblood)]">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[var(--oxblood)]">{profile.displayName ?? profile.username}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-[color:rgba(90,70,76,0.72)]">@{profile.username}</p>
                    </div>
                  </Link>
                  {!isOwn && viewerProfile ? (
                    <FollowButton followingProfileId={profile.id} initialIsFollowing={followMap[profile.id] ?? false} />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {recipePosts.length > 0 ? (
        <section>
          <h2 className="font-display mb-4 text-2xl text-[var(--oxblood)]">Recipes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recipePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                viewerCanSave={Boolean(viewerProfile)}
                initialIsSaved={savedPostIds.has(post.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!query ? (
        <p className="text-center text-[color:rgba(61,45,51,0.56)]">Type a name or username above to find cooks.</p>
      ) : null}
    </main>
  );
}
