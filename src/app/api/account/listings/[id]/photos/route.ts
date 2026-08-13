import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import sharp from "sharp";

import { apiError, jsonBody, ownerRequest, validUuid } from "@/app/api/account/_shared";
import {
  countListingPhotos,
  getOwnerListing,
  photoPreviewUrls,
  reorderListingPhotos,
  deleteListingPhoto,
  updateListingPhoto,
  uploadListingPhoto,
} from "@/lib/owner/server";
import { ownerMayEditStatus, parsePhotoMetadata, parsePhotoOrder } from "@/lib/owner/validation";
import { sanitizePublicSingleLine } from "@/lib/listings/safety";

export const runtime = "nodejs";

const maxPhotoBytes = 4 * 1024 * 1024;
const maxImagePixels = 40_000_000;

function imageMime(bytes: Uint8Array) {
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return "";
}

async function editableListing(ownerId: string, listingId: string) {
  const listing = await getOwnerListing(ownerId, listingId);
  return listing && ownerMayEditStatus(listing.status) ? listing : null;
}

type PhotosContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: PhotosContext) {
  const auth = await ownerRequest(request);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  if (!validUuid(id)) return apiError("Property was not found.", 404);
  try {
    const listing = await getOwnerListing(auth.user.id, id);
    if (!listing) return apiError("Property was not found.", 404);
    return NextResponse.json({ ok: true, photos: await photoPreviewUrls(listing.photos || []) });
  } catch {
    return apiError("Unable to load property photos.", 503);
  }
}

export async function POST(request: NextRequest, context: PhotosContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  if (!validUuid(id)) return apiError("Property was not found.", 404);
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxPhotoBytes + 128 * 1024) return apiError("Each photo must be 4 MB or smaller.", 413);

  try {
    if (!(await editableListing(auth.user.id, id))) return apiError("Photos can only be changed while a property is a draft or returned for changes.", 409);
    if ((await countListingPhotos(auth.user.id, id)) >= 12) return apiError("You can upload up to 12 property photos.", 409);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size < 32 || file.size > maxPhotoBytes) return apiError("Choose a property photo up to 4 MB.", 400);
    const sourceBytes = new Uint8Array(await file.arrayBuffer());
    const mime = imageMime(sourceBytes);
    if (!mime) return apiError("Use a WebP, JPEG or PNG property photo.", 415);
    let bytes: Uint8Array;
    let width: number | null = null;
    let height: number | null = null;
    try {
      const processed = await sharp(sourceBytes, {
        failOn: "warning",
        limitInputPixels: maxImagePixels,
      })
        .rotate()
        .resize({
          width: 2_400,
          height: 2_400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 84, effort: 4 })
        .toBuffer({ resolveWithObject: true });
      if (!processed.data.length || processed.data.length > maxPhotoBytes) {
        return apiError("This photo could not be safely optimised below 4 MB.", 413);
      }
      bytes = new Uint8Array(processed.data);
      width = processed.info.width;
      height = processed.info.height;
    } catch {
      return apiError("This image is damaged or too large to process safely.", 415);
    }
    const metadata = parsePhotoMetadata({ label: form.get("label"), alt_text: form.get("alt_text") });
    const photo = await uploadListingPhoto({
      ownerId: auth.user.id,
      listingId: id,
      bytes,
      mime: "image/webp",
      label: metadata.label,
      altText: metadata.alt_text,
      width,
      height,
    });
    const [withPreview] = await photoPreviewUrls([photo]);
    return NextResponse.json({ ok: true, photo: withPreview }, { status: 201 });
  } catch {
    return apiError("Unable to upload this photo.", 503);
  }
}

export async function PATCH(request: NextRequest, context: PhotosContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  const body = await jsonBody(request, 12 * 1024);
  if (!validUuid(id) || !body || typeof body !== "object") return apiError("Photo update was not accepted.", 400);
  try {
    if (!(await editableListing(auth.user.id, id))) return apiError("Photos are locked while this property is under review.", 409);
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.photos)) {
      const order = parsePhotoOrder(record);
      if (!order) return apiError("Photo order was not accepted.", 400);
      return (await reorderListingPhotos(auth.user.id, id, order))
        ? NextResponse.json({ ok: true })
        : apiError("Photo order did not match this property.", 400);
    }
    const photoId = sanitizePublicSingleLine(record.id, 64);
    if (!validUuid(photoId)) return apiError("Photo was not found.", 404);
    const update: { label?: string; alt_text?: string; sort_order?: number; is_cover?: boolean } = {};
    if (typeof record.label === "string") update.label = sanitizePublicSingleLine(record.label, 80);
    if (typeof record.alt_text === "string") update.alt_text = sanitizePublicSingleLine(record.alt_text, 180);
    if (record.sort_order !== undefined) {
      const sortOrder = Number(record.sort_order);
      if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 11) return apiError("Photo order was not accepted.", 400);
      update.sort_order = sortOrder;
    }
    if (record.is_cover !== undefined) update.is_cover = record.is_cover === true;
    if (!Object.keys(update).length) return apiError("No photo changes were provided.", 400);
    const photo = await updateListingPhoto(auth.user.id, id, photoId, update);
    return photo ? NextResponse.json({ ok: true, photo }) : apiError("Photo was not found.", 404);
  } catch {
    return apiError("Unable to update property photos.", 503);
  }
}

export async function DELETE(request: NextRequest, context: PhotosContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  const photoId = request.nextUrl.searchParams.get("id") || "";
  if (!validUuid(id) || !validUuid(photoId)) return apiError("Photo was not found.", 404);
  try {
    if (!(await editableListing(auth.user.id, id))) return apiError("Photos are locked while this property is under review.", 409);
    return (await deleteListingPhoto(auth.user.id, id, photoId))
      ? NextResponse.json({ ok: true })
      : apiError("Photo was not found.", 404);
  } catch {
    return apiError("Unable to delete this photo.", 503);
  }
}
