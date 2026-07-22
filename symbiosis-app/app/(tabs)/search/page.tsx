"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FREQUENT_ITEMS, ITEMS, RECOMMENDED_SEARCHES, SEARCH_HISTORY } from "@/lib/data";
import { useApp } from "@/lib/store";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { Chip, SectionLabel } from "@/components/ui";

export default function SearchPage() {
  const router = useRouter();
  const { setItemFilter } = useApp();
  const [notFound, setNotFound] = useState<string | null>(null);

  /** 물건명이면 필터 걸고 지도로 이동, 못 찾으면 머무르며 안내 */
  const go = (term: string) => {
    const item = ITEMS.find((i) => term.startsWith(i.label));
    if (!item) {
      setNotFound(term);
      return;
    }
    setNotFound(null);
    setItemFilter(item.label);
    router.push("/");
  };

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="flex flex-col gap-6 p-4 pt-[max(12px,env(safe-area-inset-top))]">
        {/* 검색바 */}
        <div>
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-white px-3.5 py-3">
            <IconPlaceholder size={19} className="text-[var(--faint)]" />
            <input
              type="text"
              placeholder="버릴 물건을 검색해보세요"
              enterKeyHint="search"
              className="w-full bg-transparent text-[14.5px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter 이중 발화 방지
                if (e.key === "Enter" && e.currentTarget.value.trim()) go(e.currentTarget.value.trim());
              }}
            />
            <IconPlaceholder size={19} className="text-[var(--ink)]" />
          </div>
          {notFound && (
            <p className="mt-2 px-1 text-[12.5px] text-[var(--sub)]">
              &lsquo;{notFound}&rsquo;에 맞는 수거함을 찾지 못했어요. 아래 품목에서 골라보세요.
            </p>
          )}
        </div>

        {/* 자주 찾는 물건 */}
        <section>
          <SectionLabel>자주 찾는 물건</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {FREQUENT_ITEMS.map((label) => (
              <Chip key={label} label={label} onClick={() => go(label)} />
            ))}
          </div>
        </section>

        {/* 검색 기록 */}
        <section>
          <SectionLabel
            right={
              <button type="button" className="text-[12.5px] font-medium text-[var(--faint)]">
                전체 삭제
              </button>
            }
          >
            검색 기록
          </SectionLabel>
          <ul>
            {SEARCH_HISTORY.map((h) => (
              <li key={h.term}>
                <button
                  type="button"
                  onClick={() => go(h.term)}
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <IconPlaceholder size={16} className="text-[var(--faint)]" />
                  <span className="flex-1 text-[14.5px] text-[var(--ink)]">{h.term}</span>
                  <span className="text-[12.5px] text-[var(--faint)]">{h.ago}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 사진으로 찾기 */}
        <section className="flex items-center gap-3 rounded-2xl border border-[var(--line)] p-4">
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-[15px] font-bold text-[var(--ink)]">
              사진으로 찾기
              <span className="rounded-full bg-[var(--green-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--green-deep)]">
                Beta
              </span>
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--sub)]">
              사진을 찍으면
              <br />
              AI가 물건 후보를 제안해요
            </p>
          </div>
          <button
            type="button"
            aria-label="사진 찍기"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)] active:scale-95"
          >
            <IconPlaceholder size={24} />
          </button>
        </section>

        {/* 추천 검색어 */}
        <section>
          <SectionLabel>추천 검색어</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {RECOMMENDED_SEARCHES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => go(s)}
                className="rounded-full bg-[var(--green-soft)] px-3.5 py-[7px] text-[13.5px] font-semibold text-[var(--green-deep)]"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
