import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { CreatePostForm } from "@/components/create-post-form";

export default async function NewPostPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-[var(--oxblood)]">New Post</h1>
      </div>

      <section className="paper-panel rounded-[32px] p-6 sm:p-8">
        <CreatePostForm />
      </section>
    </main>
  );
}
