"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/lib/actions";

export function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const boundDelete = deletePostAction.bind(null, postId);

  function handleClick() {
    if (!confirm("Delete this post? This can't be undone.")) return;
    startTransition(() => boundDelete());
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full border border-[color:rgba(83,19,30,0.22)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--oxblood)] transition hover:bg-[color:rgba(83,19,30,0.06)] disabled:opacity-60"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
