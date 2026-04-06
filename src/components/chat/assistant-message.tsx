import { cn } from "@/lib/utils";

type AssistantMessageProps = {
  role: "user" | "assistant";
  text: string;
};

export function AssistantMessage({ role, text }: AssistantMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex w-full", isAssistant ? "justify-start pr-8 sm:pr-10" : "justify-end pl-8 sm:pl-10")}>
      <div
        className={cn(
          "max-w-[94%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm",
          isAssistant
            ? "border border-amber-200/70 bg-gradient-to-b from-amber-50/90 to-white text-slate-800"
            : "bg-slate-900 text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.8)]"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}
