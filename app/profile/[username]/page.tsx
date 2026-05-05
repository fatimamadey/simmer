import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getProfileByUsername, getPostsByProfileId, isFollowing, getProfileByClerkUserId } from "@/lib/data";
import { PostCard } from "@/components/post-card";
import { FollowButton } from "@/components/follow-button";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) notFound();

  const { userId } = await auth();

  const [posts, viewerProfile] = await Promise.all([
    getPostsByProfileId(profile.id),
    userId ? getProfileByClerkUserId(userId) : Promise.resolve(null)
  ]);

  const isOwnProfile = viewerProfile?.id === profile.id;
  const viewerIsFollowing = !isOwnProfile && viewerProfile
    ? await isFollowing(viewerProfile.id, profile.id)
    : false;

  const initials = (profile.displayName ?? profile.username).slice(0, 2).toUpperCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="paper-panel mb-10 rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName ?? profile.username}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--sage)] text-2xl font-black text-[var(--oxblood)]">
                {initials}
              </div>
            )}
            <div>
              <h1 className="font-display text-3xl text-[var(--oxblood)]">
                {profile.displayName ?? profile.username}
              </h1>
              <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.72)]">
                @{profile.username}
              </p>
            </div>
          </div>

          {!isOwnProfile && viewerProfile ? (
            <FollowButton followingProfileId={profile.id} initialIsFollowing={viewerIsFollowing} />
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-t border-[var(--line)] pt-6 text-center">
          <div>
            <p className="font-display text-3xl text-[var(--oxblood)]">{profile.postCount}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.72)]">Posts</p>
          </div>
          <div>
            <p className="font-display text-3xl text-[var(--oxblood)]">
              {profile.postCount ? profile.avgRating.toFixed(1) : "—"}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.72)]">Avg Rating</p>
          </div>
          <div>
            <p className="font-display text-3xl text-[var(--oxblood)]">{profile.followerCount}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.72)]">Followers</p>
          </div>
          <div>
            <p className="font-display text-3xl text-[var(--oxblood)]">{profile.followingCount}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.72)]">Following</p>
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <div className="paper-panel rounded-[34px] p-14 text-center text-[color:rgba(61,45,51,0.72)]">
          No posts yet.
        </div>
      )}
    </main>
  );
}
