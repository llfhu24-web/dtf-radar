import { NextResponse } from "next/server";
import { alerts } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ items: alerts });
}
