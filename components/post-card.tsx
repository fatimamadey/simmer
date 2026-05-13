import Link from "next/link";

import type { PostSummary } from "@/lib/types";
import { RatingPips } from "@/components/rating-pips";
import { SavePostButton } from "@/components/save-post-button";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

type PostCardProps = {
  post: PostSummary;
  viewerCanSave?: boolean;
  initialIsSaved?: boolean;
};

export function PostCard({ post, viewerCanSave = false, initialIsSaved = false }: PostCardProps) {
  return (
    <article className="recipe-card paper-panel relative overflow-hidden rounded-[22px]">
      <Link href={`/posts/${post.id}`} className="absolute inset-0 z-0 rounded-[22px]" aria-label={post.title} />
      <img src={post.photoUrl} alt={post.title} className="h-80 w-full object-cover" />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/profile/${post.author.username}`}
              className="relative z-10 text-xs font-medium uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.6)] hover:text-[var(--oxblood)]"
            >
              {post.author.displayName ?? post.author.username}
            </Link>
            <p className="font-display mt-0.5 text-lg italic leading-tight text-[var(--oxblood)]">{post.title}</p>
          </div>
          <div className="relative z-10 shrink-0 text-right">
            <p className="font-display text-2xl font-bold leading-none text-[var(--oxblood)]">{post.rating}</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-[color:rgba(83,19,30,0.45)]">/ 10</p>
          </div>
        </div>

        <RatingPips rating={post.rating} size="sm" />

        {post.notes?.trim() ? (
          <p className="font-handwritten line-clamp-2 text-[1.05rem] leading-snug text-[color:rgba(46,32,24,0.72)]">
            {post.notes.trim()}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-[color:rgba(90,70,76,0.55)]">{formatDate(post.createdAt)}</p>
          {viewerCanSave ? <SavePostButton postId={post.id} initialIsSaved={initialIsSaved} compact /> : null}
        </div>
      </div>
    </article>
  );
}
