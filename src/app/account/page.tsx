import type { Metadata } from "next";

import OwnerWorkspace from "@/components/account/OwnerWorkspace";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "My Asher | Manage Your Properties",
  description:
    "A secure workspace to manage your property profile, photos, privacy settings and review status.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef2f3] pb-20 pt-28 sm:pt-32">
        <div className="container-shell">
          <OwnerWorkspace />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
