import { NextRequest, NextResponse } from "next/server";
import {
  assistantResponseFallback,
} from "@/lib/assistant/schemas";
import { getAssistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { callProvider } from "@/lib/assistant/providers";
import { buildIntentScopedSeedContext } from "@/lib/assistant/seed-context";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant";

type IncomingMessage = {
  role: ChatRole;
  content: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

type DiscoveryContext = {
  source: string;
  discovery_stage: string;
  selected_path: string[];
  machine_type: string | null;
  machine_subsystem: string | null;
  symptom: string[];
  urgency: string | null;
  buying_motive: string | null;
  suggested_options: string[];
  avoid_recommendation: string | null;
};

type ParsedContext = {
  input_style: string | null;
  machine_type: string | null;
  machine_subsystem: string | null;
  symptom: string[];
  urgency: string | null;
  buying_motive: string | null;
  suggested_options: string[];
  avoid_recommendation: string | null;
  should_trigger_discovery: boolean;
};

function normalizeDiscoveryContext(raw: unknown): DiscoveryContext | null {
  if (!isObject(raw)) {
    return null;
  }

  return {
    source: toNullableString(raw.source) ?? "discovery_flow",
    discovery_stage: toNullableString(raw.discovery_stage) ?? "none",
    selected_path: toStringArray(raw.selected_path),
    machine_type: toNullableString(raw.machine_type),
    machine_subsystem: toNullableString(raw.machine_subsystem),
    symptom: toStringArray(raw.symptom),
    urgency: toNullableString(raw.urgency),
    buying_motive: toNullableString(raw.buying_motive),
    suggested_options: toStringArray(raw.suggested_options),
    avoid_recommendation: toNullableString(raw.avoid_recommendation),
  };
}

function normalizeParsedContext(raw: unknown): ParsedContext | null {
  if (!isObject(raw)) {
    return null;
  }

  return {
    input_style: toNullableString(raw.input_style),
    machine_type: toNullableString(raw.machine_type),
    machine_subsystem: toNullableString(raw.machine_subsystem),
    symptom: toStringArray(raw.symptom),
    urgency: toNullableString(raw.urgency),
    buying_motive: toNullableString(raw.buying_motive),
    suggested_options: toStringArray(raw.suggested_options),
    avoid_recommendation: toNullableString(raw.avoid_recommendation),
    should_trigger_discovery: raw.should_trigger_discovery === true,
  };
}

function buildAuxiliaryContext(discoveryContext: DiscoveryContext | null, parsedContext: ParsedContext | null): string {
  if (!discoveryContext && !parsedContext) {
    return "";
  }

  const lines: string[] = [];
  lines.push("Ngữ cảnh bổ sung từ giao diện:");

  if (discoveryContext) {
    lines.push(`- source: ${discoveryContext.source}`);
    lines.push(`- discovery_stage: ${discoveryContext.discovery_stage}`);
    lines.push(`- selected_path: ${discoveryContext.selected_path.join(" > ")}`);
    lines.push(`- machine_type: ${discoveryContext.machine_type ?? "null"}`);
    lines.push(`- machine_subsystem: ${discoveryContext.machine_subsystem ?? "null"}`);
    lines.push(`- symptom: ${discoveryContext.symptom.join(", ") || "null"}`);
    lines.push(`- urgency: ${discoveryContext.urgency ?? "null"}`);
    lines.push(`- buying_motive: ${discoveryContext.buying_motive ?? "null"}`);
    lines.push(`- suggested_options: ${discoveryContext.suggested_options.join(", ") || "null"}`);
    lines.push(`- avoid_recommendation: ${discoveryContext.avoid_recommendation ?? "null"}`);
  }

  if (parsedContext) {
    lines.push("- source: parsed_context");
    lines.push(`- parsed_input_style: ${parsedContext.input_style ?? "null"}`);
    lines.push(`- parsed_machine_type: ${parsedContext.machine_type ?? "null"}`);
    lines.push(`- parsed_machine_subsystem: ${parsedContext.machine_subsystem ?? "null"}`);
    lines.push(`- parsed_symptom: ${parsedContext.symptom.join(", ") || "null"}`);
    lines.push(`- parsed_urgency: ${parsedContext.urgency ?? "null"}`);
    lines.push(`- parsed_buying_motive: ${parsedContext.buying_motive ?? "null"}`);
    lines.push(`- parsed_should_trigger_discovery: ${parsedContext.should_trigger_discovery}`);
    lines.push(`- parsed_suggested_options: ${parsedContext.suggested_options.join(", ") || "null"}`);
    lines.push(`- parsed_avoid_recommendation: ${parsedContext.avoid_recommendation ?? "null"}`);
  }

  return lines.join("\n");
}

function normalizeMessages(rawMessages: unknown): IncomingMessage[] {
  if (!Array.isArray(rawMessages)) {
    return [];
  }

  return rawMessages
    .filter(isObject)
    .map((item) => {
      const role: ChatRole = item.role === "assistant" ? "assistant" : "user";
      const content = typeof item.content === "string" ? item.content.trim() : "";

      return {
        role,
        content,
      };
    })
    .filter((item) => item.content.length > 0);
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body JSON không hợp lệ." },
      { status: 400 }
    );
  }

  const rawMessages = isObject(body) ? body.messages : undefined;
  const messages = normalizeMessages(rawMessages);
  const discoveryContext = isObject(body) ? normalizeDiscoveryContext(body.discovery_context) : null;
  const parsedContext = isObject(body) ? normalizeParsedContext(body.parsed_context) : null;
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")
    ?.content ?? "";
  const seedSupplement = buildIntentScopedSeedContext({
    latestUserMessage,
    parsedContext,
    discoveryContext,
  });
  const contextSupplement = buildAuxiliaryContext(discoveryContext, parsedContext);
  const instructions = [getAssistantSystemPrompt(), seedSupplement, contextSupplement]
    .filter((line) => line.trim().length > 0)
    .join("\n\n");

  if (messages.length === 0 || !messages.some((message) => message.role === "user")) {
    return NextResponse.json(
      { ok: false, error: "messages phải có ít nhất một user message." },
      { status: 400 }
    );
  }

  try {
    const providerResult = await callProvider({ messages, instructions });

    if (!providerResult.ok) {
      return NextResponse.json(
        { ok: false, error: providerResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      provider: providerResult.provider,
      model_used: providerResult.model,
      result: providerResult.result,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Lỗi trợ lý không xác định.";
    console.error(`[assistant] provider error:`, reason);

    return NextResponse.json(
      {
        ok: false,
        error: "Hệ thống tạm chưa sẵn sàng.",
        detail: reason,
        result: {
          ...assistantResponseFallback,
          short_reply: "Cần xác minh thêm.",
          final_status: "manual_review",
        },
      },
      { status: 502 }
    );
  }
}
