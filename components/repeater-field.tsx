"use client";

import { useState } from "react";

type RepeaterFieldProps = {
  name: "ingredients" | "steps";
  label: string;
  placeholder: string;
  initialValues?: string[];
};

export function RepeaterField({ name, label, placeholder, initialValues }: RepeaterFieldProps) {
  const [items, setItems] = useState<string[]>(initialValues?.length ? initialValues : [""]);

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
                onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
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
