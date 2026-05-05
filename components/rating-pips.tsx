type RatingPipsProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
};

export function RatingPips({ rating, size = "sm" }: RatingPipsProps) {
  const pipClass =
    size === "lg" ? "h-3 w-3" :
    size === "md" ? "h-2.5 w-2.5" :
    "h-2 w-2";

  return (
    <div className="flex flex-wrap gap-[3px]">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`rounded-full ${pipClass} ${
            i < rating
              ? "bg-[var(--oxblood)]"
              : "bg-[color:rgba(83,19,30,0.12)]"
          }`}
        />
      ))}
    </div>
  );
}
