import fallbackNews from "@/data/market-news.json";

export type MarketNewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
};

export type MarketNewsFeed = {
  updatedAt: string;
  items: MarketNewsItem[];
};

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function tag(xml: string, name: string) {
  return decodeXml(
    xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1]
  );
}

function classify(title: string) {
  if (/Bengaluru|Bangalore/i.test(title)) return "Bengaluru";
  if (/launch|project/i.test(title)) return "Launches";
  if (/price|sales|demand|market/i.test(title)) return "Market";
  return "India";
}

export async function getMarketNews(): Promise<MarketNewsFeed> {
  try {
    const query = encodeURIComponent(
      '(Bengaluru OR Bangalore) "real estate" OR "property market" when:7d'
    );
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
    const response = await fetch(url, {
      next: { revalidate: 86400, tags: ["market-news"] },
      headers: { "user-agent": "AsherRealtyMarketMonitor/1.0" },
    });

    if (!response.ok) return fallbackNews;

    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
      .map((match) => {
        const block = match[1];
        const title = tag(block, "title").replace(/\s+-\s+[^-]+$/, "");
        return {
          title,
          source: tag(block, "source") || "Google News",
          publishedAt: new Date(tag(block, "pubDate")).toISOString(),
          url: tag(block, "link"),
          category: classify(title),
        };
      })
      .filter(
        (item) =>
          item.title &&
          item.url &&
          /Bengaluru|Bangalore|housing|property|real estate|homebuyer/i.test(
            item.title
          )
      )
      .slice(0, 12);

    if (items.length < 3) return fallbackNews;

    return { updatedAt: new Date().toISOString(), items };
  } catch {
    return fallbackNews;
  }
}
