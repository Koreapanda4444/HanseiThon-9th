"use client";

import { useState } from "react";
import { CATEGORIES, PLACES, REPORT_TYPES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { AppHeader, IconBadge, PrimaryButton } from "@/components/ui";

export default function ReportPage() {
  const { lastSelectedId } = useApp();
  const target = PLACES.find((p) => p.id === lastSelectedId) ?? PLACES[0];
  const [typeId, setTypeId] = useState<string>("ok");
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <main className="flex flex-1 flex-col bg-white">
        <AppHeader title="수거함 제보" backHref="/" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 pb-24">
          <IconBadge color="#12A15E" soft size={72} glyph={30} />
          <p className="text-[18px] font-bold text-[var(--ink)]">제보가 접수되었어요</p>
          <p className="text-center text-[13.5px] leading-relaxed text-[var(--sub)]">
            이웃들의 확인을 거쳐 수거함 정보에 반영됩니다.
            <br />
            함께 만드는 지도가 되어줘서 고마워요! (데모)
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-2 rounded-xl border border-[var(--line)] px-5 py-2.5 text-[14px] font-semibold text-[var(--ink)]"
          >
            새 제보 작성
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-white">
      <AppHeader title="수거함 제보" backHref="/" />
      <div className="flex flex-col gap-6 p-4 pb-8">
        {/* 대상 수거함 — 지도에서 마지막으로 선택한 곳 */}
        <div className="flex items-center gap-3">
          <IconBadge color={CATEGORIES[target.category].color} size={40} glyph={18} />
          <div>
            <p className="text-[15px] font-bold text-[var(--ink)]">{target.name}</p>
            <p className="text-[12.5px] text-[var(--sub)]">{target.address}</p>
          </div>
        </div>

        {/* 제보 유형 */}
        <section>
          <h2 className="mb-2.5 text-[14.5px] font-bold text-[var(--ink)]">제보 유형 선택</h2>
          <div className="grid grid-cols-3 gap-2">
            {REPORT_TYPES.map((t) => {
              const active = typeId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTypeId(t.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 ${
                    active
                      ? "border-[var(--green)] bg-[var(--green-soft)]/60"
                      : "border-[var(--line)] bg-white"
                  }`}
                >
                  <IconBadge color={t.color} soft size={38} glyph={17} />
                  <span
                    className={`text-[12px] leading-tight ${
                      active ? "font-bold text-[var(--green-deep)]" : "font-medium text-[var(--ink)]"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 사진 */}
        <section>
          <h2 className="mb-2.5 text-[14.5px] font-bold text-[var(--ink)]">
            사진 <span className="font-medium text-[var(--faint)]">(선택)</span>
          </h2>
          <button
            type="button"
            aria-label="사진 추가"
            className="flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-[var(--bg-soft)] text-[var(--faint)] ring-1 ring-inset ring-[var(--line)]"
          >
            <IconPlaceholder size={24} />
          </button>
        </section>

        {/* 추가 설명 */}
        <section>
          <h2 className="mb-2.5 text-[14.5px] font-bold text-[var(--ink)]">
            추가 설명 <span className="font-medium text-[var(--faint)]">(선택)</span>
          </h2>
          <div className="rounded-xl border border-[var(--line)] p-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              placeholder="상세 상황을 입력해주세요"
              className="h-20 w-full resize-none bg-transparent text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
            />
            <p className="text-right text-[11.5px] tabular-nums text-[var(--faint)]">
              {text.length}/200
            </p>
          </div>
        </section>

        <PrimaryButton onClick={() => setDone(true)}>제보하기</PrimaryButton>
      </div>
    </main>
  );
}
