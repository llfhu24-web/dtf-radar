export type SnapshotDiff = {
  changed: boolean;
  eventType: string;
  titleChanged: boolean;
  metaDescriptionChanged: boolean;
  h1Changed: boolean;
  mainTextChanged: boolean;
  priceChanged: boolean;
  ctaChanged: boolean;
  summary: string[];
};

type ComparableSnapshot = {
  title?: string | null;
  metaDescription?: string | null;
  h1?: string | null;
  mainText?: string | null;
  rawHtmlHash?: string | null;
  price?: string | null;
  ctaText?: string | null;
};

function changed(a?: string | null, b?: string | null) {
  return (a || null) !== (b || null);
}

export function diffSnapshots(previous: ComparableSnapshot | null, next: ComparableSnapshot): SnapshotDiff {
  if (!previous) {
    return {
      changed: true,
      eventType: "Initial snapshot",
      titleChanged: true,
      metaDescriptionChanged: true,
      h1Changed: true,
      mainTextChanged: true,
      priceChanged: false,
      ctaChanged: false,
      summary: ["Initial snapshot captured"],
    };
  }

  const titleChanged = changed(previous.title, next.title);
  const metaDescriptionChanged = changed(previous.metaDescription, next.metaDescription);
  const h1Changed = changed(previous.h1, next.h1);
  const priceChanged = changed(previous.price, next.price);
  const ctaChanged = changed(previous.ctaText, next.ctaText);
  const mainTextChanged = previous.rawHtmlHash !== next.rawHtmlHash || changed(previous.mainText, next.mainText);

  const summary: string[] = [];

  if (priceChanged) summary.push(`Price changed: ${previous.price || "none"} -> ${next.price || "none"}`);
  if (ctaChanged) summary.push(`CTA changed: ${previous.ctaText || "none"} -> ${next.ctaText || "none"}`);
  if (titleChanged) summary.push("Title changed");
  if (metaDescriptionChanged) summary.push("Meta description changed");
  if (h1Changed) summary.push("H1 changed");
  if (mainTextChanged) summary.push("Main content changed");

  const eventType = priceChanged
    ? "Price change"
    : ctaChanged
      ? "CTA change"
      : titleChanged || metaDescriptionChanged || h1Changed
        ? "Messaging change"
        : mainTextChanged
          ? "Content update"
          : "Page change detected";

  return {
    changed: summary.length > 0,
    eventType,
    titleChanged,
    metaDescriptionChanged,
    h1Changed,
    mainTextChanged,
    priceChanged,
    ctaChanged,
    summary,
  };
}
