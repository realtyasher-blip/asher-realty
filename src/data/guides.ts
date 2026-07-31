export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type GuideSource = {
  label: string;
  url: string;
};

export type Guide = {
  slug: string;
  title: string;
  dek: string;
  category: "Buyer basics" | "Documents" | "Money" | "Bengaluru living";
  readTime: string;
  updatedAt: string;
  cover: string;
  featured?: boolean;
  keyTakeaways: string[];
  sections: GuideSection[];
  sources: GuideSource[];
};

const updatedAt = "31 Jul 2026";

export const guides: Guide[] = [
  {
    slug: "bengaluru-site-visit-scorecard",
    title: "The Bengaluru site-visit scorecard: 12 questions that reveal more than the model flat",
    dek: "A beautiful sales gallery can make every project feel right. This scorecard brings the decision back to the unit, the access road and your daily life.",
    category: "Buyer basics",
    readTime: "8 min read",
    updatedAt,
    cover: "/projects/sobha-oneworld/living-dining.jpg",
    featured: true,
    keyTakeaways: [
      "Visit the access road during the commute you will actually make.",
      "Ask for the exact tower, stack, floor and phase—not only the sample layout.",
      "Photograph the cost sheet and compare it away from the sales environment.",
    ],
    sections: [
      {
        heading: "Before you enter the project",
        paragraphs: [
          "Start the visit five kilometres before the gate. Notice the road width, bottlenecks, flooding signs, heavy-vehicle movement and the final approach. A project can have an excellent city-level location while still creating a difficult daily last mile.",
          "Repeat the route at a realistic time. A Sunday morning drive is useful for finding the site; it is not evidence of a weekday commute.",
        ],
        bullets: [
          "What is the dependable alternative route when the main road is blocked?",
          "How long does the last three kilometres take at 9 am and 6 pm?",
          "Are school buses, cabs and delivery vehicles able to enter comfortably?",
        ],
      },
      {
        heading: "Inside the sales gallery",
        paragraphs: [
          "Ask the representative to map the quoted home on the approved plan. The words ‘3 BHK’ are not enough: orientation, floor, neighbouring tower, lift lobby and services can materially change light, privacy and noise.",
          "Model flats often use altered furniture and doors to demonstrate space. Carry a tape measure and compare the actual dimension schedule with the way your furniture will be placed.",
        ],
        bullets: [
          "Which RERA phase contains this exact tower?",
          "What can be built in front of this balcony in later phases?",
          "How many homes share each lift and lobby?",
          "Where are the transformer, STP, generator, loading bay and clubhouse service entries?",
        ],
      },
      {
        heading: "The cost-sheet moment",
        paragraphs: [
          "Ask for an all-inclusive written cost sheet tied to the exact unit. Separate unavoidable statutory costs from optional charges and time-linked offers. Never compare one project’s base price with another project’s final payable amount.",
          "Then step away. A useful decision is usually made after the visit, when the excitement has settled and two or three alternatives can be compared on the same assumptions.",
        ],
        callout: "Asher tip: visit a maximum of three well-matched projects in one day. More visits usually create fatigue, not clarity.",
      },
      {
        heading: "Your 12-point score",
        paragraphs: [
          "Score each item from one to five: daily access, location ecosystem, usable floor plan, light, ventilation, privacy, construction confidence, phase clarity, amenity usefulness, all-inclusive cost, payment comfort and resale/rental depth.",
          "The highest total is not automatically the winner. Give extra weight to the three factors your household will experience every week.",
        ],
      },
    ],
    sources: [
      { label: "Karnataka RERA — project disclosures", url: "https://rera.karnataka.gov.in/" },
      { label: "Greater Bengaluru Authority — civic services", url: "https://bbmp.gov.in/" },
    ],
  },
  {
    slug: "khata-e-khata-bengaluru-buyer-guide",
    title: "Khata and e-Khata without the confusion: what a Bengaluru apartment buyer should verify",
    dek: "Khata is widely discussed as if it were a title certificate. It is more useful to understand what the civic record does—and what it does not prove.",
    category: "Documents",
    readTime: "9 min read",
    updatedAt,
    cover: "/projects/sumadhura-pramoda/aerial.png",
    featured: true,
    keyTakeaways: [
      "Khata records a property in the municipal register for assessment and tax.",
      "It should be checked alongside title, approvals, tax records and the sale agreement.",
      "For new apartments, clarify when and how the individual unit record will be created.",
    ],
    sections: [
      {
        heading: "What Khata actually records",
        paragraphs: [
          "The civic authority describes Khata as the entry of a property in the municipal property register. The record supports tax assessment, assigns a municipal identity and identifies the person primarily responsible for property tax.",
          "That makes Khata important, but it should not be treated as a substitute for a legal title review. Ownership flows from the title documents and transaction; civic, planning and revenue records answer different questions.",
        ],
        callout: "Think of due diligence as a stack: title, land and planning approvals, RERA, construction permissions, civic records, tax and the unit contract.",
      },
      {
        heading: "Why e-Khata matters",
        paragraphs: [
          "Digitisation makes the municipal record easier to reference and transact with. Bengaluru’s civic portals now surface e-Aasthi, e-Khata and related property-tax services, but the exact workflow can depend on the property type and jurisdiction.",
          "Ask for the property identifier, current tax-paid record and the relevant Khata certificate or extract. For a newly built apartment, ask how the parent property will be subdivided into individual unit records after completion and registration.",
        ],
      },
      {
        heading: "The new-apartment checklist",
        paragraphs: [
          "A buyer should match the apartment number, tower, undivided share and parking description across the agreement, sanctioned plan and cost sheet. Confirm whether the developer has provided the documents needed for the eventual individual Khata process.",
        ],
        bullets: [
          "Parent-property Khata and tax-paid receipts",
          "Sanctioned plan and commencement permission",
          "RERA registration for the correct phase",
          "Sale and construction agreement descriptions",
          "Occupancy Certificate and completion documents when applicable",
        ],
      },
      {
        heading: "The question to ask your lawyer",
        paragraphs: [
          "Do not ask only, ‘Is the Khata available?’ Ask whether the entire document set supports clean ownership, lawful construction, registration of the unit and future civic transfer. The answer should relate to your exact tower and apartment.",
          "Rules, authorities and digital processes can change. Verify the current workflow with the civic portal and an independent property lawyer before registration.",
        ],
      },
    ],
    sources: [
      { label: "GBA / BBMP Revenue Department — Khata FAQ", url: "https://site.bbmp.gov.in/departmentwebsites/Revenue/gen.html" },
      { label: "Greater Bengaluru Authority — e-services", url: "https://bbmp.gov.in/" },
      { label: "BBMP — Khata service document lists", url: "https://site.bbmp.gov.in/departmentwebsites/Revenue/kathaservice.html" },
    ],
  },
  {
    slug: "how-to-read-karnataka-rera-project",
    title: "RERA without jargon: how to read a Karnataka project registration like a buyer",
    dek: "A RERA number is the beginning of verification, not the end. Learn how to connect the registration to the tower, possession date and documents you were shown.",
    category: "Documents",
    readTime: "8 min read",
    updatedAt,
    cover: "/projects/brigade-el-dorado/aerial-day.webp",
    featured: true,
    keyTakeaways: [
      "Match the registration to the exact project phase and tower.",
      "Read sanctioned-plan, land and completion disclosures—not only the summary page.",
      "Save dated copies of the disclosures that informed your decision.",
    ],
    sections: [
      {
        heading: "Why the phase matters",
        paragraphs: [
          "Large Bengaluru communities often launch in phases. Each phase can have a different registration, possession commitment and set of disclosed buildings. A familiar township name does not tell you which registration governs your apartment.",
          "Ask the sales team to write the RERA number on the cost sheet for the exact unit. Then independently search that registration and compare the promoter, land parcel, tower details and declared completion date.",
        ],
      },
      {
        heading: "Read the timeline as a contract signal",
        paragraphs: [
          "Marketing language may describe an expected handover window. The regulatory disclosure gives you a formal project timeline, but buyers must still read the agreement clauses, grace periods and force-majeure provisions with a lawyer.",
          "Look at periodic updates and whether the physical work you saw aligns with the stage reported. A delay is not automatically evidence of failure, but it should change your cash-flow and housing plan.",
        ],
      },
      {
        heading: "Documents worth opening",
        paragraphs: [
          "The useful work starts after finding the registration. Review the sanctioned layout, approvals, title-related disclosures, encumbrances, pro forma agreements, quarterly updates and any registered modifications.",
        ],
        bullets: [
          "Does the apartment block appear in this phase?",
          "Is the configuration and area consistent with the brochure and agreement?",
          "Are promised common amenities inside this phase or dependent on a later one?",
          "Has the promoter updated construction and approvals on schedule?",
        ],
      },
      {
        heading: "Create a decision record",
        paragraphs: [
          "Download or screenshot the key pages with the date. Record who answered each unresolved question and ask for important commitments in writing. Your decision file should be understandable even six months later.",
          "RERA is an essential verification source, but it does not replace technical inspection, title due diligence, financial planning or a careful agreement review.",
        ],
      },
    ],
    sources: [
      { label: "Karnataka Real Estate Regulatory Authority", url: "https://rera.karnataka.gov.in/" },
      { label: "Government Services — Karnataka RERA agent status", url: "https://services.india.gov.in/service/detail/check-agent-status-in-real-estate-regulatory-authority-karnataka" },
    ],
  },
  {
    slug: "true-cost-new-apartment-bengaluru",
    title: "Beyond the headline price: calculate the true cost of a new Bengaluru apartment",
    dek: "Base price is only one line in a property decision. Build a cash-flow view that includes statutory charges, floor premiums, fit-out and the cost of waiting.",
    category: "Money",
    readTime: "10 min read",
    updatedAt,
    cover: "/projects/godrej-woods/amenity.webp",
    featured: true,
    keyTakeaways: [
      "Compare all-inclusive cost for an exact unit, not advertised starting price.",
      "Time each payment against your savings, loan disbursement and existing rent.",
      "Keep a separate furnishing and post-possession reserve.",
    ],
    sections: [
      {
        heading: "Build the cost stack",
        paragraphs: [
          "Start with the basic sale value for the exact unit and area definition. Add floor rise, preferential location, parking, clubhouse or amenity charges, maintenance deposits, legal or documentation fees and statutory taxes or registration charges applicable to the transaction.",
          "Some items may be bundled, waived or described differently. The discipline is to put every project into the same spreadsheet so that a missing line becomes visible.",
        ],
      },
      {
        heading: "Price is not the same as cash flow",
        paragraphs: [
          "An under-construction home may spread payments over milestones; a near-complete home may require a much faster outflow. Model when your down payment, loan disbursement, pre-EMI or EMI and current rent will overlap.",
          "A discount is only valuable if the payment schedule remains comfortable. Emergency savings should not disappear into a booking amount.",
        ],
      },
      {
        heading: "Remember the move-in budget",
        paragraphs: [
          "A bare apartment still needs interiors, appliances, lighting, window treatments, moving and sometimes temporary accommodation. Create a separate range rather than quietly absorbing these costs into the home-loan assumption.",
        ],
        bullets: [
          "Essential fit-out before occupation",
          "Furniture and appliances",
          "Maintenance from handover",
          "Property tax and insurance",
          "Contingency for delay or scope change",
        ],
      },
      {
        heading: "Use three scenarios",
        paragraphs: [
          "Build a base case, a higher-interest case and a delayed-possession case. If the purchase remains manageable in all three, your financial comfort is more robust than a calculation based only on today’s EMI.",
          "Tax, stamp-duty and registration rules can change. Confirm the current payable amounts on the official Karnataka registration system and with qualified legal or tax professionals.",
        ],
      },
    ],
    sources: [
      { label: "Kaveri 2.0 — Karnataka registration services overview", url: "https://negd.gov.in/isl/Directory/statedata/416" },
      { label: "Reserve Bank of India — home-loan consumer guidance", url: "https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701" },
    ],
  },
  {
    slug: "home-loan-rate-reset-emi-tenure",
    title: "When a floating home-loan rate changes: what happens to EMI, tenure and total interest?",
    dek: "A small rate change can extend a long loan more than many buyers expect. Understand the reset conversation before signing the sanction letter.",
    category: "Money",
    readTime: "8 min read",
    updatedAt,
    cover: "/images/consultant.jpg",
    keyTakeaways: [
      "Ask for the APR, benchmark, spread and reset frequency in writing.",
      "A lender may adjust EMI, tenure or both when a floating rate changes.",
      "Review quarterly statements and model the lifetime cost—not only today’s EMI.",
    ],
    sections: [
      {
        heading: "The four numbers behind the EMI",
        paragraphs: [
          "Your instalment depends on principal, interest rate, remaining tenure and repayment structure. With a floating loan, the rate is linked to a benchmark plus the lender’s applicable spread. Understand how often it resets and which part can change.",
          "Ask for the Annual Percentage Rate or Key Fact Statement because processing and other charges affect the cost of borrowing beyond the headline interest rate.",
        ],
      },
      {
        heading: "Why tenure can quietly grow",
        paragraphs: [
          "When rates rise, keeping the EMI unchanged requires more instalments. Over a long loan this can materially increase total interest. A higher EMI may preserve the original tenure, while a part-prepayment can reduce the principal on which future interest is calculated.",
          "The right response depends on your income stability, emergency reserve, tax position and other goals. Do not use all available cash merely to shorten the loan.",
        ],
      },
      {
        heading: "What RBI says lenders should communicate",
        paragraphs: [
          "RBI guidance requires regulated entities to explain the possible impact of benchmark changes and communicate increases in EMI or tenor. Quarterly statements should disclose principal and interest recovered, EMI, instalments remaining and the annualised rate.",
          "At reset, borrowers should be informed about the options available under the lender’s policy. Read the latest lender terms and RBI guidance rather than relying on a verbal assurance.",
        ],
      },
      {
        heading: "Run a stress test",
        paragraphs: [
          "Calculate the EMI and total interest at your quoted rate, then repeat with the rate one and two percentage points higher. Also test a temporary income interruption. A comfortable home is one whose financing does not make the rest of life fragile.",
        ],
      },
    ],
    sources: [
      { label: "RBI — floating-rate EMI reset FAQ, January 2025", url: "https://www.rbi.org.in/scripts/FAQView.aspx/FAQView.aspx/FAQView.aspx?Id=170" },
      { label: "RBI — home-loan consumer guidance", url: "https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701" },
    ],
  },
  {
    slug: "east-north-south-bengaluru-property",
    title: "East, North or South Bengaluru? Choose around your week, not a future map",
    dek: "Each corridor can work—but for different households. Compare employment access, social infrastructure and the amount of future dependency in the decision.",
    category: "Bengaluru living",
    readTime: "9 min read",
    updatedAt,
    cover: "/projects/prestige-southern-star/aerial.webp",
    keyTakeaways: [
      "Start with the two trips your household makes most frequently.",
      "Separate infrastructure operating today from infrastructure still expected.",
      "Compare the exact micro-market; broad corridor labels hide large differences.",
    ],
    sections: [
      {
        heading: "East Bengaluru: depth and employment",
        paragraphs: [
          "Whitefield, Sarjapur, Varthur, Budigere and the ORR catchment offer Bengaluru’s broadest premium project depth around major technology employment. Metro access strengthens parts of the corridor, while road congestion and last-mile distance vary sharply.",
          "East works best when the project solves your real commute and the surrounding social infrastructure already supports the household.",
        ],
      },
      {
        heading: "North Bengaluru: optionality and distance",
        paragraphs: [
          "Manyata, Hebbal, Thanisandra, Yelahanka, the airport and Aerospace Park create more than one North Bengaluru story. Manyata-linked end users and airport-economy buyers can have very different location priorities.",
          "Large townships and long-term infrastructure attract attention, but buyers should measure present occupancy, everyday services and distance from their current workplace.",
        ],
      },
      {
        heading: "South Bengaluru: established end use",
        paragraphs: [
          "Electronic City, Bannerghatta Road, Kanakapura Road, RR Nagar and adjoining markets combine established neighbourhoods with new residential supply. South can suit end-user families who already have work, school and family networks on this side of the city.",
          "The risk is cross-city optimism: a project that is attractive on paper can become difficult if the household repeatedly travels to East or North Bengaluru.",
        ],
      },
      {
        heading: "A better way to choose",
        paragraphs: [
          "Map work, school, healthcare, family and airport trips. Give each a weekly frequency and an acceptable travel time. Test project routes at the time they will be used, then compare the result with home size, price and delivery confidence.",
          "Future metro and road projects can create optionality, but a home should remain workable if a proposed connection takes longer than expected.",
        ],
      },
    ],
    sources: [
      { label: "Cushman & Wakefield — Bengaluru Residential MarketBeat Q2 2026", url: "https://www.cushmanwakefield.com/en/india/insights/marketbeat-india/bengaluru-marketbeat" },
      { label: "BMRCL — official Namma Metro network and projects", url: "https://english.bmrc.co.in/" },
    ],
  },
  {
    slug: "how-to-read-apartment-floor-plan",
    title: "How to read an apartment floor plan: efficiency, privacy and furniture reality",
    dek: "Square feet do not live the way a family lives. Learn to see circulation, room proportions, balcony utility and the spaces a brochure does not emphasise.",
    category: "Buyer basics",
    readTime: "7 min read",
    updatedAt,
    cover: "/projects/sobha-galera/living.webp",
    keyTakeaways: [
      "Compare carpet area and usable dimensions before total marketed area.",
      "Trace movement from entry to every room and count dead circulation.",
      "Check window, balcony and door positions against real furniture.",
    ],
    sections: [
      {
        heading: "Begin with the area definitions",
        paragraphs: [
          "Ask for the RERA carpet area, balcony or terrace area and the basis of any saleable or super built-up figure. Two homes with the same headline area can have meaningfully different usable interiors.",
          "Efficiency is not simply the highest carpet percentage. A slightly lower number can still work well if rooms are proportioned properly and storage, light and privacy are stronger.",
        ],
      },
      {
        heading: "Trace the circulation",
        paragraphs: [
          "Draw a line from the front door to the kitchen, bedrooms and balcony. Long passages, awkward corners and doors that collide consume space without improving daily life.",
          "Notice whether guests must cross private bedroom zones, whether the common bathroom opens directly to living or dining, and whether the utility route cuts through the kitchen work area.",
        ],
      },
      {
        heading: "Place your actual furniture",
        paragraphs: [
          "Use dimensions, not the brochure’s sofa icons. Mark your bed, side tables, wardrobes, dining table, work desks and television wall. Check door swings, electrical points and the remaining walking width.",
        ],
        bullets: [
          "Can a king bed fit with usable space on both sides?",
          "Does the wardrobe block a switch or window?",
          "Can dining chairs move without obstructing circulation?",
          "Is the balcony deep enough for the activity shown in the render?",
        ],
      },
      {
        heading: "Read outside the apartment",
        paragraphs: [
          "The floor plate reveals lift count, lobby width, number of neighbours, fire stairs, service shafts and the relationship between entrances. Ask what every blank or service-marked space contains.",
          "Finally, map the apartment stack to north, surrounding towers and future construction. A good internal plan can still be compromised by poor orientation or close-facing blocks.",
        ],
      },
    ],
    sources: [
      { label: "Karnataka RERA — registered project plans and disclosures", url: "https://rera.karnataka.gov.in/" },
    ],
  },
  {
    slug: "metro-proximity-property-value-bengaluru",
    title: "Metro near a project: useful connectivity signal or marketing shortcut?",
    dek: "Distance to a proposed station is not the same as a dependable daily commute. Here is how to evaluate metro relevance without paying for a promise.",
    category: "Bengaluru living",
    readTime: "7 min read",
    updatedAt,
    cover: "/projects/birla-trimaya/hero.png",
    keyTakeaways: [
      "Separate operating, under-construction and proposed lines.",
      "Measure the door-to-platform journey, not a straight-line pin.",
      "A metro premium is useful only when the household will actually use it.",
    ],
    sections: [
      {
        heading: "Three different kinds of ‘metro nearby’",
        paragraphs: [
          "An operating station offers a service you can test today. A line under construction carries execution and opening-date uncertainty. A proposed alignment is a planning signal, not a commuting fact.",
          "Ask the project team to identify the station, line and present status. Then verify it on BMRCL’s official network and project information.",
        ],
      },
      {
        heading: "Measure the complete trip",
        paragraphs: [
          "A station two kilometres away may require an unsafe walk, an unreliable feeder or a congested crossing. Time the route from the project gate to the platform, including parking, security and interchange.",
          "The correct comparison is door-to-destination: home to office, school or the place your family visits—not project to station.",
        ],
      },
      {
        heading: "Do not double-count the future",
        paragraphs: [
          "Sellers may already price a project as if future infrastructure is complete. If your purchase depends on that connection, compare the current value with alternatives that already provide the benefit.",
          "Infrastructure can improve accessibility and broaden buyer demand, but it does not guarantee appreciation. New supply around the same corridor also affects future competition.",
        ],
      },
      {
        heading: "The practical metro score",
        paragraphs: [
          "Score operating status, walking or feeder quality, travel-time saving, interchange burden and relevance to your weekly routine. A station is a strong buying factor only when the combined score changes everyday life.",
        ],
      },
    ],
    sources: [
      { label: "Bangalore Metro Rail Corporation — official network", url: "https://english.bmrc.co.in/" },
      { label: "Colliers — Yellow and Pink line micro-market analysis", url: "https://www.colliers.com/en-in/news/press-release-bengaluru-yellow-and-pink-metro-lines" },
    ],
  },
];

export const guideCategories = [
  "All topics",
  "Buyer basics",
  "Documents",
  "Money",
  "Bengaluru living",
] as const;

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
