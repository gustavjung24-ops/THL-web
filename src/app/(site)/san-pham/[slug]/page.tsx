import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { productGroups } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return productGroups.map((group) => ({ slug: group.slug }));
}

export function generateMetadata({ params }: ProductDetailPageProps) {
  const product = productGroups.find((group) => group.slug === params.slug);

  if (!product) {
    return createPageMetadata({
      title: "Sản phẩm",
      description: "Thông tin nhóm sản phẩm phụ tùng công nghiệp.",
      path: "/san-pham",
    });
  }

  return createPageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/san-pham/${product.slug}`,
  });
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = productGroups.find((group) => group.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="section-block">
      <div className="page-shell space-y-6">
        <Link href="/san-pham" className="inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900">
          <ChevronLeft className="mr-1 size-4" />
          Quay lại trang sản phẩm
        </Link>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Chi tiết nhóm hàng</p>
            <CardTitle className="text-2xl text-slate-900">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{product.detailDescription}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-slate-900">Ứng dụng phổ biến</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {product.popularApplications.map((application) => (
                    <li key={application}>- {application}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-900">Nhóm khách hay mua</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {product.commonBuyers.map((buyer) => (
                    <li key={buyer}>- {buyer}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Gợi ý gửi thông tin để xử lý nhanh</h3>
              <p className="mt-2 text-sm text-slate-700">
                Bạn có thể gửi mã cũ, ảnh tem, kích thước hoặc ảnh vị trí lắp để mình đối chiếu nhanh hơn.
              </p>
            </div>

            <Button asChild className="bg-amber-800 hover:bg-amber-900">
              <Link href="/tra-ma-bao-gia">
                <Search className="mr-2 size-4" />
                Gửi mã cần tìm
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
