import Link from "next/link";
import { MessageCircle, PhoneCall, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PrimaryCtaGroupProps = {
  className?: string;
  submitLabel?: string;
  callLabel?: string;
  zaloLabel?: string;
};

export function PrimaryCtaGroup({
  className,
  submitLabel = "Tra mã nhanh",
  callLabel = "Liên hệ tư vấn",
  zaloLabel = "Chat Zalo",
}: PrimaryCtaGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Button asChild className="h-11 bg-amber-800 px-4 text-sm hover:bg-amber-900">
        <Link href="/tra-ma-bao-gia">
          <Search className="mr-2 size-4" />
          {submitLabel}
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-11 border-amber-200 bg-amber-50 px-4 text-amber-800 hover:bg-amber-100">
        <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
          <MessageCircle className="mr-2 size-4" />
          {zaloLabel}
        </a>
      </Button>
      <Button asChild variant="outline" className="h-11 border-amber-300 bg-white px-4 text-amber-900 hover:bg-amber-50">
        <a href={siteConfig.phoneHref}>
          <PhoneCall className="mr-2 size-4" />
          {callLabel}
        </a>
      </Button>
    </div>
  );
}
