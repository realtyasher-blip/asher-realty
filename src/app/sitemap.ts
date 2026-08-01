import type { MetadataRoute } from "next";
import { projectSlug, projects } from "@/data/projects";
import { locationHubs } from "@/data/locations";
import { guides } from "@/data/guides";
import { developerProfiles, developerSlug } from "@/data/developers";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://asherrealty.in";

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${projectSlug(project.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const locationPages: MetadataRoute.Sitemap = locationHubs.map((hub) => ({
    url: `${baseUrl}/locations/${hub.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.82,
  }));
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.78,
  }));
  const builderPages: MetadataRoute.Sitemap = developerProfiles.map((profile) => ({
    url: `${baseUrl}/builders/${developerSlug(profile.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.78,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/builders`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/decision-lab`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.94,
    },
    {
      url: `${baseUrl}/book-site-visit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/my-search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/intelligence`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.92,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projectPages,
    ...builderPages,
    ...locationPages,
    ...guidePages,
  ];
}
