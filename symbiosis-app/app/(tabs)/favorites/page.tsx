"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ITEMS, PLACES, SEARCH_HISTORY } from "@/lib/data";
import { useApp } from "@/lib/store";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { AppHeader, CategoryTag, UnderlineTabs } from "@/components/ui";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, toggleFavorite, setItemFilter } = useApp();
  const [tab, setTab] = useState(0);
  const favPlaces = PLACES.filter((p) => favorites.includes(p.id));

  /** 검색 탭과 동일하게: 물건명이면 필터 걸고 지도로 */
  const goHistory = (term: string) => {
    const item = ITEMS.find((i) => term.startsWith(i.label));
    setItemFilter(item ? item.label : null);
    router.push("/");
  };

  return (
    <main className="flex flex-1 flex-col bg-white">
      <AppHeader
        title="즐겨찾기"
        backHref="/"
        right={
          <button type="button" className="text-[13.5px] font-medium text-[var(--sub)]">
            편집
          </button>
        }
      />
      <UnderlineTabs tabs={["수거함", "검색 기록"]} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 0 ? (
          favPlaces.length ? (
            <ul className="flex flex-col gap-3">
              {favPlaces.map((p) => (
                <li key={p.id} className="rounded-2xl border border-[var(--line)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-bold leading-snug text-[var(--ink)]">
                      {p.name}
                    </p>
                    <button
                      type="button"
                      aria-label="즐겨찾기 해제"
                      onClick={() => toggleFavorite(p.id)}
                      className="-m-2.5 mt-0.5 p-2.5 text-[var(--green)]"
                    >
                      <IconPlaceholder size={18} />
                    </button>
                  </div>
                  <p className="mt-1 text-[12.5px] text-[var(--sub)]">
                    <b className="font-semibold text-[var(--ink)]">{p.distanceM}m</b>
                    {" · "}{p.address}
                  </p>
                  <div className="mt-2.5">
                    <CategoryTag category={p.category} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pt-16 text-center text-[13.5px] text-[var(--faint)]">
              아직 즐겨찾기한 수거함이 없어요
            </p>
          )
        ) : (
          <ul>
            {SEARCH_HISTORY.map((h) => (
              <li key={h.term}>
                <button
                  type="button"
                  onClick={() => goHistory(h.term)}
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <IconPlaceholder size={16} className="text-[var(--faint)]" />
                  <span className="flex-1 text-[14.5px] text-[var(--ink)]">{h.term}</span>
                  <span className="text-[12.5px] text-[var(--faint)]">{h.ago}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
