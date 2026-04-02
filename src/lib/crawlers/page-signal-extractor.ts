type ExtractedSignals = {
  price: string | null;
  comparePrice: string | null;
  currency: string | null;
  ctaText: string | null;
};

const PRICE_REGEX = /(?:US\$|\$|€|£)\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g;
const CTA_CANDIDATES = [
  "add to cart",
  "buy now",
  "shop now",
  "request quote",
  "request wholesale quote",
  "get sample",
  "contact sales",
];

export function extractSignals(rawHtml: string, mainText: string | null): ExtractedSignals {
  const priceMatches = rawHtml.match(PRICE_REGEX) || mainText?.match(PRICE_REGEX) || [];
  const normalizedText = (mainText || rawHtml)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const ctaText = CTA_CANDIDATES.find((item) => normalizedText.includes(item)) || null;
  const price = priceMatches[0] || null;
  const comparePrice = priceMatches[1] || null;
  const currency = price?.includes("€")
    ? "EUR"
    : price?.includes("£")
      ? "GBP"
      : price?.includes("$")
        ? "USD"
        : null;

  return {
    price,
    comparePrice,
    currency,
    ctaText,
  };
}
