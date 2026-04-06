"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AssistantSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function AssistantSheet({ open, onClose, children }: AssistantSheetProps) {
  useEffect(() => {
    if (!open) {
      document.body.classList.remove("chat-mobile-open");
      return;
    }

    document.body.classList.add("chat-mobile-open");

    return () => {
      document.body.classList.remove("chat-mobile-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-[70] md:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Đóng chat tra mã"
        className={cn(
          "absolute inset-0 bg-slate-950/35 transition-opacity duration-300 supports-backdrop-filter:backdrop-blur-[2px]",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 px-2 pb-[calc(0.35rem+env(safe-area-inset-bottom))] transition-all duration-300 ease-out",
          open ? "translate-y-0 opacity-100" : "translate-y-[105%] opacity-0"
        )}
      >
        <div className="mx-auto flex h-[85dvh] max-h-[calc(100dvh-0.45rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/75 bg-[#fffefc] shadow-[0_28px_62px_-32px_rgba(15,23,42,0.55)]">
          <div className="shrink-0 px-4 pb-1.5 pt-[calc(0.5rem+env(safe-area-inset-top))]">
            <div className="relative flex items-center justify-center">
              <span className="h-[3px] w-10 rounded-full bg-slate-300/90" />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-0 rounded-full text-slate-500 hover:bg-white hover:text-slate-800"
                onClick={onClose}
                aria-label="Đóng chat tra mã"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}