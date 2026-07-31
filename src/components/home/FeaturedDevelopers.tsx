import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const developers = [
  {
    name: "SOBHA",
    logo: "/logos/sobha-official.png",
    logoClassName: "max-h-12 max-w-[82%]",
  },
  {
    name: "Prestige Group",
    logo: "/logos/prestige-official.svg",
    logoClassName: "max-h-[4.5rem] max-w-[72%]",
  },
  {
    name: "Brigade Group",
    logo: "/logos/brigade-official.png",
    logoClassName: "max-h-[4.75rem] max-w-[58%]",
  },
  {
    name: "Godrej Properties",
    logo: "/logos/godrej-properties-official.svg",
    logoClassName: "max-h-12 max-w-[82%]",
  },
  {
    name: "Birla Estates",
    logo: "/logos/birla-estates-official.png",
    logoClassName: "max-h-12 max-w-[82%]",
  },
  {
    name: "Assetz Property Group",
    logo: "/logos/assetz-official.svg",
    logoClassName: "max-h-[4.5rem] max-w-[72%]",
  },
  {
    name: "Sumadhura Group",
    logo: "/logos/sumadhura-official.svg",
    logoClassName: "max-h-12 max-w-[86%]",
  },
  {
    name: "Lodha",
    logo: "/logos/lodha-official.svg",
    logoClassName: "max-h-11 max-w-[84%]",
  },
  {
    name: "Bhartiya Urban",
    logo: "/logos/bhartiya-official.jpg",
    logoClassName: "max-h-[4.75rem] max-w-[58%] rounded-lg",
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

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {developers.map((developer) => (
            <div
              key={developer.name}
              className="group relative flex min-h-40 items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(7,26,47,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/50 hover:shadow-[0_20px_55px_rgba(7,26,47,0.11)]"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex h-20 w-full items-center justify-center">
                <Image
                  src={developer.logo}
                  alt={`${developer.name} official logo`}
                  width={280}
                  height={110}
                  className={`h-auto w-auto object-contain opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100 ${developer.logoClassName}`}
                  sizes="(max-width: 768px) 50vw, 20vw"
                  unoptimized={developer.logo.endsWith(".svg")}
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
