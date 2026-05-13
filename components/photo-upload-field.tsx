"use client";

import { useEffect, useState } from "react";

type PhotoUploadFieldProps = {
  currentImageUrl?: string;
  currentImageAlt?: string;
};

export function PhotoUploadField({ currentImageUrl, currentImageAlt = "Current recipe photo" }: PhotoUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl ?? null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
      <div className="overflow-hidden rounded-[22px] border border-[color:rgba(83,19,30,0.12)] bg-[color:rgba(255,250,204,0.38)]">
        {previewUrl ? (
          <img src={previewUrl} alt={currentImageAlt} className="h-56 w-full object-cover" />
        ) : (
          <div className="grid h-56 place-items-center px-6 text-center text-sm font-medium text-[color:rgba(90,70,76,0.62)]">
            Add a real plate photo
          </div>
        )}
      </div>

      <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[color:rgba(83,19,30,0.24)] bg-[color:rgba(255,250,204,0.44)] px-5 py-8 text-center transition hover:bg-[color:rgba(181,214,178,0.22)]">
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(83,19,30,0.72)]">Photo</span>
        <span className="mt-2 max-w-xs text-sm leading-6 text-[color:rgba(90,70,76,0.7)]">
          Use a clear phone photo of the dish. JPG, PNG, or WebP up to 5MB.
        </span>
        <span className="btn-primary mt-5 rounded-full px-4 py-2 text-sm">Choose Photo</span>
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (objectUrl) URL.revokeObjectURL(objectUrl);

            if (!file) {
              setObjectUrl(null);
              setPreviewUrl(currentImageUrl ?? null);
              return;
            }

            const nextObjectUrl = URL.createObjectURL(file);
            setObjectUrl(nextObjectUrl);
            setPreviewUrl(nextObjectUrl);
          }}
        />
      </label>
    </div>
  );
}
