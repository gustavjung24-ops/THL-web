import { siteConfig } from "@/config/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type WebPageSchemaInput = {
  title: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "CollectionPage" | "ContactPage";
};

const siteUrl = `https://${siteConfig.domain}`;

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteUrl,
    logo: `${siteUrl}${siteConfig.defaultOgImage}`,
    description: siteConfig.slogan,
    telephone: siteConfig.phone,
    areaServed: "VN",
    sameAs: [siteConfig.zaloLink],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: siteConfig.phone,
        areaServed: "VN",
        availableLanguage: ["vi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "VN",
    },
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    url: siteUrl,
    inLanguage: "vi-VN",
    description: siteConfig.slogan,
  };
}

export function createWebPageSchema({ title, description, path, type = "WebPage" }: WebPageSchemaInput) {
  const url = `${siteUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url,
    inLanguage: "vi-VN",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.brandName,
      url: siteUrl,
    },
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}