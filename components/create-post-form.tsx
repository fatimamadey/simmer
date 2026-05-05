"use client";

import { useActionState, useState } from "react";

import { createPostAction } from "@/lib/actions";
import type { CreatePostState } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";

const initialState: CreatePostState = {
  status: "idle"
};

type RepeaterFieldProps = {
  name: "ingredients" | "steps";
  label: string;
  placeholder: string;
};

function RepeaterField({ name, label, placeholder }: RepeaterFieldProps) {
  const [items, setItems] = useState([""]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">{label}</label>
        <button
          type="button"
          onClick={() => setItems((current) => [...current, ""])}
          className="text-sm font-semibold text-[var(--oxblood)]"
        >
          Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((value, index) => (
          <div key={`${name}-${index}`} className="flex gap-3">
            <input
              name={name}
              defaultValue={value}
              placeholder={`${placeholder} ${index + 1}`}
              className="w-full rounded-2xl border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
            />
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-2xl border border-[color:rgba(90,70,76,0.14)] px-4 py-3 text-sm text-[color:rgba(90,70,76,0.78)]"
              >
                Cut
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-sm text-[var(--oxblood)]">{errors[0]}</p>;
}

export function CreatePostForm() {
  const [state, formAction] = useActionState(createPostAction, initialState);

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
          placeholder="e.g. Spicy Miso Ramen"
          className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-4 py-4 text-xl text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
        />
        <FieldError errors={state.fieldErrors?.title} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="block w-full rounded-[24px] border border-dashed border-[color:rgba(83,19,30,0.22)] bg-[color:rgba(255,250,204,0.44)] px-4 py-10 text-sm text-[color:rgba(90,70,76,0.78)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--oxblood)] file:px-4 file:py-2 file:font-semibold file:text-[var(--cream)]"
          />
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
            placeholder="7"
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
          className="w-full rounded-[24px] border border-[color:rgba(90,70,76,0.14)] bg-[color:rgba(255,250,204,0.48)] px-4 py-4 text-[var(--ink)] outline-none transition focus:border-[var(--oxblood)]"
        />
        <FieldError errors={state.fieldErrors?.notes} />
      </div>

      <RepeaterField name="ingredients" label="Ingredients" placeholder="Add ingredient" />
      <FieldError errors={state.fieldErrors?.ingredients} />

      <RepeaterField name="steps" label="Steps" placeholder="Describe step" />
      <FieldError errors={state.fieldErrors?.steps} />

      {state.message ? <p className="rounded-2xl border border-[color:rgba(83,19,30,0.16)] bg-[color:rgba(255,250,204,0.65)] px-4 py-3 text-sm text-[var(--oxblood)]">{state.message}</p> : null}

      <div className="flex items-center justify-end gap-4">
        <SubmitButton />
      </div>
    </form>
  );
}
