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
          "absolute inset-x-0 bottom-0 z-10 transition-all duration-200 ease-out",
          open ? "translate-y-0 opacity-100" : "translate-y-[105%] opacity-0"
        )}
      >
        <div className="h-[85dvh] max-h-[calc(100dvh-0.45rem)] w-full overflow-hidden rounded-t-[1.5rem] border border-b-0 border-slate-200/80 bg-white shadow-[0_-24px_56px_-34px_rgba(15,23,42,0.55)]">
          {children}
        </div>
      </div>
    </div>
  );
}