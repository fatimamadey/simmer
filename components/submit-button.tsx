"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-[#ff8552] px-6 py-3 text-sm font-bold text-[#1f1813] transition hover:bg-[#ffa16d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Posting..." : "Publish Recipe"}
    </button>
  );
}
