import { NextResponse } from "next/server";
import { createChangeEvent } from "@/lib/repositories/change-event-repository";
import { createChangeEventSchema } from "@/lib/validations/change-event";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = createChangeEventSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const event = await createChangeEvent(parsed.data);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/change-events failed", error);
    return NextResponse.json({ error: "Failed to create change event" }, { status: 500 });
  }
}
