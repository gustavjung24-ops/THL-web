import Link from "next/link";
import { MessageCircle, PhoneCall, Search } from "lucide-react";
import { siteConfig } from "@/config/site";

export function MobileQuickActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2">
        <Link
          href="/tra-ma-bao-gia"
          className="flex items-center justify-center gap-1 rounded-md bg-blue-700 px-2 py-2 text-xs font-semibold text-white"
        >
          <Search className="size-4" />
          Gửi mã
        </Link>
        <a
          href={siteConfig.zaloLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700"
        >
          <MessageCircle className="size-4" />
          Zalo
        </a>
        <a
          href={siteConfig.phoneHref}
          className="flex items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700"
        >
          <PhoneCall className="size-4" />
          Gọi
        </a>
      </div>
    </div>
  );
}
