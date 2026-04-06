"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, SendHorizonal, X } from "lucide-react";
import { AssistantMessage } from "./assistant-message";
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
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

type UiMessage = {
  id: string;
  role: ChatRole;
  text: string;
  payload?: AssistantStructuredResponse;
};

type AssistantPanelProps = {
  mode: "mobile" | "desktop";
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

export function AssistantPanel({ mode, onClose }: AssistantPanelProps) {
  const isMobile = mode === "mobile";

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
    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSubmitting, discoveryPrompt]);

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

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border border-slate-200/80 bg-white/95 text-slate-900",
        "shadow-[0_28px_60px_-34px_rgba(15,23,42,0.5)]",
        isMobile
          ? "h-[82dvh] max-h-[calc(100dvh-1rem)] w-full rounded-[1.4rem]"
          : "h-[min(82vh,720px)] w-[min(92vw,400px)] rounded-[1.35rem]"
      )}
      role="dialog"
      aria-label="Tra mã nhanh"
    >
      <div
        className={cn(
          "shrink-0 border-b border-slate-200/80 bg-white/90 px-4 pb-3 pt-3 backdrop-blur",
          isMobile ? "pt-[calc(0.7rem+env(safe-area-inset-top))]" : ""
        )}
      >
        {isMobile && <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-slate-300/75" />}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold tracking-tight text-slate-900">Tra mã nhanh</h3>
            <p className="mt-1 text-[12px] leading-5 text-slate-600 sm:text-xs">
              Gửi mã cũ, ảnh tem, kích thước hoặc mô tả hệ máy để được hỗ trợ nhanh.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mt-0.5 shrink-0 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            onClick={onClose}
            aria-label="Đóng trợ lý tra mã"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#fffdf8] via-white to-white">
        {discoveryPrompt && discoveryPrompt.options.length > 0 && (
          <div className="shrink-0 border-b border-slate-200/75 bg-amber-50/55 px-3 py-3 sm:px-4">
            <p className="text-[12px] leading-5 text-slate-700">{discoveryPrompt.message}</p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">Lựa chọn nhanh</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {discoveryPrompt.options.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto min-h-9 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-700 shadow-sm hover:border-amber-200 hover:bg-amber-50 hover:text-amber-900 focus-visible:ring-2 focus-visible:ring-amber-300"
                  onClick={() => void handleDiscoveryOption(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-scroll-area flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4">
          {messages.map((message) => (
            <AssistantMessage key={message.id} role={message.role} text={message.text} />
          ))}

          {isSubmitting && (
            <div className="flex w-full justify-start pr-10">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-3 py-2 text-[13px] text-slate-700 shadow-sm sm:text-sm">
                <Loader2 className="size-3.5 animate-spin" />
                Đang tra mã...
              </div>
            </div>
          )}

          <div ref={bottomAnchorRef} />
        </div>

        <div
          className={cn(
            "shrink-0 border-t border-slate-200/80 bg-white/92 px-3 pb-3 pt-3 backdrop-blur-sm sm:px-4",
            isMobile ? "pb-[calc(0.75rem+env(safe-area-inset-bottom))]" : ""
          )}
        >
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300/80 bg-white px-3 py-1.5 text-[12px] text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50">
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
            {selectedFileName && <p className="truncate text-[12px] text-slate-500">{selectedFileName}</p>}
          </div>

          <div className="mt-2 rounded-2xl border border-slate-200/90 bg-slate-50/65 p-2 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]">
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
              className="min-h-20 max-h-36 resize-none border-0 bg-transparent px-2 py-1 text-[13px] leading-5 shadow-none focus-visible:ring-0 sm:text-sm"
            />
            <Button
              type="button"
              className="h-10 w-full rounded-xl bg-amber-700 text-[13px] font-medium text-white shadow-[0_12px_24px_-14px_rgba(180,83,9,0.85)] hover:bg-amber-800"
              onClick={() => void submitMessage(inputValue)}
              disabled={isSubmitting || inputValue.trim().length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Đang xử lý
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-1.5 size-3.5" />
                  Gửi yêu cầu tra mã
                </>
              )}
            </Button>
          </div>

          <p className="mt-2 px-1 text-[11px] leading-5 text-slate-500">
            Chatbot ưu tiên trả lời ngắn, theo ứng dụng thực tế. Giá và tình trạng hàng được xác nhận riêng.
          </p>
        </div>
      </div>
    </section>
  );
}
