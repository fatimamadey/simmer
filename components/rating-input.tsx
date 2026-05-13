"use client";

import { useState } from "react";

import { RatingPips } from "@/components/rating-pips";

type RatingInputProps = {
  defaultValue?: number;
};

export function RatingInput({ defaultValue = 7 }: RatingInputProps) {
  const [rating, setRating] = useState(defaultValue);

  return (
    <div className="rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(181,214,178,0.34)] p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">Rating</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="font-display text-5xl font-bold leading-none text-[var(--oxblood)]">{rating}</span>
            <span className="pb-1 text-sm font-medium text-[color:rgba(83,19,30,0.5)]">/10</span>
          </div>
        </div>
        <RatingPips rating={rating} size="sm" />
      </div>
      <input
        type="range"
        name="rating"
        min={1}
        max={10}
        step={1}
        value={rating}
        aria-label="Rating"
        onChange={(event) => setRating(Number(event.currentTarget.value))}
        className="mt-5 w-full accent-[var(--oxblood)]"
      />
      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:rgba(90,70,76,0.55)]">
        <span>Burnt</span>
        <span>Perfect</span>
      </div>
    </div>
  );
}
