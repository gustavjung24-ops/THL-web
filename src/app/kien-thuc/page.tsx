import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/posts";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Kiến thức",
  description:
    "Danh sách bài viết kiến thức phụ tùng công nghiệp: vòng bi, phớt, xích, dây curoa và lưu ý khi tra mã.",
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
          eyebrow="Kiến thức"
          title="Nội dung ngắn gọn, dễ đọc và dễ áp dụng"
          description="Các bài viết tập trung vào câu hỏi thường gặp khi tra mã, chọn hàng và thay thế phụ tùng ngoài thực tế."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="border-slate-200 bg-white">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{post.category}</p>
                  <p className="text-xs text-slate-500">{post.readTime}</p>
                </div>
                <h2 className="text-base font-semibold leading-snug text-slate-900">{post.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <p className="text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                  <Link href="/tra-ma-bao-gia" className="inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900">
                    Gửi mã cần tìm
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
