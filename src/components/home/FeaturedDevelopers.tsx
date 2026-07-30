import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const developers = [
  {
    name: "SOBHA",
    logo: "/logos/sobha.png",
  },
  {
    name: "Prestige Group",
    logo: "/logos/prestige.png",
  },
  {
    name: "Brigade Group",
    logo: "/logos/brigade.png",
  },
  {
    name: "Godrej Properties",
    logo: "/logos/godrej.png",
  },
  {
    name: "Birla Estates",
    logo: "/logos/birla.png",
  },
  {
    name: "Assetz Property Group",
    logo: "/logos/assetz.png",
  },
];

const whatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20share%20premium%20projects%20from%20leading%20developers%20in%20Bengaluru.";

export default function FeaturedDevelopers() {
  return (
    <section className="content-auto-section overflow-hidden bg-white py-24 sm:py-28">
      <div className="container-shell">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
              Leading Developers
            </p>

            <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Explore projects from trusted names
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Discover residential developments from some of Bengaluru&apos;s
              leading real estate brands.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-fit items-center justify-center rounded-full border border-[#071a2f]/20 bg-white px-6 text-sm font-semibold text-[#071a2f] transition hover:bg-[#071a2f] hover:text-white"
          >
            Explore Developer Projects
            <ArrowUpRight className="ml-2 size-4" />
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {developers.map((developer) => (
            <div
              key={developer.name}
              className="group flex min-h-36 items-center justify-center rounded-[1.5rem] border border-slate-200 bg-[#f7f8fa] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/40 hover:bg-white hover:shadow-lg"
            >
              <div className="relative h-16 w-full">
                <Image
                  src={developer.logo}
                  alt={`${developer.name} logo`}
                  fill
                  className="object-contain grayscale opacity-65 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
          Developer names and logos remain the property of their respective
          owners and are shown for project identification purposes.
        </p>
      </div>
    </section>
  );
}
