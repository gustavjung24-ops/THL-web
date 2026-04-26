import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { customerRoles } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";

const roleSlugMap: Record<string, string> = {
  "bao-tri": "Báº£o trÃ¬ nhÃ  mÃ¡y",
  "ky-thuat": "Ká»¹ thuáº­t thiáº¿t bá»‹",
  "mua-hang": "Mua hÃ ng ká»¹ thuáº­t",
  "chu-xuong": "Chá»§ xÆ°á»Ÿng / CÆ¡ Ä‘iá»‡n",
};

const roleDetails: Record<string, { situations: string[]; products: string[] }> = {
  "bao-tri": {
    situations: [
      "MÃ¡y dá»«ng Ä‘á»™t xuáº¥t, cáº§n Ä‘á»‘i chiáº¿u mÃ£ gáº¥p trong ngÃ y",
      "MÃ£ cÅ© má» hoáº·c thiáº¿u dá»¯ liá»‡u, chá»‰ cÃ³ áº£nh tem hoáº·c kÃ­ch thÆ°á»›c",
      "Cáº§n phÆ°Æ¡ng Ã¡n tÆ°Æ¡ng Ä‘Æ°Æ¡ng khi hÃ ng gá»‘c háº¿t hoáº·c chá» lÃ¢u",
      "Thay vÃ²ng bi kÃ¨m phá»›t vÃ  má»¡, cáº§n Ä‘á»“ng bá»™ nhÃ³m hÃ ng",
    ],
    products: ["VÃ²ng bi", "Phá»›t cháº·n dáº§u", "Má»¡ bÃ´i trÆ¡n", "Gá»‘i Ä‘á»¡"],
  },
  "ky-thuat": {
    situations: [
      "Cáº§n xÃ¡c nháº­n mÃ£ theo táº£i, tá»‘c Ä‘á»™, nhiá»‡t vÃ  mÃ´i trÆ°á»ng váº­n hÃ nh",
      "So sÃ¡nh phÆ°Æ¡ng Ã¡n giá»¯a nhiá»u hÃ£ng cho cÃ¹ng vá»‹ trÃ­ láº¯p",
      "Kiá»ƒm tra tÆ°Æ¡ng thÃ­ch khi thay Ä‘á»•i quy cÃ¡ch theo báº£n váº½ má»›i",
      "Cáº§n thÃ´ng sá»‘ Ä‘á»ƒ láº­p phÆ°Æ¡ng Ã¡n báº£o trÃ¬ Ä‘á»‹nh ká»³",
    ],
    products: ["VÃ²ng bi", "Gá»‘i Ä‘á»¡", "DÃ¢y curoa", "XÃ­ch cÃ´ng nghiá»‡p"],
  },
  "mua-hang": {
    situations: [
      "Nháº­n Ä‘á» nghá»‹ mua tá»« báº£o trÃ¬ / ká»¹ thuáº­t nhÆ°ng thÃ´ng tin mÃ£ chÆ°a rÃµ",
      "Cáº§n xÃ¡c nháº­n nhanh mÃ£ vÃ  quy cÃ¡ch Ä‘á»ƒ so sÃ¡nh phÆ°Æ¡ng Ã¡n",
      "Cáº§n tÃ¡ch rÃµ thÃ´ng tin ká»¹ thuáº­t vÃ  thÃ´ng tin Ä‘áº·t hÃ ng",
      "Cáº§n pháº£n há»“i nhanh Ä‘á»ƒ xá»­ lÃ½ Ä‘á» nghá»‹ mua Ä‘Ãºng háº¡n",
    ],
    products: ["VÃ²ng bi", "Gá»‘i Ä‘á»¡", "DÃ¢y curoa", "Phá»›t cháº·n dáº§u"],
  },
  "chu-xuong": {
    situations: [
      "MÃ¡y cháº¡y liÃªn tá»¥c theo ca, váº­t tÆ° chá»‹u táº£i náº·ng vÃ  mÃ²n nhanh",
      "HÃ ng cÅ© háº¿t hoáº·c Ä‘á»•i quy cÃ¡ch, cáº§n tÃ¬m mÃ£ thay tháº¿ tÆ°Æ¡ng Ä‘Æ°Æ¡ng",
      "Tá»± sá»­a chá»¯a nhÆ°ng khÃ´ng rÃµ mÃ£ chÃ­nh xÃ¡c cá»§a phá»›t, bi, gá»‘i Ä‘á»¡",
      "Cáº§n nguá»“n há»— trá»£ ká»¹ thuáº­t á»•n Ä‘á»‹nh, khÃ´ng pháº£i má»—i láº§n láº¡i tÃ¬m má»›i",
    ],
    products: ["VÃ²ng bi", "Gá»‘i Ä‘á»¡", "XÃ­ch cÃ´ng nghiá»‡p", "Phá»›t cháº·n dáº§u", "Má»¡ bÃ´i trÆ¡n"],
  },
};

export function generateStaticParams() {
  return Object.keys(roleSlugMap).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const roleName = roleSlugMap[params.slug];
  if (!roleName) return {};
  return createPageMetadata({
    title: `Giáº£i phÃ¡p cho ${roleName}`,
    description: `Há»— trá»£ váº­t tÆ° truyá»n Ä‘á»™ng dÃ nh cho ${roleName} trong nhÃ  mÃ¡y vÃ  khu cÃ´ng nghiá»‡p.`,
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
        <Link href="/giai-phap-theo-khach-hang" className="inline-flex items-center text-sm text-blue-800 hover:text-blue-900">
          <ArrowLeft className="mr-1 size-4" />
          Táº¥t cáº£ giáº£i phÃ¡p
        </Link>

        <SectionTitle
          eyebrow="Giáº£i phÃ¡p theo vai trÃ²"
          title={role.role}
          description={role.problems}
        />

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Váº¥n Ä‘á» thÆ°á»ng gáº·p</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{role.problems}</p>
          </div>

          {details ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold text-slate-900">TÃ¬nh huá»‘ng cá»¥ thá»ƒ</h3>
              <ul className="mt-3 space-y-2">
                {details.situations.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-800" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-6">
            <h3 className="text-sm font-semibold text-blue-900">Há»— trá»£ tá»« bÃªn mÃ¬nh</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{role.support}</p>
          </div>

          {details ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900">NhÃ³m váº­t tÆ° thÆ°á»ng dÃ¹ng</h3>
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

