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
          "Missing OPENAI_API_KEY in environment. Set OPENAI_API_KEY (and optional OPENAI_MODEL) before calling /api/assistant.",
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
        error: "Invalid JSON body.",
      },
      { status: 400 }
    );
  }

  const rawMessages = isObject(body) ? body.messages : undefined;
  const messages = normalizeMessages(rawMessages);

  if (messages.length === 0 || !messages.some((message) => message.role === "user")) {
    return NextResponse.json(
      {
        ok: false,
        error: "messages must include at least one user message.",
      },
      { status: 400 }
    );
  }

  try {
    let responsePayload = await callOpenAI(apiKey, {
      model,
      instructions: getAssistantSystemPrompt(),
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
    const reason = error instanceof Error ? error.message : "Unknown assistant error.";

    return NextResponse.json(
      {
        ok: false,
        error: reason,
        result: {
          ...assistantResponseFallback,
          short_reply: "Can xac minh them.",
          final_status: "manual_review",
        },
      },
      { status: 502 }
    );
  }
}
