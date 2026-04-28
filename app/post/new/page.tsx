import { CreatePostForm } from "@/components/create-post-form";

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ffb073]">New recipe post</p>
        <h1 className="text-4xl font-black uppercase tracking-[-0.04em] text-[#fff5ea] sm:text-5xl">
          Show the dish exactly how it went.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[#f8ebd8]/74">
          The point is not to look perfect. The point is to make cooking legible: what you made, how it turned out, and
          how someone else could try it.
        </p>
      </div>

      <section className="mt-10 rounded-[32px] border border-white/10 bg-[#221c18] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] sm:p-8">
        <CreatePostForm />
      </section>
    </main>
  );
}
