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

  useEffect(() => {
    if (isMobile && open) {
      document.body.classList.add("chat-mobile-open");
    } else {
      document.body.classList.remove("chat-mobile-open");
    }

    return () => {
      document.body.classList.remove("chat-mobile-open");
    };
  }, [isMobile, open]);

  return (
    <>
      <div className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex items-end md:right-5 md:bottom-6">
        {!isMobile && (
          <div
            className={cn(
              "mr-3 hidden origin-bottom-right transition-all duration-200 ease-out md:block",
              open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
            )}
          >
            <AssistantPanel mode="desktop" onClose={() => setOpen(false)} />
          </div>
        )}

        <Button
          type="button"
          size="icon-lg"
          className={cn(
            "size-14 rounded-full bg-amber-700 text-white shadow-[0_20px_36px_-20px_rgba(180,83,9,0.9)] transition-all duration-200 hover:bg-amber-800",
            isMobile && open ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
          )}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Đóng chat tra mã" : "Mở chat tra mã"}
          title="Trợ lý tra mã"
        >
          {open ? <X className="size-5" /> : <MessageCircleMore className="size-5" />}
        </Button>
      </div>

      {isMobile && (
        <AssistantSheet open={open} onClose={() => setOpen(false)}>
          <AssistantPanel mode="mobile" onClose={() => setOpen(false)} />
        </AssistantSheet>
      )}
    </>
  );
}
