export type AlertLevel = "High" | "Medium" | "Low";

export type AlertItem = {
  id: number;
  competitor: string;
  title: string;
  type: string;
  level: AlertLevel;
  time: string;
  summary: string;
};

export const alerts: AlertItem[] = [
  {
    id: 1,
    competitor: "PrintPro Supply",
    title: "60cm hot peel film price dropped from $89 to $79",
    type: "Price change",
    level: "High",
    time: "2h ago",
    summary:
      "A core DTF film SKU moved down by 11.2%, likely indicating an active promotion or competitive pricing push.",
  },
  {
    id: 2,
    competitor: "ColorFilm Direct",
    title: "New sample pack page launched",
    type: "New product",
    level: "High",
    time: "5h ago",
    summary:
      "The new sample pack positioning suggests a lower-friction entry product for first-time buyers and distributors.",
  },
  {
    id: 3,
    competitor: "TransferLab",
    title: "Added anti-static messaging across 7 product pages",
    type: "Messaging shift",
    level: "Medium",
    time: "8h ago",
    summary:
      "This may reflect stronger market demand for print stability and fewer transfer defects in production runs.",
  },
  {
    id: 4,
    competitor: "InkFuse Global",
    title: "Free shipping threshold changed from $149 to $99",
    type: "Promotion update",
    level: "Medium",
    time: "1d ago",
    summary:
      "The lower free shipping threshold may improve conversion on smaller wholesale and trial orders.",
  },
  {
    id: 5,
    competitor: "FilmWorks",
    title: "Homepage CTA changed to 'Request wholesale quote'",
    type: "CTA change",
    level: "Low",
    time: "1d ago",
    summary:
      "The competitor may be shifting homepage traffic toward B2B lead capture instead of direct product browsing.",
  },
];

export const competitors = [
  {
    id: 1,
    name: "PrintPro Supply",
    region: "US",
    monitoredPages: 42,
    changes7d: 12,
    status: "Active",
    focus: "Hot peel film, powders, starter kits",
  },
  {
    id: 2,
    name: "ColorFilm Direct",
    region: "UK",
    monitoredPages: 36,
    changes7d: 9,
    status: "Active",
    focus: "Sample packs, matte film, bundles",
  },
  {
    id: 3,
    name: "TransferLab",
    region: "DE",
    monitoredPages: 28,
    changes7d: 7,
    status: "Paused",
    focus: "Anti-static claims, premium SKUs",
  },
  {
    id: 4,
    name: "InkFuse Global",
    region: "CA",
    monitoredPages: 31,
    changes7d: 14,
    status: "Active",
    focus: "Ink + film bundles, promotions",
  },
];
