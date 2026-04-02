type CrawlResult = {
  finalUrl: string;
  status: number;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  mainText: string | null;
  rawHtml: string;
  rawHtmlHash: string;
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function matchMetaDescription(html: string) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  return match?.[1]?.trim() || null;
}

function matchTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.replace(/\s+/g, " ").trim() || null;
}

function matchH1(html: string) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
}

async function sha256(input: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function crawlPage(url: string): Promise<CrawlResult> {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "DTF-Radar-Bot/0.1 (+https://github.com/llfhu24-web/dtf-radar)",
      accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  const rawHtml = await response.text();
  const mainText = stripHtml(rawHtml).slice(0, 5000) || null;

  return {
    finalUrl: response.url,
    status: response.status,
    title: matchTitle(rawHtml),
    metaDescription: matchMetaDescription(rawHtml),
    h1: matchH1(rawHtml),
    mainText,
    rawHtml,
    rawHtmlHash: await sha256(rawHtml),
  };
}
