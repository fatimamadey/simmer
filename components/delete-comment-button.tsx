"use client";

import { useTransition } from "react";
import { deleteCommentAction } from "@/lib/actions";

export function DeleteCommentButton({ commentId, postId }: { commentId: string; postId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteCommentAction(commentId, postId))}
      className="text-xs font-medium text-[color:rgba(83,19,30,0.45)] transition hover:text-[var(--oxblood)] disabled:opacity-50"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}
