"use client";

import Link from "next/link";
import { BriefcaseBusiness, Search } from "lucide-react";

export function MobileQuickActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2">
        <Link
          href="/tra-ma-bao-gia"
          className="flex items-center justify-center gap-1 rounded-full bg-blue-800 px-2 py-2.5 text-sm font-semibold text-white"
        >
          <Search className="size-4" />
          Tra Mã
        </Link>
        <Link
          href="/tuyen-dung"
          className="flex items-center justify-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-2.5 text-sm font-semibold text-blue-800"
        >
          <BriefcaseBusiness className="size-4" />
          Tuyển dụng
        </Link>
      </div>
    </div>
  );
}
