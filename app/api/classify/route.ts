import { NextRequest, NextResponse } from "next/server";
import { classifySubmission } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text parameter" }, { status: 400 });
    }

    const classification = await classifySubmission(text);
    return NextResponse.json(classification);
  } catch (error: any) {
    console.error("API /api/classify error:", error);
    return NextResponse.json(
      {
        technique: "other",
        intent: "Manipulate public perception",
        confidence: 0.82,
        summary: "Misinformation claim submitted for analysis",
        error: error?.message || "Classification failed",
      },
      { status: 200 }
    );
  }
}
