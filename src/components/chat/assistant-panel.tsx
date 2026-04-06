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
  mode?: "mobile" | "desktop";
  onClose: () => void;
  className?: string;
  showCloseButton?: boolean;
};

const defaultGreeting =
  "Chào anh/chị, em hỗ trợ tra mã vật tư kỹ thuật. Anh/chị có thể gửi mã cũ, ảnh tem hoặc mô tả hệ máy để em hỗ trợ nhanh.";

function getDiscoveryOptionLabel(option: string): string {
  if (option === "Tôi có ảnh tem / ảnh mẫu") {
    return "Tôi có ảnh tem";
  }

  if (option === "Tôi chỉ biết hệ máy / triệu chứng") {
    return "Tôi chỉ biết máy / hiện tượng";
  }

  return option;
}

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

export function AssistantPanel({
  mode = "desktop",
  onClose,
  className,
  showCloseButton = true,
}: AssistantPanelProps) {
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

    const displayOption = getDiscoveryOptionLabel(option);

    const userMessage: UiMessage = {
      id: createId(),
      role: "user",
      text: displayOption,
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
        "flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-b from-[#fffefc] via-white to-[#fffdfa] text-slate-900",
        className
      )}
      role="dialog"
      aria-label="Trợ lý tra mã"
    >
      <div
        className="shrink-0 border-b border-slate-200/65 bg-white/85 px-4 pb-2.5 pt-2 supports-[backdrop-filter]:backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {isMobile && (
              <p className="mb-1 inline-flex rounded-full border border-amber-200/70 bg-amber-50/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-900/85">
                Trợ lý trực tuyến
              </p>
            )}
            <h3 className="font-heading text-[15px] font-semibold tracking-tight text-slate-900">Tra mã nhanh</h3>
            <p className="mt-0.5 text-[11.5px] leading-[1.45] text-slate-500">
              Gửi mã cũ, ảnh tem hoặc mô tả hệ máy để được hỗ trợ.
            </p>
          </div>
          {showCloseButton && (
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
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {discoveryPrompt && discoveryPrompt.options.length > 0 && (
          <div className="shrink-0 border-b border-slate-200/70 bg-gradient-to-b from-amber-50/70 to-white px-3.5 py-3 sm:px-4">
            <p className="text-[12px] leading-5 text-slate-700">{discoveryPrompt.message}</p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">Chọn nhanh</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {discoveryPrompt.options.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto min-h-10 rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 py-2 text-[13px] font-medium leading-5 text-slate-700 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)] transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-900 active:scale-[0.98] active:bg-amber-100/85 focus-visible:ring-2 focus-visible:ring-amber-300"
                  onClick={() => void handleDiscoveryOption(option)}
                  disabled={isSubmitting}
                >
                  {getDiscoveryOptionLabel(option)}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-scroll-area flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-4">
          {messages.map((message) => (
            <AssistantMessage key={message.id} role={message.role} text={message.text} />
          ))}

          {isSubmitting && (
            <div className="flex w-full justify-start pr-10">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 text-[13px] leading-5 text-slate-700 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.5)] sm:text-sm">
                <Loader2 className="size-3.5 animate-spin" />
                Đang xử lý yêu cầu...
              </div>
            </div>
          )}

          <div ref={bottomAnchorRef} />
        </div>

        <div
          className={cn(
            "shrink-0 border-t border-slate-200/65 bg-white/90 px-3.5 pb-3 pt-2.5 supports-[backdrop-filter]:backdrop-blur-sm sm:px-4",
            isMobile ? "pb-[calc(0.75rem+env(safe-area-inset-bottom))]" : ""
          )}
        >
          <div className="flex items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300/80 bg-white px-3 text-[12px] text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50">
              <ImagePlus className="size-3.5" />
              Tải ảnh
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

          <div className="mt-2 flex items-end gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-1.5 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]">
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
              className="min-h-10 max-h-32 flex-1 resize-none border-0 bg-transparent px-1.5 py-1.5 text-[13px] leading-6 shadow-none placeholder:text-slate-400 focus-visible:ring-0 sm:text-sm"
            />
            <Button
              type="button"
              size="sm"
              className="h-10 shrink-0 rounded-xl bg-amber-700 px-3 text-[12px] font-semibold text-white shadow-[0_12px_20px_-16px_rgba(180,83,9,0.95)] hover:bg-amber-800 disabled:bg-amber-600/70"
              onClick={() => void submitMessage(inputValue)}
              disabled={isSubmitting || inputValue.trim().length === 0}
              aria-label="Gửi yêu cầu tra mã"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 size-3.5 animate-spin" />
                  Đang xử lý
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-1 size-3.5" />
                  Tra mã ngay
                </>
              )}
            </Button>
          </div>

          <p className="mt-2 px-1 text-[11px] leading-5 text-slate-500">
            Trợ lý trả lời ngắn, theo ứng dụng thực tế. Giá và tình trạng hàng được xác nhận riêng.
          </p>
        </div>
      </div>
    </section>
  );
}
