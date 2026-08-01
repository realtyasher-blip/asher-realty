import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

import MobileAppNav from "@/components/app/MobileAppNav";
import PwaRegistration from "@/components/app/PwaRegistration";
import BuyerWorkspaceDock from "@/components/app/BuyerWorkspaceDock";
import UniversalSearch from "@/components/app/UniversalSearch";
import PropertyCopilot from "@/components/ai/PropertyCopilot";

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
  applicationName: "Asher Realty",
  manifest: "/manifest.webmanifest",
  title: {
    default: "Asher Realty | Premium Properties in Bengaluru",
    template: "%s | Asher Realty",
  },
  description:
    "Find, save and compare premium Bengaluru properties with clear project information and personalised guidance from Asher Realty.",
  keywords: [
    "Asher Realty",
    "Bengaluru real estate",
    "Bangalore apartments",
    "premium properties Bengaluru",
    "luxury apartments Bangalore",
    "property investment Bengaluru",
    "Bangalore property comparison",
    "Bengaluru property advisor",
    "AI property search Bangalore",
  ],
  openGraph: {
    title: "Asher Realty | Find the Right Bengaluru Home",
    description: "Search less. Shortlist better. Visit with confidence.",
    url: "https://asherrealty.in",
    siteName: "Asher Realty",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-v2.png",
        width: 1733,
        height: 909,
        alt: "Asher Realty — property search, upgraded to intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asher Realty | Find the Right Bengaluru Home",
    description: "Search less. Shortlist better. Visit with confidence.",
    images: ["/og-v2.png"],
  },
  icons: {
    icon: "/brand/asher-mark.png",
    shortcut: "/brand/asher-mark.png",
    apple: "/brand/app-icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Asher Realty",
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071a2f",
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
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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
              } else if (href.startsWith('/book-site-visit')) {
                gtag('event', 'site_visit_flow_opened', {
                  cta_label: label,
                  page_path: window.location.pathname
                });
              } else if (href.startsWith('/compare')) {
                gtag('event', 'comparison_opened', {
                  comparison_path: href
                });
              } else if (href.startsWith('/decision-lab')) {
                gtag('event', 'decision_lab_opened', {
                  decision_path: href,
                  cta_label: label
                });
              } else if (href.startsWith('/my-search')) {
                gtag('event', 'buyer_workspace_opened', {
                  cta_label: label,
                  page_path: window.location.pathname
                });
              }
            });
          `}
        </Script>
        {children}
        <UniversalSearch />
        <BuyerWorkspaceDock />
        <PropertyCopilot />
        <PwaRegistration />
        <MobileAppNav />
      </body>
    </html>
  );
}
