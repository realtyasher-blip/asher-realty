import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  EyeOff,
  ListChecks,
  ShieldCheck,
} from "lucide-react";

import OwnerSignInForm from "@/components/account/OwnerSignInForm";
import BrandLogo from "@/components/brand/BrandLogo";

export const metadata: Metadata = {
  title: "Sign in to My Asher",
  description:
    "Securely manage your Bengaluru property profile, photos, review status and contact privacy.",
  robots: { index: false, follow: false },
};

const benefits = [
  {
    icon: Camera,
    title: "Add and manage photos",
    text: "Upload recent property photos, choose a cover and keep everything with the correct home.",
  },
  {
    icon: ListChecks,
    title: "Follow the review",
    text: "Save drafts, see what needs attention and submit only when your property is ready.",
  },
  {
    icon: EyeOff,
    title: "Control your contact privacy",
    text: "Your name, email and phone stay hidden unless you deliberately choose to share them.",
  },
] as const;

export default function OwnerSignInPage() {
  return (
    <main className="min-h-screen bg-[#041421] text-white">
      <div className="premium-grid fixed inset-0 opacity-25" />
      <div className="fixed -right-48 top-0 size-[42rem] rounded-full bg-[#c9a227]/10 blur-3xl" />

      <div className="container-shell relative py-6 sm:py-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Asher Realty home">
            <BrandLogo className="h-12 w-[190px]" />
          </Link>
          <Link
            href="/post-property"
            className="inline-flex h-11 items-center rounded-full border border-white/12 px-4 text-xs font-bold text-white/65 transition hover:border-[#c9a227]/45 hover:text-white"
          >
            <ArrowLeft className="mr-2 size-4" /> Quick private form
          </Link>
        </div>

        <div className="grid min-h-[calc(100vh-7rem)] gap-10 py-12 lg:grid-cols-[1.05fr_.75fr] lg:items-center">
          <section>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f0d477]">
              <ShieldCheck className="size-4" /> My Asher property account
            </span>
            <h1 className="mt-7 max-w-3xl text-6xl font-medium leading-[.95] sm:text-7xl">
              Your properties,
              <span className="block text-[#e4c462]">one secure place.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/62 sm:text-base">
              Create your owner profile, add project and property details,
              upload photos and decide exactly how buyers may contact you.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/[.05] p-5 backdrop-blur-sm"
                >
                  <Icon className="size-5 text-[#e4c462]" />
                  <h2 className="mt-4 text-sm font-bold">{title}</h2>
                  <p className="mt-2 text-[11px] leading-5 text-white/45">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white p-6 text-[#071a2f] shadow-[0_30px_100px_rgba(0,0,0,.28)] sm:p-9">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7410]">
              Free owner account
            </p>
            <h2 className="mt-3 text-4xl font-medium">Sign in securely</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter your email and we will send a one-time secure link. New
              clients get a profile automatically after signing in.
            </p>
            <div className="mt-7">
              <OwnerSignInForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
