"use client";

import { useEffect, useState } from "react";
import { MessageCircleMore, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantPanel } from "@/components/chat/assistant-panel";
import { AssistantSheet } from "@/components/chat/assistant-sheet";
import { cn } from "@/lib/utils";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";

export function AssistantBubble() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);

    const syncViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <>
      <div className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex items-end lg:right-5 lg:bottom-6">
        {!isMobile && (
          <div
            className={cn(
              "mr-3 hidden origin-bottom-right transition-all duration-200 ease-out md:block",
              open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
            )}
          >
            <div className="h-[min(82vh,720px)] w-[min(92vw,400px)] overflow-hidden rounded-[1.35rem] border border-slate-200/70 bg-white/95 shadow-[0_28px_56px_-34px_rgba(15,23,42,0.45)]">
              <AssistantPanel mode="desktop" onClose={() => setOpen(false)} className="h-full" />
            </div>
          </div>
        )}

        <Button
          type="button"
          size="icon-lg"
          className={cn(
            "chat-bubble-pulse size-14 rounded-full bg-blue-700 text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-blue-800",
            isMobile && open ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
          )}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Đóng hỗ trợ kỹ thuật THL" : "Mở hỗ trợ kỹ thuật THL"}
          title="Hỗ trợ kỹ thuật THL"
        >
          {open ? <X className="size-5" /> : <MessageCircleMore className="size-5" />}
        </Button>
      </div>

      {isMobile && (
        <div className="md:hidden">
          <AssistantSheet open={open} onClose={() => setOpen(false)}>
            <AssistantPanel mode="mobile" onClose={() => setOpen(false)} className="h-full" showCloseButton={false} />
          </AssistantSheet>
        </div>
      )}
    </>
  );
}
