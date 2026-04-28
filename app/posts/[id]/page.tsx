import { notFound } from "next/navigation";

import { getPostById } from "@/lib/data";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(dateString));
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <img src={post.photoUrl} alt={post.notes ?? "Recipe post photo"} className="h-full min-h-[24rem] w-full rounded-[32px] object-cover" />

        <div className="space-y-6 rounded-[32px] border border-white/10 bg-[#221c18] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-[#f8ebd8]/55">@{post.author.username}</p>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-[#fff5ea]">
                {post.author.displayName ?? post.author.username}&apos;s dish
              </h1>
              <p className="mt-2 text-sm text-[#f8ebd8]/55">{formatDate(post.createdAt)}</p>
            </div>
            <div className="rounded-full bg-[#ff8552] px-5 py-3 text-2xl font-black text-[#1c1510]">{post.rating}/10</div>
          </div>

          <div className="rounded-[24px] bg-[#17120f] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffb073]">Cook notes</p>
            <p className="mt-3 text-lg leading-8 text-[#f8ebd8]/85">
              {post.notes?.trim() || "No written notes this time. Let the dish speak for itself."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffb073]">Ingredients</p>
              <ul className="mt-4 space-y-3 text-[#fff5ea]">
                {post.ingredients.map((ingredient) => (
                  <li key={ingredient} className="rounded-2xl bg-[#17120f] px-4 py-3">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffb073]">Steps</p>
              <ol className="mt-4 space-y-3 text-[#fff5ea]">
                {post.steps.map((step, index) => (
                  <li key={`${index}-${step}`} className="rounded-2xl bg-[#17120f] px-4 py-3">
                    <span className="mr-3 font-black text-[#ff8552]">{index + 1}.</span>
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
