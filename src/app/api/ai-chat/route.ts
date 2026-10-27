import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { CatalogItem } from "@/data/catalog";
import { CATALOG_DATA } from "@/data/catalog";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB limit for base64 payload

// Build a compact catalog summary for the system prompt using array join
// (avoids template-literal quoting issues)
function buildCatalogSummary(items: CatalogItem[]): string {
  const lines: string[] = ["CATALOG (48 items - recommend ONLY by these IDs):"];
  lines.push("");
  items.map(
    (item) =>
      lines.push(
        `- "${item.id}": ${item.name} | ${item.category} | ${item.color} | "${item.style}" | $${item.price}`
      )
  );
  lines.push("");
  lines.push(
    'Example format for recommended_item_ids: ["top-01", "dress-03", "jewel-07"]'
  );
  return lines.join("\n");
}

const CATALOG_SUMMARY = buildCatalogSummary(CATALOG_DATA);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateImageDataUrl(url: string): { valid: boolean; sizeBytes?: number; error?: string } {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "Invalid image data URL" };
  }
  if (!url.startsWith("data:image/")) {
    return { valid: false, error: "image_data_url must start with 'data:image/' (e.g. data:image/jpeg or data:image/png)" };
  }
  try {
    const base64Part = url.split(",")[1];
    if (!base64Part) {
      return { valid: false, error: "Image data URL missing base64 payload" };
    }
    // Estimate decoded size: base64 4 chars = 3 bytes
    const estimatedBytes = Math.ceil((base64Part.length * 3) / 4);
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      const mb = (estimatedBytes / (1024 * 1024)).toFixed(1);
      return { valid: false, error: `Image too large (${mb}MB). Maximum 2MB. Please upload a smaller image.` };
    }
    return { valid: true, sizeBytes: estimatedBytes };
  } catch {
    return { valid: false, error: "Failed to parse image data URL" };
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Validate Gemini API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  // 2. Parse request body
  let body: {
    session_id?: string;
    message?: string;
    image_data_url?: string | null;
    user_profile?: object | null;
    conversation_history?: Array<{ role: string; content: string }>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  // 3. Extract fields with defaults
  const {
    session_id,
    message,
    image_data_url = null,
    user_profile = null,
    conversation_history = [],
  } = body;

  // 4. Validate: must have either message or image
  if (!message && !image_data_url) {
    return NextResponse.json(
      { ok: false, error: "Either 'message' or 'image_data_url' must be provided in the request." },
      { status: 400 }
    );
  }

  // 5. Validate image if provided
  if (image_data_url) {
    const validation = validateImageDataUrl(image_data_url);
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: 400 }
      );
    }
  }

  // 6. Build the OpenAI chat messages
  const client = new OpenAI({ apiKey, baseURL: GEMINI_BASE_URL });

  // --- Build system prompt parts using array join (safe, no template-literal issues) ---
  const profileParts: string[] = [];

  if (user_profile) {
    // Type-assert user_profile to access its properties
    const up = user_profile as {
      seasonal_palette?: string;
      body_shape?: string;
      style_preference?: string;
      measurements?: number[] | { width: number; height: number };
    };
    const palette = up.seasonal_palette || "unknown";
    const bodyShape = up.body_shape || "unknown";
    const stylePreference = up.style_preference || "none";
    const measurementsJSON = JSON.stringify(up.measurements);
    profileParts.push(`- User profile: seasonal_palette="${palette}", body_shape="${bodyShape}", measurements: ${measurementsJSON}, style_preference="${stylePreference}"`);
  } else {
    profileParts.push("- No user profile available for this session.");
  }

  const catalogInstructions = [
    "- You MUST recommend ONLY items that appear in the catalog above.",
    "- Return recommended_item_ids using the exact catalog IDs (e.g., \"top-01\", \"dress-03\", \"jewel-07\").",
    "- If no catalog items match the user's request or profile, respond honestly and return an empty recommended_item_ids array.",
    "- Provide a natural language response in \"response_text\".",
    "- Output YOUR RESPONSE AS A JSON OBJECT with exactly two keys:",
    '  {',
    '    "response_text": "your natural language answer here",',
    '    "recommended_item_ids": ["ID1", "ID2"]',
    "  }",
    "- Do not include any other keys, prose explanations, or formatting outside the JSON.",
    "- You may reference the user's palette, body shape, and style preferences when making recommendations.",
    "- For image-based requests: analyze the image and then provide styling guidance referencing the catalog.",
    "CONVERSATION HISTORY: Maintain context from prior turns. Reference previous messages naturally."
  ];

  const systemPrompt = [
    "You are LumiFit AI Stylist, a personalized fashion assistant for the LumiFit application.",
    "",
    ...profileParts,
    "",
    CATALOG_SUMMARY,
    "",
    ...catalogInstructions,
  ].join("\n");

  // Message content types
type TextMsg = { text: string };
type ImageVideoMsg = { type: string; image_url?: { url: string } };

// Build the message array  
  const messages: Array<{ role: string; content: unknown }> = [
    { role: "system", content: systemPrompt },
  ];

  // Build user content
  const userContentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  if (image_data_url) {
    userContentParts.push({
      type: "image_url",
      image_url: { url: image_data_url },
    });
  }
  if (message) {
    userContentParts.push({ type: "text", text: message });
  }

  // If there's conversation history, add it as prior messages
  const allConversationHistory = [
    ...(conversation_history.slice(-6) || []), // last 6 turns
  ];

  // Add prior conversation as assistant/user messages
  for (const turn of allConversationHistory) {
    messages.push({
      role: turn.role,
      content:
        typeof turn.content === "string"
          ? turn.content
          : JSON.stringify(turn.content),
    });
  }

  // Add current user message/image
  messages.push({
    role: "user",
    content: userContentParts.length === 1 ? userContentParts[0].text : userContentParts,
  });

  // 7. Call OpenAI with JSON mode
  let completion;
  try {
    // Type assertion: messages array content types are compatible with OpenAI SDK
    completion = await client.chat.completions.create({
      model: GEMINI_MODEL,
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to communicate with the Gemini API." },
      { status: 500 }
    );
  }

  // 8. Parse the model's JSON response
  const rawContent = completion.choices[0]?.message?.content || "{}";
  let parsed: { response_text: string; recommended_item_ids: string[] };
  try {
    parsed = JSON.parse(rawContent);
    // Ensure types are correct
    if (typeof parsed.response_text !== "string") {
      parsed.response_text = String(parsed.response_text || "I'm not sure how to help with that.");
    }
    if (!Array.isArray(parsed.recommended_item_ids)) {
      parsed.recommended_item_ids = [];
    }
  } catch {
    // Fallback if model didn't output valid JSON
    parsed = {
      response_text:
        rawContent ||
        "I'm not sure how to help with that. Please try rephrasing your question.",
      recommended_item_ids: [],
    };
  }

  // 9. Validate recommended_item_ids against the REAL imported catalog
  const filteredRecommendedIds = parsed.recommended_item_ids.filter(
    (id: string) => CATALOG_DATA.some((item) => item.id === id)
  );

  // 10. Return successful response
  return NextResponse.json({
    ok: true,
    response_text: parsed.response_text,
    recommended_item_ids: filteredRecommendedIds,
  });
}