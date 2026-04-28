import Link from "next/link";

import type { PostSummary } from "@/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(dateString));
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="paper-panel overflow-hidden rounded-[26px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(83,19,30,0.14)]">
      <img src={post.photoUrl} alt={post.notes ?? "Recipe post photo"} className="h-96 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[color:rgba(90,70,76,0.72)]">@{post.author.username}</p>
            <p className="font-display text-xl text-[var(--oxblood)]">{post.author.displayName ?? post.author.username}</p>
          </div>
          <div className="rounded-full bg-[var(--sage)] px-4 py-2 text-lg font-black text-[var(--oxblood)]">{post.rating}/10</div>
        </div>
        <p className="line-clamp-3 min-h-[4.5rem] text-[1.02rem] leading-7 text-[color:rgba(61,45,51,0.78)]">
          {post.notes?.trim() || ""}
        </p>
        <div className="flex items-center justify-between text-sm text-[color:rgba(90,70,76,0.76)]">
          <span>{formatDate(post.createdAt)}</span>
          <Link href={`/posts/${post.id}`} className="font-semibold text-[var(--oxblood)]">
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}
