import { MessageCircle, Phone } from "lucide-react";

const whatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20am%20looking%20for%20a%20property%20in%20Bengaluru.";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 left-6 z-[60] hidden items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_16px_45px_rgba(7,26,47,.2)] lg:flex">
      <a
        href="tel:+919019697170"
        data-analytics-label="Floating advisor call"
        className="inline-flex h-14 items-center gap-2 border-r border-slate-200 px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#f7f8fa]"
      >
        <Phone className="size-4 text-[#b08a16]" />
        Call advisor
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-label="Floating WhatsApp"
        aria-label="Chat with Asher Realty on WhatsApp"
        className="inline-flex h-14 items-center gap-2 px-5 text-xs font-bold text-[#071a2f] transition hover:bg-emerald-50"
      >
        <MessageCircle className="size-5 text-[#16a34a]" />
        WhatsApp
      </a>
    </div>
  );
}
