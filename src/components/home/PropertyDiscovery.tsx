import {
  ArrowUpRight,
  Building2,
  IndianRupee,
  MapPin,
} from "lucide-react";

const phoneNumber = "919019697170";

const budgets = [
  {
    label: "₹50L – ₹1Cr",
    description: "Smart entry-level and compact premium homes",
  },
  {
    label: "₹1Cr – ₹2Cr",
    description: "Spacious apartments in established locations",
  },
  {
    label: "₹2Cr – ₹3Cr",
    description: "Premium residences and larger configurations",
  },
  {
    label: "₹3Cr+",
    description: "Luxury apartments, villas and exclusive homes",
  },
];

const locations = [
  {
    name: "Whitefield",
    description: "IT corridor, strong rental demand and premium communities",
  },
  {
    name: "Sarjapur Road",
    description: "Fast-growing residential and technology corridor",
  },
  {
    name: "North Bengaluru",
    description: "Airport connectivity and long-term investment potential",
  },
  {
    name: "Hebbal",
    description: "Prime access to the airport and major business hubs",
  },
  {
    name: "Electronic City",
    description: "Employment hub with established residential demand",
  },
  {
    name: "Devanahalli",
    description: "Emerging airport corridor with future growth potential",
  },
];

function createWhatsappUrl(type: "budget" | "location", value: string) {
  const message =
    type === "budget"
      ? `Hi Asher Realty, I am looking for a property in Bengaluru with a budget of ${value}. Please suggest suitable projects.`
      : `Hi Asher Realty, I am looking for a property around ${value}. Please share suitable projects, prices and availability.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export default function PropertyDiscovery() {
  return (
    <section
      id="locations"
      className="content-auto-section overflow-hidden bg-white py-24 sm:py-28"
    >
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
            Find Your Ideal Property
          </p>

          <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
            Start with what matters to you
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Browse properties based on your preferred budget or Bengaluru
            location. Select an option and speak directly with an Asher Realty
            advisor.
          </p>
        </div>

        <div className="mt-16 grid gap-8 xl:grid-cols-2">
          <div
            className="rounded-[2rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_80px_rgba(7,26,47,0.16)] sm:p-8 lg:p-10"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#c9a227]/15">
                    <IndianRupee className="size-5 text-[#e4c462]" />
                  </div>

                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e4c462]">
                    Search by Budget
                  </p>
                </div>

                <h3 className="mt-5 text-4xl font-medium">
                  Choose your investment range
                </h3>
              </div>
            </div>

            <p className="mt-4 max-w-xl leading-7 text-white/65">
              Select a comfortable budget and we will shortlist relevant
              properties based on location, configuration and investment goals.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {budgets.map((budget) => (
                <a
                  key={budget.label}
                  href={createWhatsappUrl("budget", budget.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/50 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xl font-semibold text-white">
                      {budget.label}
                    </p>

                    <ArrowUpRight className="size-5 text-[#e4c462] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {budget.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div
            className="rounded-[2rem] border border-slate-200 bg-[#f7f8fa] p-6 shadow-[0_24px_80px_rgba(7,26,47,0.08)] sm:p-8 lg:p-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-[#c9a227]/12">
                <MapPin className="size-5 text-[#c9a227]" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                Search by Location
              </p>
            </div>

            <h3 className="mt-5 text-4xl font-medium text-[#071a2f]">
              Explore Bengaluru&apos;s key property corridors
            </h3>

            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Compare established neighbourhoods and emerging investment zones
              based on connectivity, employment hubs and future growth.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {locations.map((location) => (
                <a
                  key={location.name}
                  href={createWhatsappUrl("location", location.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/50 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="size-5 shrink-0 text-[#c9a227]" />

                      <p className="font-semibold text-[#071a2f]">
                        {location.name}
                      </p>
                    </div>

                    <ArrowUpRight className="size-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c9a227]" />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {location.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-[#c9a227]/20 bg-[#f7f8fa] px-7 py-8 text-center sm:px-10 lg:flex-row lg:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
              Need a custom shortlist?
            </p>

            <h3 className="mt-3 text-3xl font-medium text-[#071a2f] sm:text-4xl">
              Share your exact requirement with us.
            </h3>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Tell us your budget, location, preferred configuration and buying
              timeline. We will help you compare suitable options.
            </p>
          </div>

          <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              "Hi Asher Realty, I would like a personalised property shortlist based on my budget and preferred location."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-8 font-semibold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            Get My Shortlist
            <ArrowUpRight className="ml-2 size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
