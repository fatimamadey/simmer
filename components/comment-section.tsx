import Link from "next/link";

import { getCommentsForPost } from "@/lib/data";
import type { Comment } from "@/lib/types";
import { AddCommentForm } from "@/components/add-comment-form";
import { DeleteCommentButton } from "@/components/delete-comment-button";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateString));
}

function CommentItem({
  comment,
  viewerProfileId
}: {
  comment: Comment;
  viewerProfileId: string | null;
}) {
  const initials = (comment.author.displayName ?? comment.author.username).slice(0, 2).toUpperCase();
  const isOwn = viewerProfileId === comment.authorProfileId;

  return (
    <li className="flex gap-3">
      <Link href={`/profile/${comment.author.username}`} className="shrink-0">
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={comment.author.displayName ?? comment.author.username}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--sage)] text-xs font-black text-[var(--oxblood)]">
            {initials}
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <Link
            href={`/profile/${comment.author.username}`}
            className="text-xs font-semibold text-[var(--oxblood)] hover:underline"
          >
            {comment.author.displayName ?? comment.author.username}
          </Link>
          <span className="text-[10px] text-[color:rgba(90,70,76,0.55)]">{formatDate(comment.createdAt)}</span>
          {isOwn ? (
            <DeleteCommentButton commentId={comment.id} postId={comment.postId} />
          ) : null}
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--ink)]">{comment.body}</p>
      </div>
    </li>
  );
}

export async function CommentSection({
  postId,
  viewerProfileId,
  isSignedIn
}: {
  postId: string;
  viewerProfileId: string | null;
  isSignedIn: boolean;
}) {
  const comments = await getCommentsForPost(postId);

  return (
    <section className="mt-8 border-t border-[var(--line)] pt-8">
      <h2 className="font-display mb-5 text-xl text-[var(--oxblood)]">
        {comments.length > 0 ? `${comments.length} Comment${comments.length === 1 ? "" : "s"}` : "Comments"}
      </h2>

      {isSignedIn ? (
        <div className="mb-6">
          <AddCommentForm postId={postId} />
        </div>
      ) : (
        <p className="mb-6 text-sm text-[color:rgba(61,45,51,0.65)]">
          <Link href="/sign-in" className="font-semibold text-[var(--oxblood)] hover:underline">Sign in</Link> to leave a comment.
        </p>
      )}

      {comments.length > 0 ? (
        <ul className="space-y-5">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} viewerProfileId={viewerProfileId} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[color:rgba(61,45,51,0.6)]">No comments yet — be the first.</p>
      )}
    </section>
  );
}
