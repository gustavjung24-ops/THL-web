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
    <div className={cn("flex w-full", isAssistant ? "justify-start pr-6 sm:pr-10" : "justify-end pl-6 sm:pl-10")}>
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.65] sm:text-sm",
          isAssistant
            ? "border border-amber-100/80 bg-gradient-to-b from-amber-50/50 to-white text-slate-700 shadow-[0_6px_16px_-16px_rgba(15,23,42,0.3)]"
            : "bg-slate-800 text-white shadow-[0_8px_18px_-16px_rgba(15,23,42,0.55)]"
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
                  <span className="absolute left-0 top-[0.55rem] size-1 rounded-full bg-slate-400" />
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
