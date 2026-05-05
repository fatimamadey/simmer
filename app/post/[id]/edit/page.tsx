import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getPostById, getProfileByClerkUserId } from "@/lib/data";
import { EditPostForm } from "@/components/edit-post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect(`/posts/${id}`);

  const [post, profile] = await Promise.all([getPostById(id), getProfileByClerkUserId(userId)]);

  if (!post) notFound();
  if (!profile || profile.id !== post.authorProfileId) redirect(`/posts/${id}`);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link href={`/posts/${id}`} className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(90,70,76,0.72)] hover:text-[var(--oxblood)]">
            ← Back
          </Link>
          <h1 className="font-display mt-2 text-4xl text-[var(--oxblood)]">Edit Post</h1>
        </div>
      </div>

      <section className="paper-panel rounded-[32px] p-6 sm:p-8">
        <EditPostForm post={post} />
      </section>
    </main>
  );
}
