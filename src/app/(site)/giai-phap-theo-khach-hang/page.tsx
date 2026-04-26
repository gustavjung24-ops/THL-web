import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { brandLogos, customerSolutionBrandMap } from "@/data/brand-logos";
import { solutionByCustomer } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const brandById = Object.fromEntries(brandLogos.map((brand) => [brand.id, brand]));

export const metadata = createPageMetadata({
  title: "Giáº£i phÃ¡p theo khÃ¡ch hÃ ng",
  description:
    "Giáº£i phÃ¡p há»— trá»£ theo tá»«ng nhÃ³m khÃ¡ch: váº¥n Ä‘á» thÆ°á»ng gáº·p, cÃ¡ch há»— trá»£ vÃ  nhÃ³m sáº£n pháº©m phÃ¹ há»£p.",
  path: "/giai-phap-theo-khach-hang",
});

export default function SolutionsPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Giáº£i phÃ¡p theo khÃ¡ch hÃ ng"
          title="Má»—i nhÃ³m khÃ¡ch cÃ³ má»™t cÃ¡ch há»— trá»£ khÃ¡c nhau"
          description="BÃ¡m tÃ¬nh huá»‘ng thá»±c táº¿ Ä‘á»ƒ gá»£i Ã½ mÃ£, nhÃ³m hÃ ng vÃ  hÆ°á»›ng xá»­ lÃ½ phÃ¹ há»£p tiáº¿n Ä‘á»™ cÃ´ng viá»‡c."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {solutionByCustomer.map((item) => {
            const relatedBrands = (customerSolutionBrandMap[item.customer] ?? [])
              .map((brandId) => brandById[brandId])
              .filter(Boolean);

            return (
            <Card key={item.customer} className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">{item.customer}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">ThÆ°á»ng gáº·p váº¥n Ä‘á» gÃ¬?</p>
                  <p>{item.problems}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">TÃ´i há»— trá»£ gÃ¬?</p>
                  <p>{item.support}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sáº£n pháº©m phÃ¹ há»£p</p>
                  <p>{item.products}</p>
                </div>
                {relatedBrands.length > 0 ? (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Há»— trá»£ cÃ¡c nhÃ³m thÆ°Æ¡ng hiá»‡u phÃ¹ há»£p
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relatedBrands.map((brand) => (
                        <span key={`${item.customer}-${brand.id}`} className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                          <Image src={brand.src} alt={brand.alt} width={52} height={18} className="h-3.5 w-auto object-contain" />
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">Báº¡n cÃ³ thá»ƒ gá»­i mÃ£ cÅ©, áº£nh hoáº·c kÃ­ch thÆ°á»›c Ä‘á»ƒ nháº­n hÆ°á»›ng xá»­ lÃ½ nhanh.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="bg-blue-800 hover:bg-blue-900">
                <Link href="/tra-ma-bao-gia">
                  <Search className="mr-2 size-4" />
                  Gá»­i mÃ£ cáº§n tÃ¬m
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-100">
                <Link href="/lien-he">
                  LiÃªn há»‡ nhanh
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

