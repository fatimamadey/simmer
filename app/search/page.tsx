import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { searchProfiles, isFollowing, getProfileByClerkUserId } from "@/lib/data";
import { FollowButton } from "@/components/follow-button";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const { userId } = await auth();

  const [profiles, viewerProfile] = await Promise.all([
    query ? searchProfiles(query) : Promise.resolve([]),
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-[color:rgba(83,19,30,0.68)]">Find Friends</p>
        <h1 className="font-display text-4xl text-[var(--oxblood)]">Search</h1>
      </div>

      <form method="get" className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by username or name..."
            className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-5 py-4 text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
          />
          <button
            type="submit"
            className="btn-primary rounded-full px-6 py-4 text-sm font-semibold transition"
          >
            Search
          </button>
        </div>
      </form>

      {query && profiles.length === 0 ? (
        <div className="paper-panel rounded-[28px] p-10 text-center text-[color:rgba(61,45,51,0.72)]">
          No cooks found for &ldquo;{query}&rdquo;.
        </div>
      ) : null}

      {profiles.length > 0 ? (
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
                  <FollowButton
                    followingProfileId={profile.id}
                    initialIsFollowing={followMap[profile.id] ?? false}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {!query ? (
        <p className="text-center text-[color:rgba(61,45,51,0.56)]">Type a name or username above to find cooks.</p>
      ) : null}
    </main>
  );
}
