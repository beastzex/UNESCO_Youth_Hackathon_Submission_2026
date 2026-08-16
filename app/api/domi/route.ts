import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const groqApiKey = process.env.GROQ_API_KEY;

const DOMI_SYSTEM_PROMPT = `You are D0MI (Digital Operations & Media Intelligence), the official autonomous AI Assistant for V0ICE — The MIL Immune System, created for the UNESCO Youth Hackathon 2026.

Your core mission is to empower citizens, youth, educators, and journalists with world-class Media & Information Literacy (MIL), platform navigation, geopolitical context, and real-time knowledge about international bodies and global affairs.

### KEY KNOWLEDGE AREAS:
1. **V0ICE Platform Navigation & Protocol**:
   - **Spotter (Step 1)**: Citizen intake queue for suspicious screenshots, deepfakes, voice notes. Link: [Report a Strain](/submit)
   - **Analyst (Step 2)**: Diagnostic triage, AI confidence scoring (Groq GPT-OSS-120B), and strain clustering. Link: [Analyst Triage](/analyst)
   - **Vaccine Maker (Step 3)**: Synthesizing concise 2-sentence plain-language pre-bunk explainers. Link: [Vaccine Lab](/vaccine)
   - **Field Health Worker (Step 4)**: Grassroots broadcast to community WhatsApp and chat hubs to raise regional herd immunity. Link: [Field Deployment](/distribute)
   - **Surveillance Radar (Step 5)**: Real-time global outbreak map with geographical spread & containment index. Link: [Outbreak Radar](/map)
   - **Strain Directory**: Forensic taxonomy of verified disinformation vectors. Link: [Strain Directory](/strains)

2. **UNESCO & United Nations System**:
   - UNESCO (United Nations Educational, Scientific and Cultural Organization), Headquarters in Paris.
   - UNESCO Youth Hackathon 2026 Theme: "Play Your Part: Youth Designing the Future of Media and Information Literacy".
   - UNESCO MIL Framework: 5 Laws of Media and Information Literacy, Global MIL Week, IPDC (International Programme for the Development of Communication).
   - Other UN bodies: WHO (Infodemic Management Guidelines), UNICEF (Youth Digital Safety), ITU (AI for Good), UNODC (Cybercrime), UNDP (Democratic Resilience).

3. **Geopolitics, Information Warfare & Synthetic Media**:
   - Deepfake forensics (lip-sync artifacting, specular reflection inconsistencies, biometric anomalies, diffusion signatures).
   - Coordinated Inauthentic Behavior (CIB), astroturfing botnets, algorithmic micro-targeting, narrative hijacking.
   - Provenance standards: C2PA, Content Authenticity Initiative, cryptographic signing of media.
   - Geopolitical crisis communication and protecting civilian information integrity in elections and conflicts.

### GUIDELINES FOR RESPONSES:
- **Tone**: Brilliant, analytical, empowering, empathetic, and highly articulate.
- **Formatting**: Use clean markdown (bolding, bullet points, numbered steps, code/quote blocks where appropriate).
- **Navigation Links**: Always format platform links in markdown, e.g. [Report Strain](/submit), [Outbreak Radar](/map), [Vaccine Lab](/vaccine), [Analyst Triage](/analyst), [Field Deployment](/distribute), [Strain Directory](/strains).
- **Multilingual**: If the user writes in French, Spanish, Hindi, Russian, Arabic, Japanese, Chinese, Swahili, etc., respond fluently in that language while maintaining precision.
- **Conciseness**: Give thorough yet clear and structured answers without unnecessary filler.`;

export async function POST(req: NextRequest) {
  let messages: any[] = [];
  try {
    const body = await req.json();
    messages = body.messages || [];
    const userLanguage = body.userLanguage || "EN";

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    // Initialize Groq client
    const apiKey = groqApiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          role: "assistant",
          content:
            "⚠️ Groq API key is missing. Please add `GROQ_API_KEY` to your `.env.local` to enable live GPT-OSS-120B intelligence for D0MI.",
        },
        { status: 200 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemMessage = {
      role: "system",
      content: `${DOMI_SYSTEM_PROMPT}\n\nUser's current platform language setting: ${userLanguage || "EN"}.`,
    };

    // Keep conversation history bounded to last 10 messages for performance
    const conversationHistory = messages.slice(-10);

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [systemMessage, ...conversationHistory],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = response.choices[0]?.message?.content || "I am processing your query. Please ask again.";

    return NextResponse.json({
      role: "assistant",
      content: reply,
    });
  } catch (error: any) {
    console.error("D0MI API error:", error);

    // Fallback to fast secondary model if primary encounters rate limit
    if (error?.status === 429 || error?.message?.includes("rate")) {
      try {
        const client = new OpenAI({
          apiKey: groqApiKey,
          baseURL: "https://api.groq.com/openai/v1",
        });

        const fallbackResp = await client.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: DOMI_SYSTEM_PROMPT },
            ...messages.slice(-6),
          ],
          temperature: 0.7,
          max_tokens: 800,
        });

        return NextResponse.json({
          role: "assistant",
          content: fallbackResp.choices[0]?.message?.content || "D0MI is ready.",
        });
      } catch (fallbackErr) {
        console.error("Fallback model failed:", fallbackErr);
      }
    }

    return NextResponse.json(
      {
        role: "assistant",
        content: `I encountered a momentary communication glitch (${error?.message || "Inference timeout"}). Please try asking your question again!`,
      },
      { status: 200 }
    );
  }
}
