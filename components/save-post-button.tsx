"use client";

import { useState, useTransition } from "react";

import { savePostAction, unsavePostAction } from "@/lib/actions";

type SavePostButtonProps = {
  postId: string;
  initialIsSaved: boolean;
  compact?: boolean;
};

export function SavePostButton({ postId, initialIsSaved, compact = false }: SavePostButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  function toggleSave() {
    const next = !isSaved;
    setIsSaved(next);

    startTransition(async () => {
      try {
        if (next) {
          await savePostAction(postId);
        } else {
          await unsavePostAction(postId);
        }
      } catch {
        setIsSaved(!next);
      }
    });
  }

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      onClick={toggleSave}
      disabled={isPending}
      className={`relative z-10 rounded-full border font-semibold transition disabled:opacity-60 ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      } ${
        isSaved
          ? "border-[color:rgba(83,19,30,0.22)] bg-[var(--oxblood)] text-[var(--cream)] hover:bg-[color:rgba(83,19,30,0.9)]"
          : "border-[color:rgba(83,19,30,0.18)] bg-[color:rgba(253,248,238,0.88)] text-[var(--oxblood)] hover:bg-[color:rgba(181,214,178,0.28)]"
      }`}
    >
      {isPending ? "..." : isSaved ? "Saved" : "Save"}
    </button>
  );
}
