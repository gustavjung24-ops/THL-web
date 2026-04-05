"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, PhoneCall } from "lucide-react";
import { mainMenu, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-bearing.svg"
            alt="Logo Truyền Động Công Nghiệp"
            width={36}
            height={36}
            className="size-9 rounded-md border border-amber-200 bg-white p-1"
          />
          <div>
            <p className="font-heading text-sm font-bold tracking-tight text-slate-900">{siteConfig.brandName}</p>
            <p className="hidden text-xs text-slate-500 md:block">{siteConfig.slogan}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainMenu.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-amber-800 text-white" : "text-slate-600 hover:bg-amber-50 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden bg-amber-800 hover:bg-amber-900 sm:inline-flex">
            <a href={siteConfig.phoneHref}>
              <PhoneCall className="mr-2 size-4" />
              Gọi nhanh
            </a>
          </Button>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Mở menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="mt-8 space-y-6">
                <div className="space-y-1">
                  <p className="font-heading text-base font-semibold text-slate-900">{siteConfig.brandName}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{siteConfig.slogan}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {mainMenu.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium",
                          active ? "bg-amber-800 text-white" : "text-slate-700 hover:bg-amber-50",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="grid gap-2">
                  <Button asChild className="bg-amber-800 hover:bg-amber-900">
                    <a href={siteConfig.phoneHref}>
                      <PhoneCall className="mr-2 size-4" />
                      Gọi nhanh
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
                    <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 size-4" />
                      Chat Zalo
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
