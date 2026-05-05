import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getPostById, getProfileByClerkUserId } from "@/lib/data";
import { DeletePostButton } from "@/components/delete-post-button";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
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
        <Link href="/feed" className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(90,70,76,0.72)] hover:text-[var(--oxblood)]">
          ← Feed
        </Link>
        {isAuthor ? (
          <div className="flex items-center gap-3">
            <Link
              href={`/post/${post.id}/edit`}
              className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              Edit
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        ) : null}
      </div>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <img src={post.photoUrl} alt={post.title} className="h-full min-h-[24rem] w-full rounded-[32px] object-cover" />

        <div className="paper-panel space-y-6 rounded-[32px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href={`/profile/${post.author.username}`} className="text-sm uppercase tracking-[0.16em] text-[color:rgba(90,70,76,0.72)] hover:text-[var(--oxblood)]">
                @{post.author.username}
              </Link>
              <h1 className="font-display mt-2 text-4xl leading-none text-[var(--oxblood)]">
                {post.title}
              </h1>
              <p className="mt-2 text-sm text-[color:rgba(90,70,76,0.72)]">{formatDate(post.createdAt)}</p>
            </div>
            <div className="rounded-full bg-[var(--sage)] px-5 py-3 text-2xl font-black text-[var(--oxblood)]">{post.rating}/10</div>
          </div>

          {post.notes?.trim() ? (
            <div className="paper-inset rounded-[24px] bg-[color:rgba(255,239,189,0.72)] p-5">
              <p className="text-lg leading-8 text-[color:rgba(61,45,51,0.84)]">{post.notes.trim()}</p>
            </div>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">Ingredients</p>
              <ul className="mt-4 space-y-3 text-[var(--ink)]">
                {post.ingredients.map((ingredient) => (
                  <li key={ingredient} className="paper-inset rounded-[18px] bg-[color:rgba(181,214,178,0.4)] px-4 py-3">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">Steps</p>
              <ol className="mt-4 space-y-3 text-[var(--ink)]">
                {post.steps.map((step, index) => (
                  <li key={`${index}-${step}`} className="paper-inset rounded-[18px] bg-[color:rgba(255,250,204,0.7)] px-4 py-3">
                    <span className="mr-3 font-black text-[var(--oxblood)]">{index + 1}.</span>
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
