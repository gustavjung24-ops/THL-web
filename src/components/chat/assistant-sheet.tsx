"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AssistantSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function AssistantSheet({ open, onClose, children }: AssistantSheetProps) {
  return (
    <div
      className={cn("fixed inset-0 z-40 md:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Đóng chat tra mã"
        className={cn(
          "absolute inset-0 bg-slate-950/35 transition-opacity duration-200 supports-backdrop-filter:backdrop-blur-[2px]",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 transition-all duration-200 ease-out",
          open ? "translate-y-0 opacity-100" : "translate-y-[104%] opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}