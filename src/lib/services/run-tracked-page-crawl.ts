import { crawlPage } from "@/lib/crawlers/page-crawler";
import { extractSignals } from "@/lib/crawlers/page-signal-extractor";
import { diffSnapshots } from "@/lib/diff/page-diff";
import { createChangeEvent } from "@/lib/repositories/change-event-repository";
import { completeCrawlJob, createCrawlJob } from "@/lib/repositories/crawl-job-repository";
import { createPageSnapshot, getTrackedPageById } from "@/lib/repositories/page-snapshot-repository";

export type CrawlTrackedPageResult = {
  trackedPageId: string;
  crawlJobId: string;
  snapshotId?: string;
  changeEventId?: string;
  changed: boolean;
  eventType?: string;
  error?: string;
};

export async function runTrackedPageCrawl(
  trackedPageId: string,
  fetchMode: string,
): Promise<CrawlTrackedPageResult> {
  const trackedPage = await getTrackedPageById(trackedPageId);

  if (!trackedPage) {
    throw new Error("Tracked page not found");
  }

  const crawlJob = await createCrawlJob({
    trackedPageId: trackedPage.id,
    fetchMode,
  });

  try {
    const previousSnapshot = trackedPage.snapshots[0] ?? null;
    const crawlResult = await crawlPage(trackedPage.url);
    const signals = extractSignals(crawlResult.rawHtml, crawlResult.mainText);

    const snapshot = await createPageSnapshot({
      trackedPageId: trackedPage.id,
      title: crawlResult.title,
      metaDescription: crawlResult.metaDescription,
      h1: crawlResult.h1,
      mainText: crawlResult.mainText,
      rawHtmlHash: crawlResult.rawHtmlHash,
      price: signals.price,
      comparePrice: signals.comparePrice,
      currency: signals.currency,
      ctaText: signals.ctaText,
      payloadJson: {
        finalUrl: crawlResult.finalUrl,
        status: crawlResult.status,
      },
    });

    const diff = diffSnapshots(previousSnapshot, {
      title: snapshot.title,
      metaDescription: snapshot.metaDescription,
      h1: snapshot.h1,
      mainText: snapshot.mainText,
      rawHtmlHash: snapshot.rawHtmlHash,
      price: snapshot.price,
      ctaText: snapshot.ctaText,
    });

    let changeEventId: string | undefined;

    if (diff.changed) {
      const changeEvent = await createChangeEvent({
        competitorId: trackedPage.competitorId,
        trackedPageId: trackedPage.id,
        snapshotFromId: previousSnapshot?.id,
        snapshotToId: snapshot.id,
        eventType: diff.eventType,
        title: previousSnapshot
          ? `${trackedPage.title || trackedPage.pageType} ${diff.eventType.toLowerCase()}`
          : `${trackedPage.title || trackedPage.pageType} captured for monitoring`,
        summary: diff.summary.join("; "),
        details: `Tracked page crawl completed for ${crawlResult.finalUrl}`,
        importanceScore: diff.priceChanged ? 8 : diff.ctaChanged ? 6 : previousSnapshot ? 5 : 2,
        oldValue: diff.priceChanged
          ? previousSnapshot?.price || null
          : diff.ctaChanged
            ? previousSnapshot?.ctaText || null
            : previousSnapshot?.title || null,
        newValue: diff.priceChanged
          ? snapshot.price || null
          : diff.ctaChanged
            ? snapshot.ctaText || null
            : snapshot.title || null,
        tags: [
          trackedPage.pageType,
          "crawl",
          ...(diff.priceChanged ? ["price"] : []),
          ...(diff.ctaChanged ? ["cta"] : []),
          ...(previousSnapshot ? ["diff"] : ["initial-snapshot"]),
        ],
      });

      changeEventId = changeEvent.id;
    }

    await completeCrawlJob({
      crawlJobId: crawlJob.id,
      status: "success",
      httpStatus: crawlResult.status,
    });

    return {
      trackedPageId: trackedPage.id,
      crawlJobId: crawlJob.id,
      snapshotId: snapshot.id,
      changeEventId,
      changed: diff.changed,
      eventType: diff.eventType,
    };
  } catch (error) {
    await completeCrawlJob({
      crawlJobId: crawlJob.id,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown crawl error",
    });

    return {
      trackedPageId: trackedPage.id,
      crawlJobId: crawlJob.id,
      changed: false,
      error: error instanceof Error ? error.message : "Unknown crawl error",
    };
  }
}
