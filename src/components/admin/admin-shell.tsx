import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  section: "tong-quan" | "bao-gia" | "phan-quyen" | "mail";
  sessionEmail: string;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  canManageUsers?: boolean;
  canSendMail?: boolean;
};

type AdminNavItem = {
  key: AdminShellProps["section"];
  label: string;
  href: string;
  permission?: "users" | "mail";
};

const navItems: AdminNavItem[] = [
  { key: "tong-quan", label: "Tổng quan", href: "/admin" },
  { key: "bao-gia", label: "Báo giá", href: "/admin/bao-gia" },
  { key: "phan-quyen", label: "Phân quyền", href: "/admin/phan-quyen", permission: "users" },
  { key: "mail", label: "Mail admin", href: "/admin/mail", permission: "mail" },
];

export function AdminShell({
  section,
  sessionEmail,
  title,
  description,
  children,
  actions,
  canManageUsers = false,
  canSendMail = false,
}: AdminShellProps) {
  const visibleItems = navItems.filter((item) => {
    if (item.permission === "users") return canManageUsers;
    if (item.permission === "mail") return canSendMail;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/90">
      <header className="px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">THL Admin</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">{siteConfig.brandName}</h1>
              <p className="mt-1 text-sm text-slate-600">Email admin: {sessionEmail}</p>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  section === item.key
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
}