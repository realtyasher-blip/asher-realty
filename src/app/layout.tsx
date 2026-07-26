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
    images: [
      {
        url: "/images/hero-property-v2.png",
        width: 1672,
        height: 937,
        alt: "Asher Realty — premium Bengaluru property advisory",
      },
    ],
  },
  icons: {
    icon: "/brand/asher-mark.png",
    shortcut: "/brand/asher-mark.png",
    apple: "/brand/asher-mark.png",
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
              var label = link.getAttribute('data-analytics-label') ||
                (link.textContent || '').trim().slice(0, 80);
              if (href.includes('wa.me/')) {
                gtag('event', 'whatsapp_click', {
                  cta_label: label,
                  page_path: window.location.pathname
                });
              } else if (href.startsWith('tel:')) {
                gtag('event', 'phone_call_click', {
                  cta_label: label,
                  page_path: window.location.pathname
                });
              } else if (href.startsWith('/projects/')) {
                gtag('event', 'project_view_click', {
                  project_path: href,
                  cta_label: label
                });
              } else if (href.startsWith('/locations/')) {
                gtag('event', 'location_guide_opened', {
                  location_path: href,
                  cta_label: label
                });
              } else if (href.startsWith('/compare')) {
                gtag('event', 'comparison_opened', {
                  comparison_path: href
                });
              }
            });
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
