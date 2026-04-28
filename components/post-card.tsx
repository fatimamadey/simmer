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
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#221c18] shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
      <img src={post.photoUrl} alt={post.notes ?? "Recipe post photo"} className="h-80 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-[#f8ebd8]/60">@{post.author.username}</p>
            <p className="text-lg font-semibold text-[#fff5ea]">{post.author.displayName ?? post.author.username}</p>
          </div>
          <div className="rounded-full bg-[#ff8552] px-4 py-2 text-lg font-black text-[#1a1410]">{post.rating}/10</div>
        </div>
        <p className="line-clamp-3 min-h-[4.5rem] text-base leading-7 text-[#f8ebd8]/88">
          {post.notes?.trim() || "No notes, just vibes and a hot pan."}
        </p>
        <div className="flex items-center justify-between text-sm text-[#f8ebd8]/55">
          <span>{formatDate(post.createdAt)}</span>
          <Link href={`/posts/${post.id}`} className="font-semibold text-[#ffb073]">
            See recipe
          </Link>
        </div>
      </div>
    </article>
  );
}
