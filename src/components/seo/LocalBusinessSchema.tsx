export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Asher Realty",
    url: "https://asherrealty.in",
    telephone: "+91-90196-97170",
    email: "info@asherrealty.in",
    description:
      "Property advisory for apartments, villas and real estate investment opportunities across Bengaluru.",
    areaServed: [
      "Bengaluru",
      "Whitefield",
      "Sarjapur Road",
      "Hebbal",
      "North Bengaluru",
      "Electronic City",
      "Devanahalli",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-90196-97170",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Kannada"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}