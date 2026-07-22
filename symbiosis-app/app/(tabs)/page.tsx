"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ITEMS, MAP_CHIP_ITEMS, PLACES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { FakeMap, MapControls } from "@/components/fake-map";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { CategoryTag, Chip, PrimaryButton } from "@/components/ui";

export default function MapHome() {
  const router = useRouter();
  const { itemFilter, setItemFilter, favorites, toggleFavorite, setLastSelectedId } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filterCategory = useMemo(
    () => ITEMS.find((i) => i.label === itemFilter)?.category ?? null,
    [itemFilter],
  );
  const visible = useMemo(
    () => (filterCategory ? PLACES.filter((p) => p.category === filterCategory) : PLACES),
    [filterCategory],
  );
  const selected = visible.find((p) => p.id === selectedId) ?? null;

  return (
    <main className="relative flex-1 overflow-hidden bg-[var(--map-paper)]">
      <FakeMap
        places={visible}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          if (id) setLastSelectedId(id);
        }}
      />

      {/* 상단: 검색바 + 물건 칩 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col gap-2 p-3 pt-[max(10px,env(safe-area-inset-top))]">
        <Link
          href="/search"
          className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-white px-3.5 py-3 shadow-sm"
        >
          <IconPlaceholder size={19} className="text-[var(--faint)]" />
          <span className="flex-1 text-[14.5px] text-[var(--faint)]">
            어떤 물건을 버릴지 검색해보세요
          </span>
          <IconPlaceholder size={19} className="text-[var(--ink)]" />
        </Link>
        <div className="pointer-events-auto -mx-3 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-1.5 pb-1">
            {/* 검색에서 설정된 칩 밖 필터(예: 페트병)도 보이고 해제할 수 있게 맨 앞에 노출 */}
            {[
              ...(itemFilter && !MAP_CHIP_ITEMS.includes(itemFilter) ? [itemFilter] : []),
              ...MAP_CHIP_ITEMS,
            ].map((label) => (
              <Chip
                key={label}
                label={label}
                active={itemFilter === label}
                onClick={() => {
                  setItemFilter(itemFilter === label ? null : label);
                  setSelectedId(null);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {!selected && <MapControls bottom={118} />}
      {selected && <MapControls bottom={378} />}

      {/* 하단: 요약 배너 또는 상세 시트 */}
      {selected ? (
        <section className="absolute inset-x-0 bottom-0 z-40 rounded-t-2xl bg-white px-5 pb-4 pt-4 shadow-[0_-6px_24px_rgba(0,0,0,0.10)]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[17px] font-bold leading-snug text-[var(--ink)]">
              {selected.name}
            </h2>
            <div className="flex shrink-0 items-center gap-1.5">
              <CategoryTag category={selected.category} />
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setSelectedId(null)}
                className="-m-2 flex h-9 w-9 items-center justify-center p-2 text-[var(--faint)]"
              >
                <IconPlaceholder size={15} />
              </button>
            </div>
          </div>
          <p className="mt-1 text-[13px] text-[var(--sub)]">
            <b className="font-semibold text-[var(--ink)]">{selected.distanceM}m</b>
            {" · "}{selected.address}
          </p>

          <dl className="mt-4 flex flex-col gap-3 border-t border-[var(--line)] pt-4">
            <div>
              <dt className="text-[12px] font-semibold text-[var(--faint)]">수거 가능 품목</dt>
              <dd className="mt-0.5 text-[14px] text-[var(--ink)]">{selected.items}</dd>
            </div>
            <div>
              <dt className="text-[12px] font-semibold text-[var(--faint)]">이용자 확인</dt>
              <dd className="mt-1 flex items-center justify-between">
                <span
                  className={`flex items-center gap-1.5 text-[14px] font-semibold ${
                    selected.statusOk ? "text-[var(--green-deep)]" : "text-[#EF4444]"
                  }`}
                >
                  <IconPlaceholder size={15} />
                  {selected.statusLabel}
                </span>
                <span className="text-[12.5px] text-[var(--faint)]">{selected.statusAgo}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-semibold text-[var(--faint)]">운영시간</dt>
              <dd className="mt-0.5 text-[14px] text-[var(--ink)]">{selected.hours}</dd>
            </div>
          </dl>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(selected.id)}
              className={`flex h-[48px] flex-1 items-center justify-center gap-1.5 rounded-xl border text-[14.5px] font-semibold ${
                favorites.includes(selected.id)
                  ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green-deep)]"
                  : "border-[var(--line)] bg-white text-[var(--ink)]"
              }`}
            >
              <IconPlaceholder size={16} />
              즐겨찾기
            </button>
            <PrimaryButton
              className="!h-[48px] flex-[1.3] !w-auto"
              onClick={() => router.push("/directions")}
            >
              <IconPlaceholder size={16} />
              길찾기
            </PrimaryButton>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setSelectedId(visible[0]?.id ?? null)}
          className="absolute inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        >
          <span>
            <span className="block text-[15px] font-bold text-[var(--ink)]">
              주변 수거함 {visible.length}개
            </span>
            <span className="mt-0.5 block text-[12.5px] text-[var(--sub)]">
              내 위치 기준 500m 이내
            </span>
          </span>
          <IconPlaceholder size={16} className="text-[var(--faint)]" />
        </button>
      )}
    </main>
  );
}
