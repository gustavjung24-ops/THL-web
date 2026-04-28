"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export function AssistantBubble() {
  return (
    <div className="fixed right-4 bottom-6 z-50 hidden md:block lg:right-5">
      <Link
        href="/tra-ma-bao-gia"
        className="block w-[320px] rounded-xl border border-slate-200 bg-white/95 p-3 text-slate-900 shadow-[0_18px_44px_-28px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)]"
        aria-label="Tìm sản phẩm theo mã hoặc kích thước"
        title="Tìm sản phẩm"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Tìm sản phẩm</p>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <Search className="size-4 text-slate-500" />
          <span>Mã SP / Kích thước / Ứng dụng...</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Ô tìm nhanh tạm thời, sẽ nâng cấp thành pop tra mã ở bước sau.</p>
      </Link>
    </div>
  );
}
