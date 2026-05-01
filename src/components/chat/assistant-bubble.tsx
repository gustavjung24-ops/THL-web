"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export function AssistantBubble() {
  return (
    <div className="fixed bottom-[calc(6.2rem+env(safe-area-inset-bottom))] right-4 z-50 lg:bottom-6 lg:right-5">
      <Link
        href="/tra-ma-bao-gia"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#008fd3]/35 bg-[#008fd3] text-white shadow-[0_14px_34px_-20px_rgba(0,143,211,0.85)] transition hover:-translate-y-0.5 hover:bg-[#007db8] sm:w-auto sm:gap-1.5 sm:px-3"
        aria-label="Đi tới trang tra mã"
        title="Tra mã sản phẩm"
      >
        <span className="hidden text-xs font-semibold uppercase tracking-wide sm:inline">Tra Mã</span>
        <Search className="size-4" />
      </Link>
    </div>
  );
}
