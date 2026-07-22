"use client";

import Link from "next/link";
import { IconPlaceholder } from "@/components/icon-placeholder";

function MenuGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; href?: string }[];
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-[12.5px] font-semibold text-[var(--faint)]">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
        {items.map((it, i) => {
          const inner = (
            <span
              className={`flex w-full items-center gap-3 bg-white px-4 py-3.5 ${
                i > 0 ? "border-t border-[var(--line)]" : ""
              }`}
            >
              <IconPlaceholder size={17} className="text-[var(--sub)]" />
              <span className="flex-1 text-left text-[14.5px] font-medium text-[var(--ink)]">
                {it.label}
              </span>
              <IconPlaceholder size={13} className="text-[var(--faint)]" />
            </span>
          );
          return it.href ? (
            <Link key={it.label} href={it.href} className="block active:bg-black/[0.03]">
              {inner}
            </Link>
          ) : (
            <button key={it.label} type="button" className="block w-full active:bg-black/[0.03]">
              {inner}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function MorePage() {
  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <header className="flex h-[52px] items-center justify-center">
        <h1 className="text-[16.5px] font-bold text-[var(--ink)]">더보기</h1>
      </header>

      <div className="flex flex-col gap-6 p-4 pb-8">
        {/* 프로필 */}
        <Link
          href="/login"
          className="flex items-center gap-3.5 rounded-2xl border border-[var(--line)] p-4 active:bg-black/[0.03]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-soft)] text-[var(--faint)] ring-1 ring-inset ring-[var(--line)]">
            <IconPlaceholder size={22} />
          </span>
          <span className="flex-1">
            <span className="block text-[15.5px] font-bold text-[var(--ink)]">
              로그인 또는 회원가입
            </span>
            <span className="mt-0.5 block text-[12.5px] text-[var(--sub)]">
              더 많은 기능을 이용해보세요
            </span>
          </span>
          <IconPlaceholder size={14} className="text-[var(--faint)]" />
        </Link>

        <MenuGroup
          title="서비스"
          items={[
            { label: "버릴지도 이용 방법" },
            { label: "버릴 수 있는 품목 안내" },
            { label: "공지사항" },
            { label: "자주 묻는 질문" },
          ]}
        />
        <MenuGroup
          title="계정"
          items={[
            { label: "제보 내역", href: "/reports" },
            { label: "설정" },
          ]}
        />
      </div>
    </main>
  );
}
