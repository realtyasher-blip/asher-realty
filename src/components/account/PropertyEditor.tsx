"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  ImagePlus,
  IndianRupee,
  LockKeyhole,
  LoaderCircle,
  MapPin,
  PauseCircle,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";

import PhotoUploader from "@/components/account/PhotoUploader";
import { projects } from "@/data/projects";
import {
  emptyOwnerListing,
  type ListingPhoto,
  type OwnerListing,
  type OwnerListingInput,
} from "@/lib/owner/types";

type Props = {
  accessToken: string;
  listing?: OwnerListing | null;
  onSave: (input: OwnerListingInput, id?: string) => Promise<OwnerListing>;
  onSubmit: (id: string) => Promise<OwnerListing>;
  onPublicationAction: (
    id: string,
    action: "publish" | "pause"
  ) => Promise<OwnerListing>;
  onDone: (listing: OwnerListing) => void;
  onCancel: () => void;
};

const steps = [
  { label: "Property", icon: Building2 },
  { label: "Price & details", icon: IndianRupee },
  { label: "Photos", icon: ImagePlus },
  { label: "Review", icon: FileCheck2 },
] as const;

const configurations = [
  "Studio",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5+ BHK",
  "Plot / open space",
  "Commercial unit",
];

function listingInput(listing?: OwnerListing | null): OwnerListingInput {
  if (!listing) return { ...emptyOwnerListing };
  return {
    intent: listing.intent,
    property_type: listing.property_type,
    project_name: listing.project_name,
    locality: listing.locality,
    pincode: listing.pincode,
    configuration: listing.configuration,
    bathrooms: listing.bathrooms,
    area_value: listing.area_value,
    area_basis: listing.area_basis,
    furnishing: listing.furnishing,
    floor: listing.floor,
    total_floors: listing.total_floors,
    parking: listing.parking,
    property_age: listing.property_age,
    expected_price: listing.expected_price,
    monthly_rent: listing.monthly_rent,
    maintenance: listing.maintenance,
    deposit: listing.deposit,
    available_from: listing.available_from,
    occupancy: listing.occupancy,
    description: listing.description,
  };
}

export default function PropertyEditor({
  accessToken,
  listing,
  onSave,
  onSubmit,
  onPublicationAction,
  onDone,
  onCancel,
}: Props) {
  const [form, setForm] = useState<OwnerListingInput>(() => listingInput(listing));
  const [savedListing, setSavedListing] = useState<OwnerListing | null>(listing || null);
  const [photos, setPhotos] = useState<ListingPhoto[]>(listing?.photos || []);
  const currentStatus = savedListing?.status || listing?.status;
  const isEditable =
    !currentStatus || ["draft", "changes_requested"].includes(currentStatus);
  const [step, setStep] = useState(isEditable ? 0 : 3);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [noNamedProject, setNoNamedProject] = useState(
    listing?.project_name === "Independent property"
  );

  const projectNames = useMemo(
    () => Array.from(new Set(projects.map((project) => project.name))).sort(),
    []
  );
  const cover = photos.find((photo) => photo.is_cover) || photos[0];

  function update<K extends keyof OwnerListingInput>(
    key: K,
    value: OwnerListingInput[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function projectChanged(value: string) {
    const match = projects.find((project) => project.name === value);
    setForm((current) => ({
      ...current,
      project_name: value,
      locality: match && !current.locality ? match.location : current.locality,
    }));
    setMessage("");
  }

  function validate(targetStep: number) {
    if (
      targetStep >= 1 &&
      (!form.property_type ||
        !form.configuration ||
        !form.locality.trim() ||
        (!noNamedProject && !form.project_name.trim()) ||
        !/^\d+(?:\.\d{1,2})?$/u.test(form.area_value) ||
        Number(form.area_value) < 20)
    ) {
      return "Add the project or building, locality, configuration and area before continuing.";
    }
    if (form.pincode && !/^[1-9]\d{5}$/u.test(form.pincode)) {
      return "Enter a valid six-digit pincode or leave it blank.";
    }
    if (
      targetStep >= 2 &&
      !(form.intent === "Sell" ? form.expected_price : form.monthly_rent).trim()
    ) {
      return form.intent === "Sell"
        ? "Add your expected total price before continuing."
        : "Add your expected monthly rent before continuing.";
    }
    if (targetStep >= 3 && form.description.trim().length < 30) {
      return "Add at least 30 characters describing the home before submitting it for review.";
    }
    if (
      form.floor &&
      form.total_floors &&
      Number(form.floor) > Number(form.total_floors)
    ) {
      return "The property floor cannot be higher than the total number of floors.";
    }
    return "";
  }

  async function saveDraft() {
    setSaving(true);
    setMessage("");
    try {
      const saved = await onSave(
        {
          ...form,
          project_name: noNamedProject ? "Independent property" : form.project_name.trim(),
          locality: form.locality.trim(),
          description: form.description.trim(),
        },
        savedListing?.id
      );
      const merged = { ...saved, photos };
      setSavedListing(merged);
      return merged;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The draft could not be saved.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function ensureDraft() {
    if (savedListing) return savedListing;
    return saveDraft();
  }

  async function next() {
    const error = validate(step + 1);
    if (error) {
      setMessage(error);
      return;
    }
    if (step === 0) {
      const saved = await ensureDraft();
      if (!saved) return;
    }
    if (step === 1) {
      const saved = await saveDraft();
      if (!saved) return;
    }
    setStep((current) => Math.min(3, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAndExit() {
    const error = validate(Math.min(step, 1));
    if (error && step > 0) {
      setMessage(error);
      return;
    }
    const saved = await saveDraft();
    if (saved) onDone(saved);
  }

  async function submitForReview() {
    if (!savedListing) return;
    const error = validate(3);
    if (error) {
      setMessage(error);
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const updated = await onSubmit(savedListing.id);
      onDone({ ...updated, photos });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The property could not be submitted for review."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function updatePublication(action: "publish" | "pause") {
    if (!savedListing) return;
    setPublishing(true);
    setMessage("");
    try {
      const updated = await onPublicationAction(savedListing.id, action);
      setSavedListing(updated);
      setPhotos(updated.photos || photos);
      setMessage(
        action === "publish"
          ? "Your property is live. You can pause it at any time."
          : "Your property is paused and hidden from buyers."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : action === "publish"
            ? "This property could not be published."
            : "This property could not be paused."
      );
    } finally {
      setPublishing(false);
    }
  }

  const inputClass =
    "mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(7,26,47,.07)]">
      <div className="border-b border-slate-100 bg-[#f7f8fa] px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-2">
          {steps.map(({ label, icon: Icon }, index) => (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                  index <= step
                    ? "bg-[#071a2f] text-[#e4c462]"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Icon className="size-4" />
              </span>
              <span
                className={`hidden text-[10px] font-bold uppercase tracking-[.12em] md:block ${
                  index === step ? "text-[#071a2f]" : "text-slate-400"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <span className="ml-auto hidden h-px flex-1 bg-slate-200 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-9">
        {step === 0 && (
          <section>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9a7410]">
              Property essentials
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              Which home are you adding?
            </h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Do not enter an exact flat number or upload ownership documents.
              Those checks happen later through a private, agreed process.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-bold text-[#071a2f]">I want to*</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(["Sell", "Rent out"] as const).map((intent) => (
                    <label
                      key={intent}
                      className={`cursor-pointer rounded-2xl border p-4 text-center text-sm font-bold transition ${
                        form.intent === intent
                          ? "border-[#c9a227] bg-[#fff9e8] text-[#071a2f]"
                          : "border-slate-200 bg-[#f8f9fa] text-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="intent"
                        value={intent}
                        checked={form.intent === intent}
                        onChange={() => update("intent", intent)}
                        className="sr-only"
                      />
                      {intent === "Sell" ? "Sell my property" : "Rent out my property"}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Property type*</span>
                <select
                  value={form.property_type}
                  onChange={(event) => update("property_type", event.target.value)}
                  className={inputClass}
                >
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Independent house</option>
                  <option>Residential plot</option>
                  <option>Commercial property</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Configuration*</span>
                <select
                  value={form.configuration}
                  onChange={(event) => update("configuration", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {configurations.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-[#071a2f]">
                  Project / community / building name*
                </span>
                <input
                  list="owner-project-options"
                  disabled={noNamedProject}
                  value={noNamedProject ? "Independent property" : form.project_name}
                  onChange={(event) => projectChanged(event.target.value)}
                  placeholder="Start typing a project or building name"
                  className={`${inputClass} disabled:bg-slate-100 disabled:text-slate-400`}
                />
                <datalist id="owner-project-options">
                  {projectNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                <span className="mt-2 block text-[10px] leading-5 text-slate-400">
                  Not in our suggestions? Type the name manually and we will review it.
                </span>
              </label>

              <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-[#f8f9fa] p-4">
                <input
                  type="checkbox"
                  checked={noNamedProject}
                  onChange={(event) => {
                    setNoNamedProject(event.target.checked);
                    if (event.target.checked) update("project_name", "Independent property");
                  }}
                  className="mt-0.5 size-4 accent-[#c9a227]"
                />
                <span className="text-[11px] leading-5 text-slate-600">
                  This property is not part of a named project or building.
                </span>
              </label>

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Locality*</span>
                <span className="relative block">
                  <MapPin className="absolute left-4 top-[1.35rem] size-4 text-[#9a7410]" />
                  <input
                    value={form.locality}
                    onChange={(event) => update("locality", event.target.value)}
                    placeholder="e.g. Whitefield"
                    className={`${inputClass} pl-11`}
                  />
                </span>
              </label>

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Pincode</span>
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(event) =>
                    update("pincode", event.target.value.replace(/\D/gu, ""))
                  }
                  placeholder="560066"
                  className={inputClass}
                />
              </label>

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Area*</span>
                <input
                  inputMode="decimal"
                  value={form.area_value}
                  onChange={(event) =>
                    update("area_value", event.target.value.replace(/[^0-9.]/gu, ""))
                  }
                  placeholder="1250"
                  className={inputClass}
                />
              </label>

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Area basis*</span>
                <select
                  value={form.area_basis}
                  onChange={(event) => update("area_basis", event.target.value)}
                  className={inputClass}
                >
                  <option>Carpet area</option>
                  <option>Built-up area</option>
                  <option>Super built-up area</option>
                  <option>Plot area</option>
                </select>
              </label>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9a7410]">
              Price and property facts
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              Help buyers understand the home.
            </h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Your expectation is reviewed before it is presented publicly. It
              is not shown as a confirmed valuation.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {form.intent === "Sell" ? (
                <label className="sm:col-span-2">
                  <span className="text-sm font-bold text-[#071a2f]">Expected total price*</span>
                  <input
                    value={form.expected_price}
                    onChange={(event) => update("expected_price", event.target.value)}
                    placeholder="e.g. INR 1.65 crore"
                    className={inputClass}
                  />
                </label>
              ) : (
                <>
                  <label>
                    <span className="text-sm font-bold text-[#071a2f]">Expected monthly rent*</span>
                    <input
                      value={form.monthly_rent}
                      onChange={(event) => update("monthly_rent", event.target.value)}
                      placeholder="e.g. INR 45,000"
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <span className="text-sm font-bold text-[#071a2f]">Security deposit</span>
                    <input
                      value={form.deposit}
                      onChange={(event) => update("deposit", event.target.value)}
                      placeholder="e.g. INR 2,00,000"
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <span className="text-sm font-bold text-[#071a2f]">Monthly maintenance</span>
                    <input
                      value={form.maintenance}
                      onChange={(event) => update("maintenance", event.target.value)}
                      placeholder="e.g. INR 6,000"
                      className={inputClass}
                    />
                  </label>
                </>
              )}

              <label>
                <span className="text-sm font-bold text-[#071a2f]">Bathrooms</span>
                <select
                  value={form.bathrooms}
                  onChange={(event) => update("bathrooms", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>1</option><option>2</option><option>3</option><option>4+</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Furnishing</span>
                <select
                  value={form.furnishing}
                  onChange={(event) => update("furnishing", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Unfurnished</option><option>Semi-furnished</option><option>Fully furnished</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Floor</span>
                <input
                  inputMode="numeric"
                  value={form.floor}
                  onChange={(event) => update("floor", event.target.value.replace(/\D/gu, ""))}
                  placeholder="8"
                  className={inputClass}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Total floors</span>
                <input
                  inputMode="numeric"
                  value={form.total_floors}
                  onChange={(event) => update("total_floors", event.target.value.replace(/\D/gu, ""))}
                  placeholder="18"
                  className={inputClass}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Parking</span>
                <select
                  value={form.parking}
                  onChange={(event) => update("parking", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>No dedicated parking</option><option>1 car</option><option>2 cars</option><option>3+ cars</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Property age</span>
                <select
                  value={form.property_age}
                  onChange={(event) => update("property_age", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Under construction</option><option>Less than 1 year</option><option>1-5 years</option><option>5-10 years</option><option>More than 10 years</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Available from</span>
                <input
                  type="date"
                  value={form.available_from}
                  onChange={(event) => update("available_from", event.target.value)}
                  className={inputClass}
                />
              </label>
              <label>
                <span className="text-sm font-bold text-[#071a2f]">Current occupancy</span>
                <select
                  value={form.occupancy}
                  onChange={(event) => update("occupancy", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Vacant</option><option>Owner occupied</option><option>Tenant occupied</option><option>Under construction</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-[#071a2f]">What makes the home useful?</span>
                <textarea
                  rows={5}
                  maxLength={1200}
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="Sunlight, views, upgrades, move-in timing, pet policy, amenities or other relevant facts..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] p-4 text-sm leading-6 text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white"
                />
                <span className="mt-1 block text-right text-[10px] text-slate-400">{form.description.length}/1200</span>
              </label>
            </div>
          </section>
        )}

        {step === 2 && savedListing && (
          <PhotoUploader
            listingId={savedListing.id}
            accessToken={accessToken}
            photos={photos}
            onChange={(nextPhotos) => {
              setPhotos(nextPhotos);
              setSavedListing((current) =>
                current ? { ...current, photos: nextPhotos } : current
              );
            }}
          />
        )}

        {step === 3 && savedListing && (
          <section>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9a7410]">
              Private preview
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              Review before sending to Asher.
            </h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              {currentStatus === "approved"
                ? "Staff review is complete. Confirm the approved media below, then choose when to publish."
                : currentStatus === "published"
                  ? "This is your live public listing preview. Your profile privacy settings continue to apply."
                  : currentStatus === "paused"
                    ? "This property is hidden from buyers, but its approved review is preserved for safe resumption."
                    : "Submission starts a manual review. It does not publish this property."}
            </p>

            <article className="mt-7 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#f8f9fa] lg:grid lg:grid-cols-[.85fr_1.15fr]">
              <div className="relative min-h-64 bg-[#071a2f]">
                {cover?.preview_url ? (
                  // Signed storage URLs are intentionally rendered without image optimisation.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.preview_url}
                    alt={cover.alt_text || "Property cover"}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <div className="flex min-h-64 size-full items-center justify-center text-center text-white/45">
                    <span>
                      <ImagePlus className="mx-auto size-9 text-[#e4c462]" />
                      <span className="mt-3 block text-xs">Photos can be added before publication</span>
                    </span>
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-[#071a2f]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-white">
                  {currentStatus === "published"
                    ? "Live property"
                    : currentStatus === "approved"
                      ? "Approved preview | not live"
                      : currentStatus === "paused"
                        ? "Paused | hidden from buyers"
                        : "Private preview | not live"}
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-bold text-[#9a7410]">
                  <MapPin className="size-4" /> {form.locality}
                </p>
                <h3 className="mt-3 text-4xl font-medium text-[#071a2f]">
                  {noNamedProject ? "Independent property" : form.project_name}
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  {form.configuration} {form.property_type} | {form.area_value} sq ft {form.area_basis.toLowerCase()}
                </p>
                <p className="mt-5 text-2xl font-extrabold text-[#071a2f]">
                  {form.intent === "Sell" ? form.expected_price : `${form.monthly_rent} / month`}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <span className="rounded-xl bg-white p-4 text-[11px] text-slate-500">
                    <strong className="block text-[#071a2f]">{photos.length} photos</strong>
                    reviewed separately
                  </span>
                  <span className="rounded-xl bg-white p-4 text-[11px] text-slate-500">
                    <strong className="block text-[#071a2f]">Contact protected</strong>
                    profile privacy applies
                  </span>
                </div>
              </div>
            </article>

            {photos.length < 3 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-6 text-amber-900">
                You can submit now, but a useful public listing normally needs at
                least three approved property photos and a cover photo.
              </div>
            )}

            {(currentStatus === "approved" || currentStatus === "paused") && (
              <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-emerald-800">
                  <Globe2 className="size-4" /> Publication readiness
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <ReadinessItem ready label="Staff listing review approved" />
                  <ReadinessItem
                    ready={photos.filter((photo) => photo.status === "approved").length >= 3}
                    label={`${photos.filter((photo) => photo.status === "approved").length} of 3 photos approved`}
                  />
                  <ReadinessItem
                    ready={photos.some(
                      (photo) => photo.is_cover && photo.status === "approved"
                    )}
                    label="Approved cover photo"
                  />
                </div>
                <p className="mt-4 text-[10px] leading-5 text-emerald-900/70">
                  The server rechecks every approval when you publish. If media is still being reviewed, Asher will finish that step before this can go live.
                </p>
              </div>
            )}

            <div className="mt-5 rounded-[1.5rem] bg-[#071a2f] p-6 text-white">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#e4c462]">
                <ShieldCheck className="size-4" /> What happens next
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  "Asher reviews authority and facts",
                  "Photos are checked separately",
                  "You approve before anything goes live",
                ].map((item, index) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[.05] p-4 text-[11px] leading-5 text-white/58">
                    <span className="font-extrabold text-[#e4c462]">0{index + 1}</span>
                    <p className="mt-2">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {message && (
          <p
            aria-live="polite"
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900"
          >
            {message}
          </p>
        )}

        <div className="sticky bottom-20 z-10 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white/95 pt-6 backdrop-blur-xl lg:bottom-0">
          {!isEditable ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-12 items-center rounded-full border border-slate-200 px-5 text-xs font-bold text-[#071a2f]"
              >
                <ArrowLeft className="mr-2 size-4" /> Back to My Asher
              </button>
              {currentStatus === "approved" || currentStatus === "paused" ? (
                <button
                  type="button"
                  onClick={() => updatePublication("publish")}
                  disabled={publishing}
                  className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-extrabold text-[#071a2f] disabled:opacity-60"
                >
                  {publishing ? (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Globe2 className="mr-2 size-4" />
                  )}
                  {currentStatus === "paused" ? "Resume listing" : "Publish property"}
                </button>
              ) : currentStatus === "published" && savedListing ? (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/listings/${savedListing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white"
                  >
                    <Globe2 className="mr-2 size-4 text-[#e4c462]" /> View live page
                  </a>
                  <button
                    type="button"
                    onClick={() => updatePublication("pause")}
                    disabled={publishing}
                    className="inline-flex h-12 items-center rounded-full border border-amber-200 bg-amber-50 px-5 text-xs font-bold text-amber-900 disabled:opacity-60"
                  >
                    {publishing ? (
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                    ) : (
                      <PauseCircle className="mr-2 size-4" />
                    )}
                    Pause property
                  </button>
                </div>
              ) : (
                <span className="inline-flex h-12 items-center rounded-full bg-slate-100 px-5 text-[10px] font-bold text-slate-600">
                  <LockKeyhole className="mr-2 size-4" /> Locked during review
                </span>
              )}
            </>
          ) : (
            <>
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setStep((current) => current - 1);
                  setMessage("");
                }}
                className="inline-flex h-12 items-center rounded-full border border-slate-200 px-5 text-xs font-bold text-[#071a2f]"
              >
                <ArrowLeft className="mr-2 size-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-12 items-center rounded-full border border-slate-200 px-5 text-xs font-bold text-[#071a2f]"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={saveAndExit}
              disabled={saving}
              className="hidden h-12 items-center rounded-full border border-slate-200 px-5 text-xs font-bold text-slate-600 sm:inline-flex"
            >
              <Save className="mr-2 size-4" /> Save & exit
            </button>
          </div>

          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              disabled={saving}
              className="inline-flex h-12 items-center rounded-full bg-[#071a2f] px-6 text-xs font-extrabold text-white disabled:opacity-60"
            >
              {saving ? (
                <><LoaderCircle className="mr-2 size-4 animate-spin text-[#e4c462]" /> Saving draft...</>
              ) : (
                <>Continue <ArrowRight className="ml-2 size-4 text-[#e4c462]" /></>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={submitForReview}
              disabled={submitting}
              className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-extrabold text-[#071a2f] disabled:opacity-60"
            >
              {submitting ? (
                <><LoaderCircle className="mr-2 size-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="mr-2 size-4" /> Submit for review</>
              )}
            </button>
          )}
            </>
          )}
        </div>

        {savedListing && (
          <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <CheckCircle2 className="size-3 text-emerald-600" />
            {currentStatus === "published"
              ? "Live now | You remain in control of pausing it"
              : currentStatus === "approved"
                ? "Approved | Only you choose when it goes live"
                : currentStatus === "paused"
                  ? "Paused | Hidden from public view"
                  : "Draft saved securely | Nothing is published automatically"}
          </p>
        )}
      </div>
    </div>
  );
}

function ReadinessItem({ ready, label }: { ready: boolean; label: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-white p-4 text-[10px] font-semibold leading-5 text-[#071a2f]">
      {ready ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
      ) : (
        <LoaderCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
      )}
      {label}
    </div>
  );
}
