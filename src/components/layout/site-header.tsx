"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall } from "lucide-react";
import { mainMenu, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-md bg-blue-700 px-2 py-1 text-xs font-bold uppercase text-white">LP</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{siteConfig.brandName}</p>
            <p className="hidden text-xs text-slate-500 sm:block">{siteConfig.slogan}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainMenu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden bg-blue-700 hover:bg-blue-800 sm:inline-flex">
            <a href={siteConfig.phoneHref}>
              <PhoneCall className="mr-2 size-4" />
              Goi ngay
            </a>
          </Button>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Mo menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="mt-8 flex flex-col gap-2">
                {mainMenu.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium",
                        active ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Button asChild className="mt-4 bg-blue-700 hover:bg-blue-800">
                  <a href={siteConfig.phoneHref}>Goi ngay</a>
                </Button>
                <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                    Chat Zalo
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
