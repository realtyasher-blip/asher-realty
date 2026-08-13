"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Edit3,
  Eye,
  Home,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

import ProfileEditor from "@/components/account/ProfileEditor";
import PropertyEditor from "@/components/account/PropertyEditor";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type {
  AccountPayload,
  OwnerListing,
  OwnerListingInput,
  OwnerListingStatus,
  OwnerProfileInput,
} from "@/lib/owner/types";

type View = "dashboard" | "profile" | "property";

const statusMeta: Record<
  OwnerListingStatus,
  { label: string; detail: string; className: string }
> = {
  draft: {
    label: "Draft",
    detail: "Only you can see this.",
    className: "bg-slate-100 text-slate-700",
  },
  submitted: {
    label: "Submitted",
    detail: "Queued for Asher review.",
    className: "bg-blue-50 text-blue-800",
  },
  in_review: {
    label: "Under review",
    detail: "Authority, facts and media are being reviewed.",
    className: "bg-blue-50 text-blue-800",
  },
  changes_requested: {
    label: "Action needed",
    detail: "Update the highlighted details, then resubmit.",
    className: "bg-amber-50 text-amber-900",
  },
  approved: {
    label: "Approved",
    detail: "Review the public preview, then publish when ready.",
    className: "bg-emerald-50 text-emerald-800",
  },
  published: {
    label: "Live",
    detail: "Visible to buyers with your chosen contact privacy.",
    className: "bg-emerald-50 text-emerald-800",
  },
  paused: {
    label: "Paused",
    detail: "Hidden from buyers; your data is saved.",
    className: "bg-slate-100 text-slate-700",
  },
  rejected: {
    label: "Not approved",
    detail: "Contact support for clarification.",
    className: "bg-rose-50 text-rose-800",
  },
  archived: {
    label: "Archived",
    detail: "Stored in your account and hidden from buyers.",
    className: "bg-slate-100 text-slate-500",
  },
};

export default function OwnerWorkspace() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [payload, setPayload] = useState<AccountPayload | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [editing, setEditing] = useState<OwnerListing | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "signed-out" | "error">("loading");
  const [message, setMessage] = useState("");

  const accountRequest = useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      const token = session?.access_token;
      if (!token) throw new Error("Your secure session has expired. Sign in again.");
      const response = await fetch(path, {
        ...init,
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          ...init.headers,
        },
      });
      const raw = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      if (!response.ok) {
        if (response.status === 401) {
          setState("signed-out");
          throw new Error("Your secure session has expired. Sign in again.");
        }
        throw new Error(
          typeof raw.error === "string"
            ? raw.error
            : "The account update could not be completed."
        );
      }
      return ((raw.data as T | undefined) || raw) as T;
    },
    [session?.access_token]
  );

  const loadAccount = useCallback(
    async (activeSession: Session) => {
      setState("loading");
      try {
        const response = await fetch("/api/account", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${activeSession.access_token}` },
        });
        const raw = (await response.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        if (response.status === 401) {
          setState("signed-out");
          return;
        }
        if (!response.ok) {
          throw new Error(
            typeof raw.error === "string" ? raw.error : "Unable to load My Asher."
          );
        }
        const data = ((raw.data as AccountPayload | undefined) || raw) as AccountPayload;
        setPayload(data);
        setState("ready");
        if (!data.profile || data.profile.display_name === "Property owner") {
          setView("profile");
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load My Asher.");
        setState("error");
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    let supabase: ReturnType<typeof createBrowserClient>;
    try {
      supabase = createBrowserClient();
    } catch {
      window.setTimeout(() => {
        setMessage("Secure owner accounts are being configured. The free private property form is still available.");
        setState("error");
      }, 0);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) void loadAccount(data.session);
      else setState("signed-out");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      setSession(next);
      if (next) void loadAccount(next);
      else {
        setPayload(null);
        setState("signed-out");
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadAccount]);

  async function saveProfile(input: OwnerProfileInput) {
    const data = await accountRequest<{ profile: AccountPayload["profile"] }>(
      "/api/account/profile",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    setPayload((current) =>
      current ? { ...current, profile: data.profile } : current
    );
  }

  async function saveListing(input: OwnerListingInput, id?: string) {
    const data = await accountRequest<{ listing: OwnerListing }>(
      id
        ? `/api/account/listings/${encodeURIComponent(id)}`
        : "/api/account/listings",
      {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    setPayload((current) => {
      if (!current) return current;
      const exists = current.listings.some((item) => item.id === data.listing.id);
      return {
        ...current,
        listings: exists
          ? current.listings.map((item) =>
              item.id === data.listing.id ? data.listing : item
            )
          : [data.listing, ...current.listings],
      };
    });
    setEditing(data.listing);
    return data.listing;
  }

  async function submitListing(id: string) {
    const data = await accountRequest<{ listing: OwnerListing }>(
      `/api/account/listings/${encodeURIComponent(id)}/submit`,
      { method: "POST" }
    );
    setPayload((current) =>
      current
        ? {
            ...current,
            listings: current.listings.map((item) =>
              item.id === data.listing.id ? data.listing : item
            ),
          }
        : current
    );
    return data.listing;
  }

  async function changePublication(
    id: string,
    action: "publish" | "pause"
  ) {
    const data = await accountRequest<{ listing: OwnerListing }>(
      `/api/account/listings/${encodeURIComponent(id)}/publication`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }
    );
    setPayload((current) =>
      current
        ? {
            ...current,
            listings: current.listings.map((item) =>
              item.id === data.listing.id ? data.listing : item
            ),
          }
        : current
    );
    setEditing((current) =>
      current?.id === data.listing.id ? data.listing : current
    );
    setMessage(
      action === "publish"
        ? "Your property is now live with your selected contact privacy."
        : "Your property is paused and hidden from public view."
    );
    return data.listing;
  }

  async function signOut() {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  const listings = useMemo(() => payload?.listings || [], [payload?.listings]);
  const actionNeeded = useMemo(
    () =>
      listings.filter((item) =>
        ["draft", "changes_requested", "approved"].includes(item.status)
      ),
    [listings]
  );

  if (state === "loading") {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-8 animate-spin text-[#9a7410]" />
          <p className="mt-4 text-sm font-bold text-[#071a2f]">Opening My Asher...</p>
          <p className="mt-2 text-xs text-slate-500">Loading your private property workspace.</p>
        </div>
      </div>
    );
  }

  if (state === "signed-out") {
    return (
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(7,26,47,.08)] sm:p-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#071a2f] text-[#e4c462]">
          <LockKeyhole className="size-7" />
        </span>
        <h1 className="mt-6 text-5xl font-medium text-[#071a2f]">Sign in to My Asher</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Use a secure email link to create your profile, add photos and manage
          the review status of your properties.
        </p>
        <Link
          href="/account/sign-in"
          className="mt-7 inline-flex h-13 items-center rounded-full bg-[#c9a227] px-7 text-sm font-extrabold text-[#071a2f]"
        >
          Continue securely <ArrowRight className="ml-2 size-4" />
        </Link>
      </section>
    );
  }

  if (state === "error" || !payload || !session) {
    return (
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-amber-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <AlertCircle className="mx-auto size-10 text-amber-700" />
        <h1 className="mt-5 text-4xl font-medium text-[#071a2f]">My Asher needs attention</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{message}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => session && loadAccount(session)}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#071a2f] px-6 text-xs font-bold text-white"
          >
            <RefreshCw className="mr-2 size-4 text-[#e4c462]" /> Try again
          </button>
          <Link
            href="/post-property"
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-6 text-xs font-bold text-[#071a2f]"
          >
            Use quick private form
          </Link>
        </div>
      </section>
    );
  }

  if (view === "profile") {
    return (
      <div>
        <WorkspaceHeader
          email={session.user.email || ""}
          title={payload.profile ? "Edit your profile" : "Create your owner profile"}
          subtitle="Your privacy settings are applied to every property you manage."
          onBack={payload.profile ? () => setView("dashboard") : undefined}
          onSignOut={signOut}
        />
        <div className="mt-7">
          <ProfileEditor
            email={session.user.email || ""}
            profile={payload.profile}
            onSave={async (input) => {
              const incomplete =
                !payload.profile ||
                payload.profile.display_name === "Property owner";
              await saveProfile(input);
              if (incomplete) {
                setView("dashboard");
              }
            }}
            onCancel={payload.profile ? () => setView("dashboard") : undefined}
          />
        </div>
      </div>
    );
  }

  if (view === "property") {
    return (
      <div>
        <WorkspaceHeader
          email={session.user.email || ""}
          title={editing ? "Edit your property" : "Add a property"}
          subtitle="Save a private draft, add photos and submit when you are ready."
          onBack={() => {
            setView("dashboard");
            setEditing(null);
          }}
          onSignOut={signOut}
        />
        <div className="mt-7">
          <PropertyEditor
            accessToken={session.access_token}
            listing={editing}
            onSave={saveListing}
            onSubmit={submitListing}
            onPublicationAction={changePublication}
            onCancel={() => {
              setView("dashboard");
              setEditing(null);
            }}
            onDone={(updated) => {
              setPayload((current) =>
                current
                  ? {
                      ...current,
                      listings: current.listings.some((item) => item.id === updated.id)
                        ? current.listings.map((item) =>
                            item.id === updated.id ? updated : item
                          )
                        : [updated, ...current.listings],
                    }
                  : current
              );
              setMessage(
                updated.status === "submitted"
                  ? "Property submitted. Asher will review the details and photos before anything can go live."
                  : "Draft saved securely."
              );
              setView("dashboard");
              setEditing(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <WorkspaceHeader
        email={session.user.email || ""}
        title={`Welcome${payload.profile?.display_name ? `, ${payload.profile.display_name.split(" ")[0]}` : ""}`}
        subtitle="Manage your properties, photos, review status and contact privacy."
        onSignOut={signOut}
      />

      {message && (
        <p
          aria-live="polite"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-6 text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {message}
        </p>
      )}

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[1.75rem] bg-[#071a2f] p-6 text-white sm:p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#e4c462]">
            Next best action
          </p>
          {actionNeeded.length ? (
            <>
              <h2 className="mt-3 text-4xl font-medium">
                {actionNeeded[0].status === "changes_requested"
                  ? "A property needs an update."
                  : actionNeeded[0].status === "approved"
                    ? "Your property is approved."
                    : "Complete your property draft."}
              </h2>
              <p className="mt-3 text-xs leading-6 text-white/55">
                {actionNeeded[0].project_name || `${actionNeeded[0].property_type} in ${actionNeeded[0].locality}`}
                {actionNeeded[0].review_note
                  ? ` - ${actionNeeded[0].review_note}`
                  : " - Add or review the details and photos before the next step."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditing(actionNeeded[0]);
                  setView("property");
                }}
                className="mt-6 inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-extrabold text-[#071a2f]"
              >
                Open property <ArrowRight className="ml-2 size-4" />
              </button>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-4xl font-medium">Add your first property.</h2>
              <p className="mt-3 text-xs leading-6 text-white/55">
                Create a private draft, add project details and photos, then send
                it for review when it is ready.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setView("property");
                }}
                className="mt-6 inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-extrabold text-[#071a2f]"
              >
                <Plus className="mr-2 size-4" /> Add a property
              </button>
            </>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f5e8ca] text-[#8a670b]">
              {payload.profile?.contact_mode === "asher_managed" ? (
                <ShieldCheck className="size-5" />
              ) : (
                <UserRound className="size-5" />
              )}
            </span>
            <button
              type="button"
              onClick={() => setView("profile")}
              className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 text-[10px] font-bold text-[#071a2f]"
            >
              <Edit3 className="mr-2 size-3" /> Edit profile
            </button>
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-[#071a2f]">Contact privacy</h2>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            {payload.profile?.contact_mode === "asher_managed"
              ? "Asher manages buyer enquiries. Your direct details are hidden."
              : payload.profile?.contact_mode === "name_email"
                ? "Your public name and verified email may appear on approved live properties."
                : payload.profile?.contact_mode === "name_phone"
                  ? "Your public name and phone may appear on approved live properties."
                  : "Your public name may appear; direct contact stays hidden."}
          </p>
          <span className="mt-5 inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-800">
            <LockKeyhole className="mr-2 size-3" /> Nothing publishes automatically
          </span>
        </section>
      </div>

      <section className="mt-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9a7410]">
              Your properties
            </p>
            <h2 className="mt-2 text-4xl font-medium text-[#071a2f]">Manage each home.</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setView("property");
            }}
            className="inline-flex h-12 w-fit items-center rounded-full bg-[#071a2f] px-6 text-xs font-extrabold text-white"
          >
            <Plus className="mr-2 size-4 text-[#e4c462]" /> Add property
          </button>
        </div>

        {listings.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onEdit={() => {
                  setEditing(listing);
                  setView("property");
                }}
                onPublicationAction={changePublication}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-white p-9 text-center sm:p-12">
            <Home className="mx-auto size-8 text-[#9a7410]" />
            <h3 className="mt-4 text-2xl font-semibold text-[#071a2f]">No properties yet</h3>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-500">
              Your first property starts as a private draft. You decide when it
              is ready for Asher review.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function WorkspaceHeader({
  email,
  title,
  subtitle,
  onBack,
  onSignOut,
}: {
  email: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
  onSignOut: () => void;
}) {
  return (
    <header className="flex flex-col justify-between gap-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center text-[10px] font-bold uppercase tracking-[.14em] text-[#9a7410]"
          >
            Back to My Asher
          </button>
        )}
        <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9a7410]">My Asher</p>
        <h1 className="mt-2 text-4xl font-medium text-[#071a2f] sm:text-5xl">{title}</h1>
        <p className="mt-3 text-xs leading-6 text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Signed in as</p>
          <p className="mt-1 max-w-56 truncate text-xs font-semibold text-[#071a2f]">{email}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Sign out of My Asher"
          className="flex size-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}

function PropertyCard({
  listing,
  onEdit,
  onPublicationAction,
}: {
  listing: OwnerListing;
  onEdit: () => void;
  onPublicationAction: (
    id: string,
    action: "publish" | "pause"
  ) => Promise<OwnerListing>;
}) {
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const meta = statusMeta[listing.status];
  const cover = listing.photos?.find((photo) => photo.is_cover) || listing.photos?.[0];
  const updated = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(listing.updated_at));

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(7,26,47,.04)]">
      <div className="relative aspect-[16/10] bg-[#071a2f]">
        {cover?.preview_url ? (
          // Signed storage URLs are intentionally rendered without image optimisation.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.preview_url}
            alt={cover.alt_text || "Property cover"}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-white/35">
            <Camera className="size-8 text-[#e4c462]" />
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[9px] font-extrabold ${meta.className}`}>
          {meta.label}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-[#071a2f]/90 px-3 py-1.5 text-[9px] font-bold text-white">
          {listing.photos?.length || 0} photos
        </span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#9a7410]">
          {listing.intent} | {listing.locality}
        </p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-semibold text-[#071a2f]">
          {listing.project_name || `${listing.configuration} ${listing.property_type}`}
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          {listing.configuration} | {listing.area_value} sq ft {listing.area_basis.toLowerCase()}
        </p>
        <div className="mt-5 rounded-xl bg-[#f8f9fa] p-4">
          <p className="text-[10px] font-bold text-[#071a2f]">{meta.label}</p>
          <p className="mt-1 text-[10px] leading-5 text-slate-500">{meta.detail}</p>
          {listing.review_note && (
            <p className="mt-2 border-t border-slate-200 pt-2 text-[10px] leading-5 text-amber-800">
              {listing.review_note}
            </p>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[9px] text-slate-400">Updated {updated}</p>
          {listing.status === "approved" || listing.status === "paused" ? (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setActionError("");
                try {
                  await onPublicationAction(listing.id, "publish");
                } catch (error) {
                  setActionError(
                    error instanceof Error
                      ? error.message
                      : "This property could not be published."
                  );
                } finally {
                  setBusy(false);
                }
              }}
              className="inline-flex h-10 items-center rounded-full bg-[#c9a227] px-4 text-[10px] font-bold text-[#071a2f] disabled:opacity-60"
            >
              {busy ? (
                <LoaderCircle className="mr-2 size-3 animate-spin" />
              ) : (
                <Eye className="mr-2 size-3" />
              )}
              {listing.status === "paused" ? "Resume listing" : "Publish property"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-10 items-center rounded-full bg-[#071a2f] px-4 text-[10px] font-bold text-white"
            >
              {listing.status === "published" ? <Eye className="mr-2 size-3" /> : <Edit3 className="mr-2 size-3" />}
              {listing.status === "published" ? "View & manage" : "Open property"}
            </button>
          )}
        </div>
        {actionError ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-5 text-amber-900" aria-live="polite">
            {actionError} Open the property to review its approval checklist.
          </p>
        ) : null}
      </div>
    </article>
  );
}
