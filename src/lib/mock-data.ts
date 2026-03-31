export type AlertLevel = "High" | "Medium" | "Low";

export type AlertItem = {
  id: number;
  competitorId: number;
  competitor: string;
  title: string;
  type: string;
  level: AlertLevel;
  time: string;
  summary: string;
  details: string;
  url: string;
  oldValue?: string;
  newValue?: string;
  tags: string[];
};

export type CompetitorItem = {
  id: number;
  name: string;
  region: string;
  monitoredPages: number;
  changes7d: number;
  status: "Active" | "Paused";
  focus: string;
  website: string;
  description: string;
  trackedCategories: string[];
};

export const competitors: CompetitorItem[] = [
  {
    id: 1,
    name: "PrintPro Supply",
    region: "US",
    monitoredPages: 42,
    changes7d: 12,
    status: "Active",
    focus: "Hot peel film, powders, starter kits",
    website: "https://printprosupply.example.com",
    description:
      "US-focused DTF consumables seller with strong promotion activity around core film SKUs.",
    trackedCategories: ["Hot peel film", "Powder", "Starter kits"],
  },
  {
    id: 2,
    name: "ColorFilm Direct",
    region: "UK",
    monitoredPages: 36,
    changes7d: 9,
    status: "Active",
    focus: "Sample packs, matte film, bundles",
    website: "https://colorfilmdirect.example.com",
    description:
      "Frequently tests entry products and beginner-friendly bundles to reduce initial order friction.",
    trackedCategories: ["Sample packs", "Matte film", "Bundles"],
  },
  {
    id: 3,
    name: "TransferLab",
    region: "DE",
    monitoredPages: 28,
    changes7d: 7,
    status: "Paused",
    focus: "Anti-static claims, premium SKUs",
    website: "https://transferlab.example.com",
    description:
      "Premium-oriented supplier focused on reliability, print stability, and higher-end positioning.",
    trackedCategories: ["Premium film", "Anti-static", "OEM"],
  },
  {
    id: 4,
    name: "InkFuse Global",
    region: "CA",
    monitoredPages: 31,
    changes7d: 14,
    status: "Active",
    focus: "Ink + film bundles, promotions",
    website: "https://inkfuseglobal.example.com",
    description:
      "Bundle-heavy catalog that frequently uses shipping incentives and category promotions.",
    trackedCategories: ["Ink bundles", "Film bundles", "Promotions"],
  },
];

export const alerts: AlertItem[] = [
  {
    id: 1,
    competitorId: 1,
    competitor: "PrintPro Supply",
    title: "60cm hot peel film price dropped from $89 to $79",
    type: "Price change",
    level: "High",
    time: "2h ago",
    summary:
      "A core DTF film SKU moved down by 11.2%, likely indicating an active promotion or competitive pricing push.",
    details:
      "The monitored product page shows a direct price reduction without any product spec change. This often points to a short-term conversion push or inventory movement strategy.",
    url: "https://printprosupply.example.com/products/60cm-hot-peel-film",
    oldValue: "$89",
    newValue: "$79",
    tags: ["hot peel", "price", "core SKU"],
  },
  {
    id: 2,
    competitorId: 2,
    competitor: "ColorFilm Direct",
    title: "New sample pack page launched",
    type: "New product",
    level: "High",
    time: "5h ago",
    summary:
      "The new sample pack positioning suggests a lower-friction entry product for first-time buyers and distributors.",
    details:
      "The new page emphasizes testing, starter orders, and beginner setup language, which usually targets hesitant first-time buyers and smaller distributors.",
    url: "https://colorfilmdirect.example.com/products/sample-pack",
    tags: ["sample pack", "starter", "new product"],
  },
  {
    id: 3,
    competitorId: 3,
    competitor: "TransferLab",
    title: "Added anti-static messaging across 7 product pages",
    type: "Messaging shift",
    level: "Medium",
    time: "8h ago",
    summary:
      "This may reflect stronger market demand for print stability and fewer transfer defects in production runs.",
    details:
      "The language was added in hero text, product bullets, and category summaries, signaling a broader message repositioning rather than a one-page test.",
    url: "https://transferlab.example.com/category/premium-film",
    tags: ["anti-static", "messaging", "quality claim"],
  },
  {
    id: 4,
    competitorId: 4,
    competitor: "InkFuse Global",
    title: "Free shipping threshold changed from $149 to $99",
    type: "Promotion update",
    level: "Medium",
    time: "1d ago",
    summary:
      "The lower free shipping threshold may improve conversion on smaller wholesale and trial orders.",
    details:
      "The threshold change appeared across the top banner and cart messaging, increasing visibility and likely impacting smaller basket purchases.",
    url: "https://inkfuseglobal.example.com",
    oldValue: "$149",
    newValue: "$99",
    tags: ["promotion", "shipping", "conversion"],
  },
  {
    id: 5,
    competitorId: 1,
    competitor: "PrintPro Supply",
    title: "Homepage CTA changed to 'Request wholesale quote'",
    type: "CTA change",
    level: "Low",
    time: "1d ago",
    summary:
      "The competitor may be shifting homepage traffic toward B2B lead capture instead of direct product browsing.",
    details:
      "The previous CTA pointed directly to product categories. The new CTA likely supports higher-intent B2B traffic and quote-driven sales conversations.",
    url: "https://printprosupply.example.com",
    oldValue: "Shop now",
    newValue: "Request wholesale quote",
    tags: ["CTA", "B2B", "wholesale"],
  },
];

export const monitoredPages = [
  {
    id: 1,
    url: "https://printprosupply.example.com/products/60cm-hot-peel-film",
    type: "Product",
    status: "Recommended",
  },
  {
    id: 2,
    url: "https://printprosupply.example.com/collections/dtf-film",
    type: "Category",
    status: "Recommended",
  },
  {
    id: 3,
    url: "https://printprosupply.example.com/pages/wholesale",
    type: "Landing page",
    status: "Optional",
  },
  {
    id: 4,
    url: "https://printprosupply.example.com/blogs/news",
    type: "Blog",
    status: "Optional",
  },
];
