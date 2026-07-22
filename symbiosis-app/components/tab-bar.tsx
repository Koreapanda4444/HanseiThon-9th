"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconPlaceholder } from "./icon-placeholder";

const TABS = [
  { href: "/", label: "지도" },
  { href: "/search", label: "검색" },
  { href: "/report", label: "제보" },
  { href: "/favorites", label: "즐겨찾기" },
  { href: "/more", label: "더보기" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/more") return pathname.startsWith("/more") || pathname.startsWith("/reports");
  // 정확히 일치하거나 하위 세그먼트일 때만 활성 ("/reports"가 "/report"에 걸리지 않도록)
  return pathname === href || pathname.startsWith(href + "/");
}

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="z-50 flex shrink-0 border-t border-[var(--line)] bg-white pb-[max(4px,env(safe-area-inset-bottom))]">
      {TABS.map((t) => {
        const active = isActive(pathname, t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-1 pb-1.5 pt-2 ${
              active ? "text-[var(--green)]" : "text-[var(--faint)]"
            }`}
          >
            <IconPlaceholder size={22} className={active ? "opacity-100" : ""} />
            <span className={`text-[10.5px] ${active ? "font-bold" : "font-medium"}`}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
