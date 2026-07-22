"use client";

import { useState } from "react";
import { CATEGORIES, PLACES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MapArt } from "@/components/fake-map";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { AppHeader, PrimaryButton } from "@/components/ui";

const MODES = [
  { id: "walk", label: "도보", time: "2분", note: "횡단보도 0회, 계단 없음, 길이 평탄해요" },
  { id: "bike", label: "자전거", time: "1분", note: "자전거 도로 위주, 경사가 완만해요" },
  { id: "car", label: "차량", time: "1분", note: "골목 주행 구간, 주차 공간 확인이 필요해요" },
];

export default function DirectionsPage() {
  const { lastSelectedId } = useApp();
  const target = PLACES.find((p) => p.id === lastSelectedId) ?? PLACES[0];
  const targetColor = CATEGORIES[target.category].color;
  const [mode, setMode] = useState("walk");
  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <main className="flex h-dvh flex-col bg-white">
      <AppHeader title="길찾기" backHref="/" />

      {/* 출발/도착 */}
      <div className="shrink-0 px-5 pb-3 pt-1">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="flex w-5 justify-center">
              <span className="h-3 w-3 rounded-full border-[3px] border-[#3E7BFA] bg-white" />
            </span>
            <span className="text-[14px] font-medium text-[var(--ink)]">내 위치</span>
          </div>
          <div className="ml-[9px] h-3 w-px border-l-2 border-dotted border-[var(--line)]" />
          <div className="-mt-2.5 flex items-center gap-3">
            <span className="flex w-5 justify-center">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{ background: targetColor }}
              >
                <IconPlaceholder size={8} className="text-white" />
              </span>
            </span>
            <span className="text-[14px] font-bold text-[var(--ink)]">{target.name}</span>
          </div>
        </div>

        {/* 이동 수단 */}
        <div className="mt-4 flex gap-2">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 ${
                  active
                    ? "border-[var(--green)] bg-[var(--green-soft)]"
                    : "border-[var(--line)] bg-white"
                }`}
              >
                <IconPlaceholder
                  size={15}
                  className={active ? "text-[var(--green-deep)]" : "text-[var(--faint)]"}
                />
                <span
                  className={`text-[13px] ${
                    active ? "font-bold text-[var(--green-deep)]" : "font-medium text-[var(--sub)]"
                  }`}
                >
                  {m.label} <b className="tabular-nums">{m.time}</b>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 경로 지도 (정적) */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--map-paper)]">
        <div
          className="absolute left-1/2 top-0"
          style={{ width: 1300, height: 1300, transform: "translate(calc(-50% + 260px), -450px)" }}
        >
          <MapArt
            overlay={
              <path
                d="M 560 660 L 500 660 L 500 575 L 620 575 L 620 610"
                fill="none"
                stroke="#3E7BFA"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.1 13"
              />
            }
          />
          {/* 출발: 내 위치 */}
          <div className="absolute" style={{ left: 560, top: 660 }}>
            <span className="absolute -left-[34px] -top-[34px] block h-[68px] w-[68px] rounded-full bg-[#3E7BFA]/12" />
            <span className="absolute -left-[8px] -top-[8px] block h-4 w-4 rounded-full border-[3px] border-white bg-[#3E7BFA] shadow" />
          </div>
          {/* 도착: 수거함 */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: 620, top: 610 }}
          >
            <span
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] ring-[2.5px] ring-white"
              style={{ background: targetColor }}
            >
              <IconPlaceholder size={15} />
            </span>
          </div>
        </div>
      </div>

      {/* 하단 요약 */}
      <div className="shrink-0 border-t border-[var(--line)] p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <p className="text-[19px] font-extrabold text-[var(--ink)]">
          <span className="text-[var(--green)]">{activeMode.time}</span>
          <span className="mx-1 font-bold text-[var(--faint)]">·</span>
          <span className="tabular-nums">{target.distanceM}m</span>
        </p>
        <p className="mt-0.5 text-[13px] text-[var(--sub)]">{activeMode.note}</p>
        <PrimaryButton className="mt-3.5">길안내 시작</PrimaryButton>
      </div>
    </main>
  );
}
