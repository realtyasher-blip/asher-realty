import { ArrowRight, KeyRound, ListChecks, MessageSquareText, Route } from "lucide-react";

const steps = [
  { number: "01", icon: MessageSquareText, title: "Tell us your brief", text: "Share your location, budget, home type and buying timeline." },
  { number: "02", icon: ListChecks, title: "Receive a clear shortlist", text: "Get matched options with the differences that actually matter." },
  { number: "03", icon: Route, title: "Tour without the chaos", text: "We coordinate an efficient route across your selected projects." },
  { number: "04", icon: KeyRound, title: "Decide with confidence", text: "Review current pricing, availability and the booking process." },
];

export default function HowItWorks() {
  return (
    <section id="services" className="content-auto-section overflow-hidden bg-[#fbfaf7] py-24 sm:py-28">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#b08a16]">A calmer way to buy</p>
          <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">From too many options to one confident decision.</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, text }) => (
            <article
              key={number}
              className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/45 hover:shadow-[0_24px_70px_rgba(7,26,47,.09)]"
            >
              <span className="absolute right-5 top-3 font-[var(--font-heading)] text-7xl text-[#071a2f]/[0.045]">{number}</span>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#071a2f]">
                <Icon className="size-5 text-[#e4c462]" />
              </span>
              <h3 className="mt-8 text-2xl font-medium text-[#071a2f]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-550">{text}</p>
            </article>
          ))}
        </div>
        <a href="#contact" className="mt-9 inline-flex items-center text-sm font-bold text-[#071a2f] transition hover:text-[#b08a16]">
          Start with a free consultation <ArrowRight className="ml-2 size-4" />
        </a>
      </div>
    </section>
  );
}
