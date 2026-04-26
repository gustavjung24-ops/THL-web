import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { customerRoles } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";

const roleSlugMap: Record<string, string> = {
  "bao-tri": "Bảo trì nhà máy",
  "ky-thuat": "Kỹ thuật thiết bị",
  "mua-hang": "Mua hàng kỹ thuật",
  "chu-xuong": "Chủ xưởng / Cơ điện",
};

const roleDetails: Record<string, { situations: string[]; products: string[] }> = {
  "bao-tri": {
    situations: [
      "Máy dừng đột xuất, cần đối chiếu mã gấp trong ngày",
      "Mã cũ mờ hoặc thiếu dữ liệu, chỉ có ảnh tem hoặc kích thước",
      "Cần phương án tương đương khi hàng gốc hết hoặc chờ lâu",
      "Thay vòng bi kèm phớt và mỡ, cần đồng bộ nhóm hàng",
    ],
    products: ["Vòng bi", "Phớt chặn dầu", "Mỡ bôi trơn", "Gối đỡ"],
  },
  "ky-thuat": {
    situations: [
      "Cần xác nhận mã theo tải, tốc độ, nhiệt và môi trường vận hành",
      "So sánh phương án giữa nhiều hãng cho cùng vị trí lắp",
      "Kiểm tra tương thích khi thay đổi quy cách theo bản vẽ mới",
      "Cần thông số để lập phương án bảo trì định kỳ",
    ],
    products: ["Vòng bi", "Gối đỡ", "Dây curoa", "Xích công nghiệp"],
  },
  "mua-hang": {
    situations: [
      "Nhận đề nghị mua từ bảo trì / kỹ thuật nhưng thông tin mã chưa rõ",
      "Cần xác nhận nhanh mã và quy cách để so sánh phương án",
      "Cần tách rõ thông tin kỹ thuật và thông tin đặt hàng",
      "Cần phản hồi nhanh để xử lý đề nghị mua đúng hạn",
    ],
    products: ["Vòng bi", "Gối đỡ", "Dây curoa", "Phớt chặn dầu"],
  },
  "chu-xuong": {
    situations: [
      "Máy chạy liên tục theo ca, vật tư chịu tải nặng và mòn nhanh",
      "Hàng cũ hết hoặc đổi quy cách, cần tìm mã thay thế tương đương",
      "Tự sửa chữa nhưng không rõ mã chính xác của phớt, bi, gối đỡ",
      "Cần nguồn hỗ trợ kỹ thuật ổn định, không phải mỗi lần lại tìm mới",
    ],
    products: ["Vòng bi", "Gối đỡ", "Xích công nghiệp", "Phớt chặn dầu", "Mỡ bôi trơn"],
  },
};

export function generateStaticParams() {
  return Object.keys(roleSlugMap).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const roleName = roleSlugMap[params.slug];
  if (!roleName) return {};
  return createPageMetadata({
    title: `Giải pháp cho ${roleName}`,
    description: `Hỗ trợ vật tư truyền động dành cho ${roleName} trong nhà máy và khu công nghiệp.`,
    path: `/giai-phap-theo-khach-hang/${params.slug}`,
  });
}

export default function CustomerSolutionDetail({ params }: { params: { slug: string } }) {
  const roleName = roleSlugMap[params.slug];
  if (!roleName) notFound();

  const role = customerRoles.find((r) => r.role === roleName);
  if (!role) notFound();

  const details = roleDetails[params.slug];

  return (
    <div className="section-block">
      <div className="page-shell max-w-3xl space-y-8">
        <Link href="/giai-phap-theo-khach-hang" className="inline-flex items-center text-sm text-amber-800 hover:text-amber-900">
          <ArrowLeft className="mr-1 size-4" />
          Tất cả giải pháp
        </Link>

        <SectionTitle
          eyebrow="Giải pháp theo vai trò"
          title={role.role}
          description={role.problems}
        />

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Vấn đề thường gặp</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{role.problems}</p>
          </div>

          {details ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold text-slate-900">Tình huống cụ thể</h3>
              <ul className="mt-3 space-y-2">
                {details.situations.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-800" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-6">
            <h3 className="text-sm font-semibold text-amber-900">Hỗ trợ từ bên mình</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{role.support}</p>
          </div>

          {details ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900">Nhóm vật tư thường dùng</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {details.products.map((p) => (
                  <span key={p} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{p}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <PrimaryCtaGroup />
      </div>
    </div>
  );
}
