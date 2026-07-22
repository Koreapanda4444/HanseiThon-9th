"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type CategoryId } from "@/lib/data";
import { IconPlaceholder } from "./icon-placeholder";

/** 뒤로가기 + 가운데 제목 + (선택) 우측 액션 헤더 */
export function AppHeader({
  title,
  right,
  showBack = true,
  backHref,
}: {
  title: string;
  right?: ReactNode;
  showBack?: boolean;
  /** 지정 시 히스토리 대신 이 경로로 이동 — 직접 진입해도 나가기가 항상 동작한다 */
  backHref?: string;
}) {
  const router = useRouter();
  return (
    <header className="relative flex shrink-0 items-center justify-center bg-white px-4" style={{ height: 52 }}>
      {showBack && (
        <button
          type="button"
          aria-label="뒤로"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="absolute left-3 flex h-9 w-9 items-center justify-center text-[var(--ink)]"
        >
          <IconPlaceholder size={18} />
        </button>
      )}
      <h1 className="text-[16.5px] font-bold text-[var(--ink)]">{title}</h1>
      {right && <div className="absolute right-4">{right}</div>}
    </header>
  );
}

/** 흰 배경 + 헤어라인 보더 칩 (물건 필터) */
export function Chip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3.5 py-[7px] text-[13.5px] font-medium transition-colors ${
        active
          ? "border-[var(--green)] bg-[var(--green-soft)] font-semibold text-[var(--green-deep)]"
          : "border-[var(--line)] bg-white text-[var(--ink)]"
      }`}
    >
      {label}
    </button>
  );
}

/** 카테고리 태그 (틴트 배경 + 컬러 텍스트) */
export function CategoryTag({ category }: { category: CategoryId }) {
  const c = CATEGORIES[category];
  return (
    <span
      className="inline-block whitespace-nowrap rounded-md px-2 py-[3px] text-[11.5px] font-semibold"
      style={{ background: c.soft, color: c.color }}
    >
      {c.label}
    </span>
  );
}

/** 컬러 원형 아이콘 배지 (핀·제보 유형 등) — 글리프는 공용 자리표시자 */
export function IconBadge({
  color,
  soft,
  size = 34,
  glyph = 16,
}: {
  color: string;
  soft?: boolean;
  size?: number;
  glyph?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: soft ? undefined : color,
        backgroundColor: soft ? `${color}1A` : color,
        color: soft ? color : "#fff",
      }}
    >
      <IconPlaceholder size={glyph} />
    </span>
  );
}

/** 초록 채움 주 버튼 */
export function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] text-[15.5px] font-bold text-white transition-transform active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  );
}

/** 섹션 소제목 */
export function SectionLabel({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="text-[14.5px] font-bold text-[var(--ink)]">{children}</h2>
      {right}
    </div>
  );
}

/** 언더라인 세그먼트 탭 (즐겨찾기/제보 내역) */
export function UnderlineTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex border-b border-[var(--line)]">
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(i)}
          className={`flex-1 pb-2.5 pt-2 text-center text-[14.5px] ${
            i === active
              ? "-mb-px border-b-2 border-[var(--ink)] font-bold text-[var(--ink)]"
              : "font-medium text-[var(--faint)]"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
