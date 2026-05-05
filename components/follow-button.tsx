"use client";

import { useTransition, useState } from "react";
import { followAction, unfollowAction } from "@/lib/actions";

export function FollowButton({
  followingProfileId,
  initialIsFollowing
}: {
  followingProfileId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !isFollowing;
    setIsFollowing(next);
    startTransition(async () => {
      try {
        if (next) {
          await followAction(followingProfileId);
        } else {
          await unfollowAction(followingProfileId);
        }
      } catch {
        setIsFollowing(!next);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        isFollowing
          ? "border border-[color:rgba(83,19,30,0.22)] bg-transparent text-[var(--oxblood)] hover:bg-[color:rgba(83,19,30,0.06)]"
          : "btn-primary"
      }`}
    >
      {isPending ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
