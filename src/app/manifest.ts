import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Asher Realty — Bengaluru Property App",
    short_name: "Asher Realty",
    description:
      "Buy, rent, sell or rent out Bengaluru property with one managed Asher Realty journey.",
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
        name: "Buy a Property",
        short_name: "Buy",
        description: "Explore Bengaluru new-launch properties",
        url: "/projects?source=app-shortcut",
        icons: [
          {
            src: "/brand/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Find a Rental",
        short_name: "Rent",
        description: "Start a managed Bengaluru rental search",
        url: "/rent?source=app-shortcut",
        icons: [
          {
            src: "/brand/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Post a Property",
        short_name: "Post",
        description: "Submit a property privately for rent or resale review",
        url: "/post-property?source=app-shortcut",
        icons: [
          {
            src: "/brand/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Property Services",
        short_name: "Services",
        description: "Explore end-to-end Bengaluru property support",
        url: "/services?source=app-shortcut",
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
