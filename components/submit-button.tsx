"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  label = "Publish Recipe",
  pendingLabel = "Posting..."
}: {
  label?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
