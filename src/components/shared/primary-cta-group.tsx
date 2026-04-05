import Link from "next/link";
import { MessageCircle, PhoneCall, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PrimaryCtaGroupProps = {
  className?: string;
};

export function PrimaryCtaGroup({ className }: PrimaryCtaGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Button asChild className="h-11 bg-blue-700 px-4 text-sm hover:bg-blue-800">
        <Link href="/tra-ma-bao-gia">
          <Search className="mr-2 size-4" />
          Gửi mã cần tìm
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-11 border-blue-200 bg-blue-50 px-4 text-blue-700 hover:bg-blue-100">
        <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
          <MessageCircle className="mr-2 size-4" />
          Chat Zalo
        </a>
      </Button>
      <Button asChild variant="outline" className="h-11 border-red-200 bg-red-50 px-4 text-red-700 hover:bg-red-100">
        <a href={siteConfig.phoneHref}>
          <PhoneCall className="mr-2 size-4" />
          Gọi ngay
        </a>
      </Button>
    </div>
  );
}
