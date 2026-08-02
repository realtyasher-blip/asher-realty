import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Asher Realty — Bengaluru Property App",
    short_name: "Asher Realty",
    description:
      "Match, compare and save premium Bengaluru properties, then plan guided site visits with Asher Realty.",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#071a2f",
    theme_color: "#071a2f",
    categories: ["business", "lifestyle", "finance"],
    icons: [
      {
        src: "/brand/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Find My Home",
        short_name: "Home Match",
        description: "Build a personalised Bengaluru project shortlist",
        url: "/home-match?source=app-shortcut",
        icons: [
          {
            src: "/brand/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Saved Properties",
        short_name: "Saved",
        description: "Open your saved property shortlist",
        url: "/projects?saved=1&source=app-shortcut",
        icons: [
          {
            src: "/brand/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Book Site Visit",
        short_name: "Book Visit",
        description: "Schedule a guided project visit",
        url: "/book-site-visit?source=app-shortcut",
        icons: [
          {
            src: "/brand/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
