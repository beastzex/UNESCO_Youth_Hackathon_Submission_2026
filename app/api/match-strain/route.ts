import { NextRequest, NextResponse } from "next/server";
import { isSameStrain } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { submissionText, existingStrainSummary } = await req.json();
    if (!submissionText || !existingStrainSummary) {
      return NextResponse.json(
        { error: "Missing submissionText or existingStrainSummary" },
        { status: 400 }
      );
    }

    const matchResult = await isSameStrain(submissionText, existingStrainSummary);
    return NextResponse.json(matchResult);
  } catch (error: any) {
    console.error("API /api/match-strain error:", error);
    return NextResponse.json(
      {
        same_strain: false,
        confidence: 0.5,
        reason: "Evaluation completed with fallback",
        error: error?.message,
      },
      { status: 200 }
    );
  }
}
