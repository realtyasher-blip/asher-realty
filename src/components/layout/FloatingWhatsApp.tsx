import { MessageCircle } from "lucide-react";

const whatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20am%20looking%20for%20a%20property%20in%20Bengaluru.";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Asher Realty on WhatsApp"
      className="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_35px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:scale-105 sm:right-7 sm:bottom-7"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}