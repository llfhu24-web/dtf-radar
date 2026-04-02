import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Create .env or export DATABASE_URL before running seed.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@dtfradar.local" },
    update: {},
    create: {
      email: "demo@dtfradar.local",
      name: "DTF Radar Demo User",
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: "workspace_demo" },
    update: {
      userId: user.id,
      name: "DTF Radar Demo Workspace",
    },
    create: {
      id: "workspace_demo",
      userId: user.id,
      name: "DTF Radar Demo Workspace",
    },
  });

  const competitors = await Promise.all([
    prisma.competitor.upsert({
      where: { id: "demo_competitor_printpro" },
      update: {
        workspaceId: workspace.id,
        name: "PrintPro Supply",
        websiteUrl: "https://printprosupply.example.com",
        region: "US",
        note: "Focus on hot peel film, powders, starter kits, and wholesale offers.",
        status: "active",
      },
      create: {
        id: "demo_competitor_printpro",
        workspaceId: workspace.id,
        name: "PrintPro Supply",
        websiteUrl: "https://printprosupply.example.com",
        region: "US",
        note: "Focus on hot peel film, powders, starter kits, and wholesale offers.",
        status: "active",
      },
    }),
    prisma.competitor.upsert({
      where: { id: "demo_competitor_colorfilm" },
      update: {
        workspaceId: workspace.id,
        name: "ColorFilm Direct",
        websiteUrl: "https://colorfilmdirect.example.com",
        region: "UK",
        note: "Track sample packs, matte film messaging, and bundle experiments.",
        status: "active",
      },
      create: {
        id: "demo_competitor_colorfilm",
        workspaceId: workspace.id,
        name: "ColorFilm Direct",
        websiteUrl: "https://colorfilmdirect.example.com",
        region: "UK",
        note: "Track sample packs, matte film messaging, and bundle experiments.",
        status: "active",
      },
    }),
  ]);

  const trackedPages = await Promise.all([
    prisma.trackedPage.upsert({
      where: { id: "demo_page_printpro_product" },
      update: {
        competitorId: competitors[0].id,
        url: "https://printprosupply.example.com/products/60cm-hot-peel-film",
        pageType: "product",
        title: "60cm Hot Peel Film",
        discoverySource: "seed",
        priority: 0,
        isActive: true,
      },
      create: {
        id: "demo_page_printpro_product",
        competitorId: competitors[0].id,
        url: "https://printprosupply.example.com/products/60cm-hot-peel-film",
        pageType: "product",
        title: "60cm Hot Peel Film",
        discoverySource: "seed",
        priority: 0,
        isActive: true,
      },
    }),
    prisma.trackedPage.upsert({
      where: { id: "demo_page_printpro_wholesale" },
      update: {
        competitorId: competitors[0].id,
        url: "https://printprosupply.example.com/pages/wholesale",
        pageType: "landing",
        title: "Wholesale Program",
        discoverySource: "seed",
        priority: 1,
        isActive: true,
      },
      create: {
        id: "demo_page_printpro_wholesale",
        competitorId: competitors[0].id,
        url: "https://printprosupply.example.com/pages/wholesale",
        pageType: "landing",
        title: "Wholesale Program",
        discoverySource: "seed",
        priority: 1,
        isActive: true,
      },
    }),
    prisma.trackedPage.upsert({
      where: { id: "demo_page_colorfilm_sample" },
      update: {
        competitorId: competitors[1].id,
        url: "https://colorfilmdirect.example.com/products/sample-pack",
        pageType: "product",
        title: "Starter Sample Pack",
        discoverySource: "seed",
        priority: 0,
        isActive: true,
      },
      create: {
        id: "demo_page_colorfilm_sample",
        competitorId: competitors[1].id,
        url: "https://colorfilmdirect.example.com/products/sample-pack",
        pageType: "product",
        title: "Starter Sample Pack",
        discoverySource: "seed",
        priority: 0,
        isActive: true,
      },
    }),
  ]);

  await Promise.all([
    prisma.changeEvent.upsert({
      where: { id: "demo_event_price_drop" },
      update: {
        competitorId: competitors[0].id,
        trackedPageId: trackedPages[0].id,
        eventType: "Price change",
        title: "60cm hot peel film price dropped from $89 to $79",
        summary: "A core DTF film SKU moved down by 11.2%, suggesting an active promotion push.",
        details: "Price moved without spec changes, which often indicates short-term conversion or inventory pressure.",
        importanceScore: 9,
        oldValue: "$89",
        newValue: "$79",
        tagsJson: ["hot peel", "price", "core SKU"],
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      create: {
        id: "demo_event_price_drop",
        competitorId: competitors[0].id,
        trackedPageId: trackedPages[0].id,
        eventType: "Price change",
        title: "60cm hot peel film price dropped from $89 to $79",
        summary: "A core DTF film SKU moved down by 11.2%, suggesting an active promotion push.",
        details: "Price moved without spec changes, which often indicates short-term conversion or inventory pressure.",
        importanceScore: 9,
        oldValue: "$89",
        newValue: "$79",
        tagsJson: ["hot peel", "price", "core SKU"],
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    }),
    prisma.changeEvent.upsert({
      where: { id: "demo_event_new_product" },
      update: {
        competitorId: competitors[1].id,
        trackedPageId: trackedPages[2].id,
        eventType: "New product",
        title: "New sample pack page launched",
        summary: "The sample pack suggests a lower-friction entry offer for first-time buyers.",
        details: "This launch highlights starter positioning and smaller trial orders for distributors.",
        importanceScore: 8,
        tagsJson: ["sample pack", "starter", "new product"],
        detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      create: {
        id: "demo_event_new_product",
        competitorId: competitors[1].id,
        trackedPageId: trackedPages[2].id,
        eventType: "New product",
        title: "New sample pack page launched",
        summary: "The sample pack suggests a lower-friction entry offer for first-time buyers.",
        details: "This launch highlights starter positioning and smaller trial orders for distributors.",
        importanceScore: 8,
        tagsJson: ["sample pack", "starter", "new product"],
        detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    }),
    prisma.changeEvent.upsert({
      where: { id: "demo_event_cta_change" },
      update: {
        competitorId: competitors[0].id,
        trackedPageId: trackedPages[1].id,
        eventType: "CTA change",
        title: "Homepage CTA changed to 'Request wholesale quote'",
        summary: "Homepage traffic may be shifting toward B2B lead capture instead of direct browsing.",
        details: "The messaging suggests higher-intent wholesale funneling rather than pure catalog navigation.",
        importanceScore: 3,
        oldValue: "Shop now",
        newValue: "Request wholesale quote",
        tagsJson: ["CTA", "B2B", "wholesale"],
        detectedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      },
      create: {
        id: "demo_event_cta_change",
        competitorId: competitors[0].id,
        trackedPageId: trackedPages[1].id,
        eventType: "CTA change",
        title: "Homepage CTA changed to 'Request wholesale quote'",
        summary: "Homepage traffic may be shifting toward B2B lead capture instead of direct browsing.",
        details: "The messaging suggests higher-intent wholesale funneling rather than pure catalog navigation.",
        importanceScore: 3,
        oldValue: "Shop now",
        newValue: "Request wholesale quote",
        tagsJson: ["CTA", "B2B", "wholesale"],
        detectedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log("Seed complete for workspace:", workspace.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
