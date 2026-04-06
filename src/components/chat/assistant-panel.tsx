"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, SendHorizonal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const quickPrompts = [
  {
    label: "Toi co ma cu",
    value: "Toi co ma cu, nho ban tra ma tuong duong theo danh muc dang ho tro.",
  },
  {
    label: "Toi co anh tem",
    value: "Toi co anh tem, minh se gui sau. Ban cho minh biet can thong tin nao de tra ma chinh xac?",
  },
  {
    label: "Toi chi biet kich thuoc / ung dung",
    value: "Toi chi biet kich thuoc va ung dung. Hay goi y thong tin con thieu de tra ma.",
  },
] as const;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatAssistantReply(payload: AssistantStructuredResponse): string {
  if (payload.final_status === "ready" && payload.recommended_items.length > 0) {
    const topItems = payload.recommended_items.slice(0, 3);
    const lines = [payload.short_reply.trim() || "Da tim thay ma phu hop."];

    lines.push("Ma de xuat:");
    topItems.forEach((item) => {
      lines.push(`- ${item.exact_code} (${item.brand})`);
    });

    lines.push(`Nhan hang de xuat: ${topItems.map((item) => item.brand).join(", ")}`);
    lines.push(`Can cu chon: ${topItems[0]?.reason ?? "Can xac minh them."}`);
    lines.push(`Luu y de nham: ${topItems[0]?.caution ?? "Can xac minh them."}`);
    lines.push("Gia: lien he bao truc tiep.");

    return lines.join("\n");
  }

  if (payload.final_status === "not_found_in_system" || payload.intent === "not_in_catalog") {
    return [
      payload.short_reply.trim() || "Chua co du lieu ma trong he thong.",
      "Chua co du lieu ma trong he thong.",
      "Can xac minh them hoac ngoai danh muc dang ho tro.",
      "Tam thoi chua bao ma de tranh sai.",
    ].join("\n");
  }

  const missingText = payload.missing_fields.length > 0 ? payload.missing_fields.join(", ") : "ma cu, anh tem, kich thuoc";

  return [
    payload.short_reply.trim() || "Chua the chot ma.",
    "Chua the chot ma.",
    `Can them: ${missingText}`,
    "Uu tien gui: ma cu, anh tem, kich thuoc, ung dung thuc te.",
    "Tam thoi chua bao ma de tranh sai.",
  ].join("\n");
}

export function AssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: createId(),
      role: "assistant",
      text: "San sang ho tro tra ma. Ban co the gui ma cu, kich thuoc hoac ung dung dang gap.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSubmitting, open]);

  const requestPayload = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role,
        content: message.text,
      })),
    [messages]
  );

  async function submitMessage(rawText: string) {
    const content = rawText.trim();

    if (!content || isSubmitting) {
      return;
    }

    const userMessage: UiMessage = {
      id: createId(),
      role: "user",
      text: content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...requestPayload, { role: "user", content }] }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        result?: unknown;
      };

      if (!response.ok || !payload.ok) {
        const text = payload.error?.trim().length
          ? `He thong AI tam thoi chua san sang. ${payload.error}`
          : "He thong AI tam thoi chua san sang. Can xac minh them.";

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
          text: "Ket noi dang bi gian doan. Can xac minh them.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-slate-900">Tra ma nhanh</h3>
          <p className="mt-1 text-xs text-slate-600">
            Gui ma cu, anh tem, kich thuoc hoac ung dung de duoc ho tro tra ma.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={onClose}
          aria-label="Dong tro ly tra ma"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-3 px-4 py-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt.label}
              type="button"
              variant="outline"
              size="sm"
              className="h-auto min-h-8 whitespace-normal border-slate-300 px-2 py-2 text-left text-xs text-slate-700"
              onClick={() => setInputValue(prompt.value)}
            >
              {prompt.label}
            </Button>
          ))}
        </div>

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
              Dang tra ma...
            </div>
          )}
          <div ref={bottomAnchorRef} />
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100">
            <ImagePlus className="size-3.5" />
            Upload anh (mock)
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
            placeholder="Nhap ma cu, kich thuoc hoac ung dung can tra..."
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
                Dang xu ly
              </>
            ) : (
              <>
                <SendHorizonal className="mr-1 size-3.5" />
                Gui yeu cau tra ma
              </>
            )}
          </Button>
        </div>

        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
          AI khong bao gia tu dong. Gia se duoc xac nhan rieng.
        </p>
      </div>
    </div>
  );
}
