"use client";

import { ChangeEvent, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Camera,
  Check,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Star,
  Trash2,
} from "lucide-react";

import type { ListingPhoto } from "@/lib/owner/types";

type Props = {
  listingId: string;
  accessToken: string;
  photos: ListingPhoto[];
  onChange: (photos: ListingPhoto[]) => void;
};

const roomLabels = [
  "Property photo",
  "Living room",
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Balcony / view",
  "Exterior",
  "Amenities",
  "Floor plan",
] as const;

const MAX_PHOTOS = 12;
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 3.8 * 1024 * 1024;

async function canvasBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );
  if (!blob) throw new Error("This photo could not be prepared.");
  return blob;
}

async function prepareImage(file: File) {
  if (!/^image\/(jpeg|png|webp)$/u.test(file.type)) {
    throw new Error(`${file.name}: use a JPG, PNG or WebP photo.`);
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`${file.name}: the original photo is larger than 12 MB.`);
  }

  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, 2400 / longest);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    bitmap.close();
    throw new Error("This browser could not prepare the photo.");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let blob = await canvasBlob(canvas, 0.88);
  if (blob.size > MAX_UPLOAD_BYTES) blob = await canvasBlob(canvas, 0.76);
  if (blob.size > MAX_UPLOAD_BYTES) blob = await canvasBlob(canvas, 0.62);
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name}: we could not reduce this photo below 4 MB.`);
  }

  return new File([blob], `${crypto.randomUUID()}.webp`, {
    type: "image/webp",
  });
}

export default function PhotoUploader({
  listingId,
  accessToken,
  photos,
  onChange,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [working, setWorking] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  async function api(path: string, init: RequestInit) {
    const response = await fetch(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });
    const result = (await response.json().catch(() => ({}))) as {
      photo?: ListingPhoto;
      photos?: ListingPhoto[];
      error?: string;
    };
    if (!response.ok) throw new Error(result.error || "The photo update failed.");
    return result;
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (!rightsConfirmed) {
      setMessage("Confirm you own or may use these photos before uploading.");
      return;
    }
    if (photos.length + files.length > MAX_PHOTOS) {
      setMessage(`Choose up to ${MAX_PHOTOS - photos.length} more photo${MAX_PHOTOS - photos.length === 1 ? "" : "s"}.`);
      return;
    }

    setWorking(true);
    setMessage("");
    let current = [...photos];
    try {
      for (const [index, source] of files.entries()) {
        setProgress(`Preparing photo ${index + 1} of ${files.length}...`);
        const prepared = await prepareImage(source);
        setProgress(`Uploading photo ${index + 1} of ${files.length}...`);
        const body = new FormData();
        body.set("file", prepared);
        body.set("label", "Property photo");
        body.set(
          "alt_text",
          `Property photo ${current.length + 1}`
        );
        const result = await api(
          `/api/account/listings/${encodeURIComponent(listingId)}/photos`,
          { method: "POST", body }
        );
        if (result.photo) {
          current = [...current, result.photo].sort(
            (a, b) => a.sort_order - b.sort_order
          );
          onChange(current);
        }
      }
      setMessage(
        `${files.length} photo${files.length === 1 ? "" : "s"} uploaded for review. Image metadata was removed for privacy.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "A photo could not be uploaded."
      );
    } finally {
      setWorking(false);
      setProgress("");
    }
  }

  async function patchPhoto(
    photo: ListingPhoto,
    update: Partial<Pick<ListingPhoto, "sort_order" | "is_cover" | "label" | "alt_text">>
  ) {
    setBusyId(photo.id);
    setMessage("");
    try {
      const result = await api(
        `/api/account/listings/${encodeURIComponent(listingId)}/photos`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: photo.id, ...update }),
        }
      );
      if (result.photos) onChange(result.photos);
      else if (result.photo) {
        onChange(
          photos
            .map((item) =>
              item.id === photo.id
                ? {
                    ...item,
                    ...result.photo!,
                    preview_url:
                      result.photo?.preview_url || item.preview_url || null,
                  }
                : item
            )
            .map((item) =>
              update.is_cover && item.id !== photo.id
                ? { ...item, is_cover: false }
                : item
            )
            .sort((a, b) => a.sort_order - b.sort_order)
        );
      } else {
        onChange(
          photos.map((item) =>
            item.id === photo.id ? { ...item, ...update } : item
          )
        );
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Photo update failed.");
    } finally {
      setBusyId("");
    }
  }

  async function move(photo: ListingPhoto, direction: -1 | 1) {
    const ordered = [...photos].sort((a, b) => a.sort_order - b.sort_order);
    const index = ordered.findIndex((item) => item.id === photo.id);
    const other = ordered[index + direction];
    if (!other) return;
    setBusyId(photo.id);
    setMessage("");
    try {
      const reordered = ordered
        .map((item) => {
          if (item.id === photo.id) return { ...item, sort_order: other.sort_order };
          if (item.id === other.id) return { ...item, sort_order: photo.sort_order };
          return item;
        })
        .sort((a, b) => a.sort_order - b.sort_order);

      await api(
        `/api/account/listings/${encodeURIComponent(listingId)}/photos`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photos: reordered.map((item, sortOrder) => ({
              id: item.id,
              sort_order: sortOrder,
              is_cover: item.is_cover,
            })),
          }),
        }
      );
      onChange(
        reordered.map((item, sortOrder) => ({
          ...item,
          sort_order: sortOrder,
        }))
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Photo order could not be saved.");
    } finally {
      setBusyId("");
    }
  }

  async function remove(photo: ListingPhoto) {
    if (!window.confirm("Remove this property photo?")) return;
    setBusyId(photo.id);
    setMessage("");
    try {
      await api(
        `/api/account/listings/${encodeURIComponent(listingId)}/photos?id=${encodeURIComponent(photo.id)}`,
        { method: "DELETE" }
      );
      onChange(photos.filter((item) => item.id !== photo.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Photo removal failed.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section>
      <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9a7410]">
        Property media
      </p>
      <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
        Show the home clearly.
      </h2>
      <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">
        Upload bright, recent photos of the actual property. We resize them to
        high-quality WebP and remove image metadata before upload.
      </p>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-6 text-amber-950/75">
        <p className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldAlert className="size-5" /> Photos only - never documents
        </p>
        <p className="mt-2">
          Do not upload Aadhaar, PAN, title deeds, agreements, bank statements,
          screenshots with contact details, exact flat numbers, people&apos;s faces
          without permission, or photos you do not have permission to use.
        </p>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-[#f8f9fa] p-4">
        <input
          type="checkbox"
          checked={rightsConfirmed}
          onChange={(event) => setRightsConfirmed(event.target.checked)}
          className="mt-0.5 size-4 accent-[#c9a227]"
        />
        <span className="text-[11px] leading-5 text-slate-600">
          I confirm these are genuine property photos that I own or have
          permission to use, and they do not contain sensitive documents.
        </span>
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={working || photos.length >= MAX_PHOTOS}
          className="flex min-h-28 items-center justify-center gap-3 rounded-[1.4rem] border-2 border-dashed border-[#c9a227]/40 bg-[#fffdf5] p-5 text-sm font-bold text-[#071a2f] transition hover:border-[#c9a227] disabled:opacity-50"
        >
          <ImagePlus className="size-6 text-[#9a7410]" /> Choose from gallery
        </button>
        <button
          type="button"
          onClick={() => cameraInput.current?.click()}
          disabled={working || photos.length >= MAX_PHOTOS}
          className="flex min-h-28 items-center justify-center gap-3 rounded-[1.4rem] border-2 border-dashed border-slate-300 bg-white p-5 text-sm font-bold text-[#071a2f] transition hover:border-[#c9a227] disabled:opacity-50"
        >
          <Camera className="size-6 text-[#9a7410]" /> Take a photo
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={uploadFiles}
          className="sr-only"
        />
        <input
          ref={cameraInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={uploadFiles}
          className="sr-only"
        />
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-400">
        JPG, PNG or WebP | up to {MAX_PHOTOS} photos | original up to 12 MB each |
        {" "}{photos.length}/{MAX_PHOTOS} added
      </p>

      {working && (
        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-[#071a2f] p-4 text-xs font-bold text-white" aria-live="polite">
          <LoaderCircle className="size-5 animate-spin text-[#e4c462]" />
          {progress || "Preparing photos..."}
        </div>
      )}

      {message && (
        <p
          aria-live="polite"
          className={`mt-5 rounded-2xl border p-4 text-xs leading-6 ${
            /uploaded|removed/i.test(message)
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {message}
        </p>
      )}

      {photos.length > 0 && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...photos]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((photo, index) => (
              <article
                key={photo.id}
                className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  {photo.preview_url ? (
                    // Signed storage URLs are intentionally rendered without image optimisation.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.preview_url}
                      alt={photo.alt_text || photo.label || "Property photo"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-slate-300">
                      <ImagePlus className="size-10" />
                    </span>
                  )}
                  {photo.is_cover && (
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#c9a227] px-3 py-1.5 text-[9px] font-extrabold text-[#071a2f] shadow-sm">
                      <Star className="mr-1 size-3 fill-current" /> Cover
                    </span>
                  )}
                  <span
                    className={`absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                      photo.status === "approved"
                        ? "bg-emerald-600 text-white"
                        : photo.status === "rejected"
                          ? "bg-rose-600 text-white"
                          : "bg-[#071a2f] text-white"
                    }`}
                  >
                    {photo.status === "approved"
                      ? "Photo approved"
                      : photo.status === "rejected"
                        ? "Action needed"
                        : "Pending review"}
                  </span>
                </div>

                <div className="p-4">
                  <label className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
                    Photo label
                    <select
                      value={photo.label || "Property photo"}
                      onChange={(event) =>
                        patchPhoto(photo, {
                          label: event.target.value,
                          alt_text: `${event.target.value} at the property`,
                        })
                      }
                      className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-[#f8f9fa] px-3 text-xs font-semibold normal-case tracking-normal text-[#071a2f] outline-none focus:border-[#c9a227]"
                    >
                      {roomLabels.map((label) => (
                        <option key={label}>{label}</option>
                      ))}
                    </select>
                  </label>

                  {photo.status === "rejected" && photo.rejection_reason && (
                    <p className="mt-3 flex gap-2 rounded-xl bg-rose-50 p-3 text-[10px] leading-5 text-rose-800">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                      {photo.rejection_reason}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={index === 0 || busyId === photo.id}
                        onClick={() => move(photo, -1)}
                        aria-label="Move photo earlier"
                        className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === photos.length - 1 || busyId === photo.id}
                        onClick={() => move(photo, 1)}
                        aria-label="Move photo later"
                        className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={photo.is_cover || busyId === photo.id}
                      onClick={() => patchPhoto(photo, { is_cover: true })}
                      className="inline-flex h-9 items-center rounded-full border border-slate-200 px-3 text-[10px] font-bold text-[#071a2f] disabled:opacity-45"
                    >
                      {busyId === photo.id ? (
                        <RefreshCw className="mr-1 size-3 animate-spin" />
                      ) : photo.is_cover ? (
                        <Check className="mr-1 size-3" />
                      ) : (
                        <Star className="mr-1 size-3" />
                      )}
                      {photo.is_cover ? "Cover" : "Make cover"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === photo.id}
                      onClick={() => remove(photo)}
                      aria-label="Remove photo"
                      className="flex size-9 items-center justify-center rounded-full border border-rose-200 text-rose-600 disabled:opacity-40"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}
