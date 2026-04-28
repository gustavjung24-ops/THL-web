"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export function AssistantBubble() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current) {
        return;
      }

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed right-4 bottom-[calc(6.2rem+env(safe-area-inset-bottom))] z-50 lg:right-5 lg:bottom-6"
    >
      {open ? (
        <div className="mb-3 w-[min(92vw,360px)] overflow-hidden rounded-xl border border-[#008fd3]/30 bg-white shadow-[0_24px_52px_-28px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between border-b border-[#008fd3]/20 bg-gradient-to-r from-[#e7f7ff] to-white px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#00699f]">Tra ma san pham</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Dong bang tra ma"
              title="Dong"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-2.5 p-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <label htmlFor="quick-lookup-keyword" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                Tu khoa tim
              </label>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Search className="size-4 text-slate-500" />
                <input
                  id="quick-lookup-keyword"
                  type="text"
                  placeholder="VD: 6204, 35x72x17, vong bi"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[#008fd3]/25 bg-[#e7f7ff] px-2.5 py-1 text-[11px] font-medium text-[#00699f]">Ma SP</span>
              <span className="rounded-full border border-[#008fd3]/25 bg-[#e7f7ff] px-2.5 py-1 text-[11px] font-medium text-[#00699f]">Kich thuoc</span>
              <span className="rounded-full border border-[#008fd3]/25 bg-[#e7f7ff] px-2.5 py-1 text-[11px] font-medium text-[#00699f]">Ung dung</span>
              <span className="rounded-full border border-[#008fd3]/25 bg-[#e7f7ff] px-2.5 py-1 text-[11px] font-medium text-[#00699f]">Thuong hieu</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500">
              Ban tra nay dang la khung UI. Du lieu danh muc va logic tim se gan sau khi ban cung cap.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#008fd3]/35 bg-[#008fd3] text-white shadow-[0_14px_34px_-20px_rgba(0,143,211,0.85)] transition hover:-translate-y-0.5 hover:bg-[#007db8] sm:w-auto sm:gap-1.5 sm:px-3"
        aria-label={open ? "Dong pop tra ma" : "Mo pop tra ma"}
        title="Tra ma san pham"
      >
        <span className="hidden text-xs font-semibold uppercase tracking-wide sm:inline">Tim san pham</span>
        {open ? <X className="size-4" /> : <Search className="size-4" />}
      </button>
    </div>
  );
}
