import CuriosityExplorer, {
  type CuriosityCollection,
} from "@/components/home/CuriosityExplorer";
import { projectSlug, projects, type Project } from "@/data/projects";
import { projectDecisionCaution } from "@/lib/decisionEngine";

const collectionBlueprints = [
  {
    id: "commute",
    label: "Less commute, more life",
    cue: "Live closer to momentum",
    title: "Homes that make the working week feel lighter.",
    description:
      "A cross-city look at projects close to the ORR, Whitefield and Manyata employment belts. The right answer depends on your actual office days and peak-hour route.",
    advisorPrompt:
      "Which of these has the most realistic door-to-desk journey on my office days?",
    projectNames: ["SOBHA Neopolis", "Prestige Somerville", "Lodha Mirabelle"],
  },
  {
    id: "green",
    label: "Space to breathe",
    cue: "Green, calm, generous",
    title: "A quieter home without leaving Bengaluru behind.",
    description:
      "Landscape-led communities, larger homes and a stronger sense of retreat. Compare usable open space, density and what the view from your exact stack will really be.",
    advisorPrompt:
      "Which tower and stack genuinely feels green after construction is complete?",
    projectNames: ["SOBHA Magnus", "Down by the Water", "Embassy Greenshore"],
  },
  {
    id: "early",
    label: "Catch it early",
    cue: "New launch watchlist",
    title: "See what is new—without mistaking novelty for value.",
    description:
      "Early-stage launches can widen choice, but only when phase details, payment timing and live inventory are read carefully. These are worth a closer look now.",
    advisorPrompt:
      "What is actually open for booking, and which early-bird claim is worth verifying?",
    projectNames: ["Prestige Evergreen", "Godrej Vanantara", "Nikoo Homes 8"],
  },
  {
    id: "sooner",
    label: "Move sooner",
    cue: "Shorter wait",
    title: "For buyers who want certainty sooner than someday.",
    description:
      "Active and ready opportunities can reduce execution risk. The real comparison is not only possession—it is available inventory, condition and final all-inclusive cost.",
    advisorPrompt:
      "Which homes can I inspect properly now, and what is the realistic handover path?",
    projectNames: ["SOBHA Galera", "Purva Zenium", "Embassy Springs"],
  },
  {
    id: "distinctive",
    label: "Distinctive luxury",
    cue: "Homes with a point of view",
    title: "When the home should feel unlike everything else.",
    description:
      "Design-led and limited-inventory addresses for buyers who value character, privacy and a clear architectural idea—not simply a longer amenity list.",
    advisorPrompt:
      "Where is the premium visible in daily living, and where is it only in positioning?",
    projectNames: [
      "Pursuit of a Radical Rhapsody",
      "Four Seasons Private Residences at Embassy ONE",
      "SOBHA Infinia",
    ],
  },
] as const;

function toCuriosityProject(project: Project) {
  return {
    name: project.name,
    slug: projectSlug(project.name),
    developer: project.developer,
    location: project.location,
    image: project.image,
    price: project.price,
    status: project.status,
    configuration: project.configuration,
    why: project.buyerNotes?.[0] || project.highlights[0],
    caution: projectDecisionCaution(project),
  };
}

export default function CuriosityStudio() {
  const collections: CuriosityCollection[] = collectionBlueprints.map(
    ({ projectNames, ...collection }) => ({
      ...collection,
      projects: projectNames
        .map((name) => projects.find((project) => project.name === name))
        .filter((project): project is Project => Boolean(project))
        .map(toCuriosityProject),
    })
  );

  return <CuriosityExplorer collections={collections} />;
}
