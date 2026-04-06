"use client";

import { useState } from "react";
import { MessageCircleMore, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantPanel } from "@/components/chat/assistant-panel";

export function AssistantBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3 lg:bottom-6">
      <AssistantPanel open={open} onClose={() => setOpen(false)} />

      <Button
        type="button"
        size="icon-lg"
        className="size-14 rounded-full bg-amber-800 text-white shadow-[0_14px_30px_-18px_rgba(146,64,14,0.85)] hover:bg-amber-900"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Dong chat tra ma" : "Mo chat tra ma"}
        title="Tro ly tra ma"
      >
        {open ? <X className="size-5" /> : <MessageCircleMore className="size-5" />}
      </Button>
    </div>
  );
}
