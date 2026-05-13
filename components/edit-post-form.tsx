"use client";

import { useActionState } from "react";

import { updatePostAction } from "@/lib/actions";
import type { CreatePostState, PostDetail } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";
import { RepeaterField } from "@/components/repeater-field";
import { PhotoUploadField } from "@/components/photo-upload-field";
import { RatingInput } from "@/components/rating-input";

const initialState: CreatePostState = { status: "idle" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-[var(--oxblood)]">{errors[0]}</p>;
}

export function EditPostForm({ post }: { post: PostDetail }) {
  const boundAction = updatePostAction.bind(null, post.id);
  const [state, formAction] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-3">
        <label htmlFor="title" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">
          Dish Name
        </label>
        <input
          id="title"
          type="text"
          name="title"
          defaultValue={post.title}
          placeholder="e.g. Spicy Miso Ramen"
          className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-4 py-4 text-xl text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
        />
        <FieldError errors={state.fieldErrors?.title} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">
            New Photo <span className="normal-case tracking-normal font-normal text-[color:rgba(90,70,76,0.6)]">(leave blank to keep current)</span>
          </label>
          <PhotoUploadField currentImageUrl={post.photoUrl} currentImageAlt={post.title} />
          <FieldError errors={state.fieldErrors?.photo} />
        </div>

        <div className="space-y-3">
          <RatingInput defaultValue={post.rating} />
          <FieldError errors={state.fieldErrors?.rating} />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="notes" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={post.notes ?? ""}
          className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-4 py-4 text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
        />
        <FieldError errors={state.fieldErrors?.notes} />
      </div>

      <RepeaterField name="ingredients" label="Ingredients" placeholder="Add ingredient" initialValues={post.ingredients} />
      <FieldError errors={state.fieldErrors?.ingredients} />

      <RepeaterField name="steps" label="Steps" placeholder="Describe step" initialValues={post.steps} />
      <FieldError errors={state.fieldErrors?.steps} />

      {state.message ? (
        <p className="rounded-2xl border border-[color:rgba(83,19,30,0.16)] bg-[color:rgba(255,250,204,0.65)] px-4 py-3 text-sm text-[var(--oxblood)]">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-4">
        <SubmitButton label="Save Changes" pendingLabel="Saving..." />
      </div>
    </form>
  );
}
