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
        <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8ebd8]/75">{label}</label>
        <button
          type="button"
          onClick={() => setItems((current) => [...current, ""])}
          className="text-sm font-semibold text-[#ffb073]"
        >
          Add line
        </button>
      </div>
      <div className="space-y-3">
        {items.map((value, index) => (
          <div key={`${name}-${index}`} className="flex gap-3">
            <input
              name={name}
              defaultValue={value}
              placeholder={`${placeholder} ${index + 1}`}
              className="w-full rounded-2xl border border-white/10 bg-[#1a1512] px-4 py-3 text-[#fff5ea] outline-none transition placeholder:text-[#f8ebd8]/35 focus:border-[#ff8552]"
            />
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-[#f8ebd8]/70"
              >
                Remove
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

  return <p className="text-sm text-[#ff9f90]">{errors[0]}</p>;
}

export function CreatePostForm() {
  const [state, formAction] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8ebd8]/75">Dish Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="block w-full rounded-[24px] border border-dashed border-[#ff8552]/35 bg-[#1a1512] px-4 py-10 text-sm text-[#f8ebd8]/70 file:mr-4 file:rounded-full file:border-0 file:bg-[#ff8552] file:px-4 file:py-2 file:font-semibold file:text-[#1f1813]"
          />
          <FieldError errors={state.fieldErrors?.photo} />
        </div>

        <div className="space-y-3">
          <label htmlFor="rating" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8ebd8]/75">
            Rating
          </label>
          <input
            id="rating"
            type="number"
            name="rating"
            min={1}
            max={10}
            placeholder="7"
            className="w-full rounded-[24px] border border-white/10 bg-[#1a1512] px-4 py-4 text-4xl font-black text-[#fff5ea] outline-none transition placeholder:text-[#f8ebd8]/20 focus:border-[#ff8552]"
          />
          <p className="text-sm text-[#f8ebd8]/55">Score the actual result, not your ambition.</p>
          <FieldError errors={state.fieldErrors?.rating} />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="notes" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8ebd8]/75">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="What worked? What burned? What would you change next time?"
          className="w-full rounded-[24px] border border-white/10 bg-[#1a1512] px-4 py-4 text-[#fff5ea] outline-none transition placeholder:text-[#f8ebd8]/35 focus:border-[#ff8552]"
        />
        <FieldError errors={state.fieldErrors?.notes} />
      </div>

      <RepeaterField name="ingredients" label="Ingredients" placeholder="Add ingredient" />
      <FieldError errors={state.fieldErrors?.ingredients} />

      <RepeaterField name="steps" label="Steps" placeholder="Describe step" />
      <FieldError errors={state.fieldErrors?.steps} />

      {state.message ? <p className="rounded-2xl border border-[#ff9f90]/20 bg-[#3a1f1a] px-4 py-3 text-sm text-[#ffd2cc]">{state.message}</p> : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#f8ebd8]/55">One photo, one honest score, one recipe worth sharing.</p>
        <SubmitButton />
      </div>
    </form>
  );
}
