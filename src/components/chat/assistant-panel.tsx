"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, SendHorizonal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  applyDiscoverySelection,
  buildDiscoveryContext,
  createInitialDiscoveryState,
  getPromptForStage,
  type DiscoveryPrompt,
  type DiscoveryState,
} from "@/lib/assistant/discovery-flow";
import { parseIntentInput, type ParsedIntent } from "@/lib/assistant/intent-parser";
import {
  coerceAssistantResponse,
  type AssistantStructuredResponse,
} from "@/lib/assistant/schemas";

type ChatRole = "user" | "assistant";

type UiMessage = {
  id: string;
  role: ChatRole;
  text: string;
  payload?: AssistantStructuredResponse;
};

type AssistantPanelProps = {
  open: boolean;
  onClose: () => void;
};

const defaultGreeting =
  "Chào anh/chị, em hỗ trợ tra mã vật tư kỹ thuật. Anh/chị có thể gửi mã cũ, ảnh tem, kích thước hoặc mô tả hệ máy để em hỗ trợ nhanh.";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatAssistantReply(payload: AssistantStructuredResponse): string {
  if (payload.final_status === "ready" && payload.recommended_items.length > 0) {
    const topItems = payload.recommended_items.slice(0, 3);
    const lines = [payload.short_reply.trim() || "Đã tìm được phương án mã phù hợp."];

    lines.push("Mã đề xuất:");
    topItems.forEach((item) => {
      lines.push(`- ${item.exact_code} (${item.brand})`);
    });

    lines.push(`Nhãn hàng đề xuất: ${topItems.map((item) => item.brand).join(", ")}`);
    lines.push(`Căn cứ chọn: ${topItems[0]?.reason ?? "Cần xác minh thêm."}`);
    lines.push(`Lưu ý dễ nhầm: ${topItems[0]?.caution ?? "Cần xác minh thêm."}`);

    if (payload.avoid_recommendation) {
      lines.push(`Không nên dùng: ${payload.avoid_recommendation}`);
    }

    lines.push("Giá: liên hệ báo trực tiếp.");
    lines.push("Tình trạng hàng: xác nhận riêng.");

    return lines.join("\n");
  }

  if (payload.final_status === "not_found_in_system" || payload.intent === "not_in_catalog") {
    return [
      payload.short_reply.trim() || "Chưa có dữ liệu mã trong hệ thống.",
      "Chưa có dữ liệu mã trong hệ thống.",
      "Cần xác minh thêm hoặc ngoài danh mục đang hỗ trợ.",
      "Tạm thời chưa báo mã để tránh sai.",
    ].join("\n");
  }

  const missingText =
    payload.missing_fields.length > 0
      ? payload.missing_fields.join(", ")
      : "mã cũ, ảnh tem, kích thước hoặc cụm máy";

  const lines = [
    payload.short_reply.trim() || "Chưa thể chốt mã.",
    "Chưa thể chốt mã.",
    `Cần thêm: ${missingText}`,
    "Ưu tiên gửi: mã cũ, ảnh tem, kích thước, ứng dụng thực tế.",
    "Tạm thời chưa báo mã để tránh sai.",
  ];

  if (payload.next_question) {
    lines.push(`Câu hỏi tiếp theo: ${payload.next_question}`);
  }

  if (payload.avoid_recommendation) {
    lines.push(`Không nên dùng: ${payload.avoid_recommendation}`);
  }

  return lines.join("\n");
}

function toApiMessages(messages: UiMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.text,
  }));
}

export function AssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: createId(),
      role: "assistant",
      text: defaultGreeting,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discoveryState, setDiscoveryState] = useState<DiscoveryState>(() => createInitialDiscoveryState());
  const [discoveryPrompt, setDiscoveryPrompt] = useState<DiscoveryPrompt | null>(() => getPromptForStage("greeting"));
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSubmitting, open, discoveryPrompt]);

  async function requestAssistant(
    history: UiMessage[],
    parsedContext: ParsedIntent | null,
    overrideDiscoveryState?: DiscoveryState
  ) {
    const effectiveDiscoveryState = overrideDiscoveryState ?? discoveryState;
    const hasDiscoveryContext = effectiveDiscoveryState.selectedPath.length > 0;
    const discoveryContext = hasDiscoveryContext ? buildDiscoveryContext(effectiveDiscoveryState) : null;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: toApiMessages(history),
          discovery_context: discoveryContext,
          parsed_context: parsedContext,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        result?: unknown;
      };

      if (!response.ok || !payload.ok) {
        const text = payload.error?.trim().length ? payload.error : "Hệ thống AI tạm thời chưa sẵn sàng.";

        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            text,
          },
        ]);

        return;
      }

      const structured = coerceAssistantResponse(payload.result);

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          text: formatAssistantReply(structured),
          payload: structured,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          text: "Kết nối đang bị gián đoạn.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDiscoveryOption(option: string) {
    if (!discoveryPrompt || isSubmitting) {
      return;
    }

    const userMessage: UiMessage = {
      id: createId(),
      role: "user",
      text: option,
    };

    const historyAfterUser = [...messages, userMessage];
    setMessages(historyAfterUser);

    const transition = applyDiscoverySelection(discoveryState, option);
    setDiscoveryState(transition.nextState);
    setDiscoveryPrompt(transition.nextPrompt);

    const nextPrompt = transition.nextPrompt;

    if (nextPrompt) {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          text: nextPrompt.message,
        },
      ]);
      return;
    }

    if (transition.shouldSubmit) {
      const notifyMessage: UiMessage = {
        id: createId(),
        role: "assistant",
        text: "Em đã ghi nhận ngữ cảnh. Em sẽ đối chiếu và đề xuất ngắn gọn ngay.",
      };

      const historyBeforeApi = [...historyAfterUser, notifyMessage];
      setMessages(historyBeforeApi);

      await requestAssistant(historyBeforeApi, transition.nextState.parsed, transition.nextState);
    }
  }

  async function submitMessage(rawText: string) {
    const content = rawText.trim();

    if (!content || isSubmitting) {
      return;
    }

    const parsed = parseIntentInput(content);

    const userMessage: UiMessage = {
      id: createId(),
      role: "user",
      text: content,
    };

    const historyAfterUser = [...messages, userMessage];
    setMessages(historyAfterUser);
    setInputValue("");

    if (parsed.should_trigger_discovery) {
      if (!discoveryPrompt) {
        setDiscoveryState(createInitialDiscoveryState());
        setDiscoveryPrompt(getPromptForStage("greeting"));
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          text:
            parsed.next_question ??
            "Anh/chị chọn nhanh một hướng bên dưới để em hỏi đúng thông tin cần thiết.",
        },
      ]);
      return;
    }

    setDiscoveryPrompt(null);
    setDiscoveryState((prev) => ({ ...prev, stage: "none" }));
    await requestAssistant(historyAfterUser, parsed);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-slate-900">Tra mã nhanh</h3>
          <p className="mt-1 text-xs text-slate-600">
            Gửi mã cũ, ảnh tem, kích thước hoặc ứng dụng để được hỗ trợ tra mã.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={onClose}
          aria-label="Đóng trợ lý tra mã"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-3 px-4 py-3">
        {discoveryPrompt && discoveryPrompt.options.length > 0 && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <p className="px-1 text-[11px] text-slate-700">{discoveryPrompt.message}</p>
            <p className="px-1 text-[11px] font-medium text-slate-600">Lựa chọn nhanh theo nhu cầu:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {discoveryPrompt.options.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-8 whitespace-normal border-slate-300 px-2 py-2 text-left text-xs text-slate-700"
                  onClick={() => void handleDiscoveryOption(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "assistant"
                  ? "mr-6 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-slate-800"
                  : "ml-6 rounded-xl bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white"
              }
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          ))}
          {isSubmitting && (
            <div className="mr-6 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-slate-700">
              <Loader2 className="size-3 animate-spin" />
              Đang tra mã...
            </div>
          )}
          <div ref={bottomAnchorRef} />
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100">
            <ImagePlus className="size-3.5" />
            Tải ảnh (mock)
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setSelectedFileName(file?.name ?? "");
              }}
            />
          </label>
          {selectedFileName && <p className="truncate text-xs text-slate-500">{selectedFileName}</p>}
        </div>

        <div className="space-y-2">
          <Textarea
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submitMessage(inputValue);
              }
            }}
            placeholder="Nhập mã cũ, kích thước hoặc ứng dụng cần tra..."
            className="min-h-20 resize-none bg-white"
          />
          <Button
            type="button"
            className="h-9 w-full bg-amber-800 text-xs text-white hover:bg-amber-900"
            onClick={() => void submitMessage(inputValue)}
            disabled={isSubmitting || inputValue.trim().length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 size-3.5 animate-spin" />
                Đang xử lý
              </>
            ) : (
              <>
                <SendHorizonal className="mr-1 size-3.5" />
                Gửi yêu cầu tra mã
              </>
            )}
          </Button>
        </div>

        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
          Chatbot ưu tiên trả lời ngắn, theo ứng dụng thực tế. Giá và tình trạng hàng được xác nhận riêng.
        </p>
      </div>
    </div>
  );
}
