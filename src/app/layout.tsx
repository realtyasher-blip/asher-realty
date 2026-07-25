import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M7ZLLKKFBZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M7ZLLKKFBZ');

            document.addEventListener('click', function(event) {
              var target = event.target;
              var link = target instanceof Element ? target.closest('a') : null;
              if (!link) return;

              var href = link.getAttribute('href') || '';
              if (href.includes('wa.me/')) {
                gtag('event', 'whatsapp_click', { link_url: href });
              } else if (href.startsWith('tel:')) {
                gtag('event', 'phone_call_click', { link_url: href });
              }
            });

            document.addEventListener('submit', function(event) {
              if (event.target instanceof HTMLFormElement) {
                gtag('event', 'generate_lead', {
                  form_name: 'property_consultation'
                });
              }
            }, true);
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
