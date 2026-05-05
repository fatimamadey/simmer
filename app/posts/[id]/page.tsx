import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getPostById, getProfileByClerkUserId } from "@/lib/data";
import { DeletePostButton } from "@/components/delete-post-button";
import { RatingPips } from "@/components/rating-pips";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  const [post, viewerProfile] = await Promise.all([
    getPostById(id),
    userId ? getProfileByClerkUserId(userId) : Promise.resolve(null)
  ]);

  if (!post) notFound();

  const isAuthor = viewerProfile?.id === post.authorProfileId;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/feed" className="text-sm font-medium tracking-wide text-[color:rgba(90,70,76,0.65)] hover:text-[var(--oxblood)]">
          ← Feed
        </Link>
        {isAuthor ? (
          <div className="flex items-center gap-3">
            <Link href={`/post/${post.id}/edit`} className="btn-secondary rounded-full px-4 py-2 text-sm transition">
              Edit
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        ) : null}
      </div>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
        <img
          src={post.photoUrl}
          alt={post.title}
          className="h-full min-h-[26rem] w-full rounded-[28px] object-cover"
          style={{ boxShadow: "0 4px 6px rgba(83,19,30,0.06), 0 20px 48px rgba(83,19,30,0.12)" }}
        />

        <div className="paper-panel flex flex-col gap-6 rounded-[28px] p-7 sm:p-9">
          {/* Header */}
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(90,70,76,0.58)] hover:text-[var(--oxblood)]"
            >
              {post.author.displayName ?? post.author.username}
            </Link>
            <h1 className="font-display mt-2 text-[2.2rem] italic leading-[1.1] text-[var(--oxblood)]">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-[color:rgba(90,70,76,0.55)]">{formatDate(post.createdAt)}</p>
          </div>

          {/* Rating */}
          <div className="flex items-end gap-3">
            <div>
              <span className="font-display text-[3.5rem] font-bold leading-none text-[var(--oxblood)]">{post.rating}</span>
              <span className="ml-1 text-sm font-medium text-[color:rgba(83,19,30,0.4)]">/10</span>
            </div>
            <div className="mb-2">
              <RatingPips rating={post.rating} size="md" />
            </div>
          </div>

          {/* Notes */}
          {post.notes?.trim() ? (
            <div className="paper-inset rounded-[20px] bg-[color:rgba(255,239,189,0.55)] px-5 py-4">
              <p className="font-handwritten text-[1.3rem] leading-relaxed text-[color:rgba(46,32,24,0.82)]">
                {post.notes.trim()}
              </p>
            </div>
          ) : null}

          {/* Ingredients + Steps */}
          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(83,19,30,0.6)]">Ingredients</p>
              <ul className="mt-3 space-y-2">
                {post.ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="paper-inset rounded-[14px] bg-[color:rgba(181,214,178,0.35)] px-4 py-2.5 text-sm text-[var(--ink)]"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(83,19,30,0.6)]">Steps</p>
              <ol className="mt-3 space-y-2">
                {post.steps.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="paper-inset rounded-[14px] bg-[color:rgba(255,250,204,0.6)] px-4 py-2.5 text-sm text-[var(--ink)]"
                  >
                    <span className="mr-2 font-bold text-[var(--oxblood)]">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
