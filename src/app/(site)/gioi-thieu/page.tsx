import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { customerSegments, productGroups } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Giá»›i thiá»‡u",
  description:
    "Giá»›i thiá»‡u kÃªnh tÆ° váº¥n cÃ¡ nhÃ¢n Truyá»n Äá»™ng CÃ´ng Nghiá»‡p, táº­p trung há»— trá»£ tra mÃ£, chá»n hÃ ng vÃ  bÃ¡o giÃ¡ váº­t tÆ° truyá»n Ä‘á»™ng.",
  path: "/gioi-thieu",
});

export default function AboutPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-10">
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_-24px_rgba(30,64,175,0.45)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <SectionTitle
                eyebrow="Giá»›i thiá»‡u"
                title="KÃªnh tÆ° váº¥n cÃ¡ nhÃ¢n vá» phá»¥ tÃ¹ng cÃ´ng nghiá»‡p"
                description="Website nÃ y Ä‘Æ°á»£c xÃ¢y dá»±ng Ä‘á»ƒ há»— trá»£ tra mÃ£, tÆ° váº¥n nhÃ³m hÃ ng vÃ  tiáº¿p nháº­n nhu cáº§u bÃ¡o giÃ¡ nhanh. ÄÃ¢y lÃ  kÃªnh lÃ m viá»‡c cÃ¡ nhÃ¢n, khÃ´ng pháº£i website chÃ­nh thá»©c cá»§a cÃ´ng ty."
              />
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                CÃ¡ch lÃ m viá»‡c táº­p trung vÃ o nhu cáº§u thá»±c táº¿ ngoÃ i thá»‹ trÆ°á»ng: nháº­n thÃ´ng tin rÃµ, Ä‘á»‘i chiáº¿u mÃ£ nhanh,
                gá»£i Ã½ phÆ°Æ¡ng Ã¡n phÃ¹ há»£p á»©ng dá»¥ng vÃ  dá»… trao Ä‘á»•i qua Ä‘iá»‡n thoáº¡i hoáº·c Zalo.
              </p>
              <PrimaryCtaGroup />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src="/images/industry/industry-support.svg"
                alt="Placeholder khu vá»±c tÆ° váº¥n phá»¥ tÃ¹ng cÃ´ng nghiá»‡p"
                width={1200}
                height={720}
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            eyebrow="NhÃ³m sáº£n pháº©m"
            title="CÃ¡c nhÃ³m hÃ ng Ä‘ang há»— trá»£"
            description="Táº­p trung 6 nhÃ³m sáº£n pháº©m phá»• biáº¿n, Ä‘á»§ Ä‘á»ƒ xá»­ lÃ½ pháº§n lá»›n nhu cáº§u thay tháº¿ vÃ  báº£o trÃ¬."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productGroups.map((group) => (
              <Card key={group.slug} className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900">{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-slate-600">{group.shortDescription}</p>
                  <Link href={`/san-pham/${group.slug}`} className="inline-flex items-center text-sm font-semibold text-blue-800 hover:text-blue-900">
                    Xem chi tiáº¿t
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            eyebrow="NhÃ³m khÃ¡ch"
            title="Nhá»¯ng nhÃ³m khÃ¡ch phÃ¹ há»£p"
            description="PhÃ¹ há»£p cho khÃ¡ch cáº§n xá»­ lÃ½ nhu cáº§u nhanh, trao Ä‘á»•i rÃµ rÃ ng vÃ  dá»… Ä‘á»‘i chiáº¿u theo thÃ´ng tin thá»±c táº¿."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{segment.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{segment.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

