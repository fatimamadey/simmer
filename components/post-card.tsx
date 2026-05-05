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
    <article className="paper-panel relative overflow-hidden rounded-[26px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(83,19,30,0.14)]">
      {/* Stretched link covers the full card */}
      <Link href={`/posts/${post.id}`} className="absolute inset-0 z-0 rounded-[26px]" aria-label={post.title} />
      <img src={post.photoUrl} alt={post.title} className="h-96 w-full object-cover" />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/profile/${post.author.username}`} className="relative z-10 text-xs uppercase tracking-[0.18em] text-[color:rgba(90,70,76,0.72)] hover:text-[var(--oxblood)]">
              @{post.author.username}
            </Link>
            <p className="font-display text-xl text-[var(--oxblood)]">{post.title}</p>
          </div>
          <div className="relative z-10 rounded-full bg-[var(--sage)] px-4 py-2 text-lg font-black text-[var(--oxblood)]">{post.rating}/10</div>
        </div>
        {post.notes?.trim() ? (
          <p className="line-clamp-2 text-[1.02rem] leading-7 text-[color:rgba(61,45,51,0.78)]">{post.notes.trim()}</p>
        ) : null}
        <p className="text-sm text-[color:rgba(90,70,76,0.72)]">{formatDate(post.createdAt)}</p>
      </div>
    </article>
  );
}
