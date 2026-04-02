import Link from "next/link";
import { DiscoveryReviewClient } from "./discovery-review-client";

type DiscoveryPageProps = {
  searchParams: Promise<{
    competitorId?: string;
  }>;
};

export default async function DiscoveryPage({ searchParams }: DiscoveryPageProps) {
  const params = await searchParams;
  const competitorId = params.competitorId;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Page discovery</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Review discovered pages before monitoring</h1>
        </div>
        <Link href="/competitors/new" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Back to form
        </Link>
      </div>

      <DiscoveryReviewClient competitorId={competitorId} />
    </main>
  );
}
