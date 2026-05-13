"use client";

import { useRef, useState, useTransition } from "react";

import { addCommentAction } from "@/lib/actions";

export function AddCommentForm({ postId }: { postId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = new FormData(event.currentTarget).get("body")?.toString() ?? "";
    setError(null);

    startTransition(async () => {
      const result = await addCommentAction(postId, body);
      if (result.error) {
        setError(result.error);
      } else {
        ref.current?.reset();
      }
    });
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        name="body"
        rows={2}
        maxLength={280}
        placeholder="What do you think?"
        required
        disabled={isPending}
        className="w-full resize-none rounded-[16px] border border-[color:rgba(83,19,30,0.14)] bg-[color:rgba(255,250,204,0.44)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[color:rgba(90,70,76,0.45)] focus:outline-none focus:ring-1 focus:ring-[color:rgba(83,19,30,0.3)] disabled:opacity-60"
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary self-end rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
