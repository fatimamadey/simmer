"use client";

import { useActionState } from "react";

import { updatePostAction } from "@/lib/actions";
import type { CreatePostState, PostDetail } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";
import { RepeaterField } from "@/components/repeater-field";

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

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">
            New Photo <span className="normal-case tracking-normal font-normal text-[color:rgba(90,70,76,0.6)]">(leave blank to keep current)</span>
          </label>
          <div className="space-y-3">
            <img src={post.photoUrl} alt={post.title} className="h-32 w-full rounded-[18px] object-cover" />
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="block w-full rounded-[24px] border border-dashed border-[color:rgba(83,19,30,0.22)] bg-[color:rgba(255,250,204,0.44)] px-4 py-6 text-sm text-[color:rgba(90,70,76,0.78)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--oxblood)] file:px-4 file:py-2 file:font-semibold file:text-[var(--cream)]"
            />
          </div>
          <FieldError errors={state.fieldErrors?.photo} />
        </div>

        <div className="space-y-3">
          <label htmlFor="rating" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">
            Rating
          </label>
          <input
            id="rating"
            type="number"
            name="rating"
            min={1}
            max={10}
            defaultValue={post.rating}
            className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(181,214,178,0.34)] px-4 py-4 text-4xl font-black text-[var(--oxblood)] outline-none transition focus:border-[var(--oxblood)]"
          />
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
