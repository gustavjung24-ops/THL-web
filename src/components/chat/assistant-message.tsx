import { cn } from "@/lib/utils";

type AssistantMessageProps = {
  role: "user" | "assistant";
  text: string;
};

const emphasizedPrefixes = [
  "Mã đề xuất:",
  "Cần thêm:",
  "Không nên dùng:",
  "Giá:",
  "Nhãn hàng đề xuất:",
  "Căn cứ chọn:",
  "Lưu ý dễ nhầm:",
  "Câu hỏi tiếp theo:",
];

export function AssistantMessage({ role, text }: AssistantMessageProps) {
  const isAssistant = role === "assistant";
  const lines = text.split("\n");

  return (
    <div className={cn("flex w-full", isAssistant ? "justify-start pr-7 sm:pr-10" : "justify-end pl-7 sm:pl-10")}>
      <div
        className={cn(
          "max-w-[94%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.58] shadow-sm sm:text-sm",
          isAssistant
            ? "border border-slate-200/75 bg-white/95 text-slate-700 shadow-[0_10px_22px_-20px_rgba(15,23,42,0.45)]"
            : "border border-slate-700/25 bg-slate-800/95 text-slate-50 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.7)]"
        )}
      >
        <div className="space-y-1.5">
          {lines.map((line, index) => {
            const trimmed = line.trim();

            if (!trimmed) {
              return <div key={`line-gap-${index}`} className="h-1" />;
            }

            if (trimmed.startsWith("- ")) {
              return (
                <p key={`line-item-${index}`} className="relative pl-3.5 whitespace-pre-wrap break-words">
                  <span className="absolute left-0 top-2 size-1.5 rounded-full bg-current/55" />
                  {trimmed.slice(2)}
                </p>
              );
            }

            const isEmphasized = emphasizedPrefixes.some((prefix) => trimmed.startsWith(prefix));

            return (
              <p
                key={`line-text-${index}`}
                className={cn(
                  "whitespace-pre-wrap break-words",
                  isAssistant && isEmphasized ? "font-semibold text-slate-800" : "font-normal"
                )}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
