import { NextRequest, NextResponse } from "next/server";
import { executeAssistantToolCall, assistantToolDefinitions } from "@/lib/assistant/tools";
import {
  assistantResponseFallback,
  assistantStructuredOutput,
  coerceAssistantResponse,
} from "@/lib/assistant/schemas";
import { getAssistantSystemPrompt } from "@/lib/assistant/system-prompt";

export const runtime = "nodejs";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5-mini";
const MAX_TOOL_ROUNDS = 6;

type ChatRole = "user" | "assistant";

type IncomingMessage = {
  role: ChatRole;
  content: string;
};

type FunctionCallOutput = {
  type: "function_call_output";
  call_id: string;
  output: string;
};

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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseJson(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

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

function extractFunctionCalls(responsePayload: unknown): Array<{ name: string; call_id: string; arguments: unknown }> {
  if (!isObject(responsePayload) || !Array.isArray(responsePayload.output)) {
    return [];
  }

  return responsePayload.output
    .filter(isObject)
    .filter((item) => item.type === "function_call")
    .map((item) => ({
      name: typeof item.name === "string" ? item.name : "",
      call_id: typeof item.call_id === "string" ? item.call_id : "",
      arguments: item.arguments,
    }))
    .filter((item) => item.name.length > 0 && item.call_id.length > 0);
}

function extractOutputText(responsePayload: unknown): string {
  if (!isObject(responsePayload)) {
    return "";
  }

  if (typeof responsePayload.output_text === "string" && responsePayload.output_text.trim().length > 0) {
    return responsePayload.output_text;
  }

  if (!Array.isArray(responsePayload.output)) {
    return "";
  }

  const chunks: string[] = [];

  responsePayload.output.filter(isObject).forEach((item) => {
    if (item.type !== "message" || !Array.isArray(item.content)) {
      return;
    }

    item.content.filter(isObject).forEach((contentItem) => {
      if (contentItem.type === "output_text" && typeof contentItem.text === "string") {
        chunks.push(contentItem.text);
      }
    });
  });

  return chunks.join("\n").trim();
}

function normalizeToolArguments(rawArguments: unknown): Record<string, unknown> {
  if (typeof rawArguments === "string") {
    const parsed = parseJson(rawArguments);
    return isObject(parsed) ? parsed : {};
  }

  return isObject(rawArguments) ? rawArguments : {};
}

function buildToolOutputs(responsePayload: unknown): FunctionCallOutput[] {
  const calls = extractFunctionCalls(responsePayload);

  return calls.map((call) => {
    const args = normalizeToolArguments(call.arguments);
    const result = executeAssistantToolCall(call.name, args);

    return {
      type: "function_call_output",
      call_id: call.call_id,
      output: JSON.stringify(result),
    };
  });
}

async function callOpenAI(apiKey: string, payload: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI Responses API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Thiếu OPENAI_API_KEY trong môi trường. Hãy cấu hình OPENAI_API_KEY (và tùy chọn OPENAI_MODEL) trước khi gọi /api/assistant.",
      },
      { status: 500 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Body JSON không hợp lệ.",
      },
      { status: 400 }
    );
  }

  const rawMessages = isObject(body) ? body.messages : undefined;
  const messages = normalizeMessages(rawMessages);
  const discoveryContext = isObject(body) ? normalizeDiscoveryContext(body.discovery_context) : null;
  const parsedContext = isObject(body) ? normalizeParsedContext(body.parsed_context) : null;
  const contextSupplement = buildAuxiliaryContext(discoveryContext, parsedContext);
  const instructions = [getAssistantSystemPrompt(), contextSupplement]
    .filter((line) => line.trim().length > 0)
    .join("\n\n");

  if (messages.length === 0 || !messages.some((message) => message.role === "user")) {
    return NextResponse.json(
      {
        ok: false,
        error: "messages phải có ít nhất một user message.",
      },
      { status: 400 }
    );
  }

  try {
    let responsePayload = await callOpenAI(apiKey, {
      model,
      instructions,
      input: messages,
      tools: assistantToolDefinitions,
      text: {
        format: assistantStructuredOutput,
      },
      temperature: 0,
    });

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const toolOutputs = buildToolOutputs(responsePayload);

      if (toolOutputs.length === 0) {
        break;
      }

      responsePayload = await callOpenAI(apiKey, {
        model,
        previous_response_id: isObject(responsePayload) ? responsePayload.id : undefined,
        input: toolOutputs,
        tools: assistantToolDefinitions,
        text: {
          format: assistantStructuredOutput,
        },
        temperature: 0,
      });
    }

    const outputText = extractOutputText(responsePayload);
    const parsedPayload = parseJson(outputText);
    const result = coerceAssistantResponse(parsedPayload);

    return NextResponse.json({
      ok: true,
      model_used: model,
      result,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Lỗi trợ lý không xác định.";

    return NextResponse.json(
      {
        ok: false,
        error: "Hệ thống AI tạm thời chưa sẵn sàng.",
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
