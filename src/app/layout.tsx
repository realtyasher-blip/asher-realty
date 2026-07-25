import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asherrealty.in"),

  title: {
    default: "Asher Realty | Premium Properties in Bengaluru",
    template: "%s | Asher Realty",
  },

  description:
    "Discover premium apartments, villas and investment properties across Bengaluru with personalised guidance from Asher Realty.",

  keywords: [
    "Asher Realty",
    "Bengaluru real estate",
    "Bangalore apartments",
    "premium properties Bengaluru",
    "luxury apartments Bangalore",
    "property investment Bengaluru",
  ],

  openGraph: {
    title: "Asher Realty",
    description: "Find Better. Invest Smarter.",
    url: "https://asherrealty.in",
    siteName: "Asher Realty",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}