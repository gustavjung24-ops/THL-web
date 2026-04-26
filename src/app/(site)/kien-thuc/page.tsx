import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/posts";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Kiáº¿n thá»©c",
  description:
    "Danh sÃ¡ch bÃ i viáº¿t kiáº¿n thá»©c phá»¥ tÃ¹ng cÃ´ng nghiá»‡p: vÃ²ng bi, phá»›t, xÃ­ch, dÃ¢y curoa vÃ  lÆ°u Ã½ khi tra mÃ£.",
  path: "/kien-thuc",
});

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function KnowledgePage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Kiáº¿n thá»©c"
          title="Ná»™i dung ngáº¯n gá»n, dá»… Ä‘á»c vÃ  dá»… Ã¡p dá»¥ng"
          description="CÃ¡c bÃ i viáº¿t táº­p trung vÃ o cÃ¢u há»i thÆ°á»ng gáº·p khi tra mÃ£, chá»n hÃ ng vÃ  thay tháº¿ phá»¥ tÃ¹ng ngoÃ i thá»±c táº¿."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="border-slate-200 bg-white">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">{post.category}</p>
                  <p className="text-xs text-slate-500">{post.readTime}</p>
                </div>
                <h2 className="text-base font-semibold leading-snug text-slate-900">{post.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <p className="text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                  <Link href="/tra-ma-bao-gia" className="inline-flex items-center text-sm font-semibold text-blue-800 hover:text-blue-900">
                    Gá»­i mÃ£ cáº§n tÃ¬m
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

