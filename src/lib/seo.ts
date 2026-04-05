import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function createPageMetadata({ title, description, path = "/" }: MetadataInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.brandName}`;
  const fullUrl = `https://${siteConfig.domain}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.brandName,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.brandName} - ${siteConfig.slogan}`,
        },
      ],
    },
  };
}
