"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.trim();
    startTransition(() => {
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    });
  }

  return (
    <input
      type="text"
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder="Search by username or name..."
      autoFocus
      className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-5 py-4 text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
    />
  );
}
