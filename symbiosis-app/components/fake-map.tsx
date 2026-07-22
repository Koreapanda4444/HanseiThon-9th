"use client";

import { useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Place } from "@/lib/data";
import { CATEGORIES } from "@/lib/data";
import { IconPlaceholder } from "./icon-placeholder";

export const WORLD_W = 1300;
export const WORLD_H = 1300;

/** 지도 API 없이 동작하는 데모 지도 — 드래그 이동, 카테고리색 원형 핀 */
export function FakeMap({
  places,
  selectedId,
  onSelect,
  initialOffset = { x: -370, y: -300 },
}: {
  places: Place[];
  selectedId: string | null;
  /** null = 빈 지도 탭 → 선택 해제 */
  onSelect: (id: string | null) => void;
  initialOffset?: { x: number; y: number };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(initialOffset);
  const drag = useRef<{ id: number; sx: number; sy: number; bx: number; by: number; moved: boolean } | null>(null);

  const clamp = useCallback((x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    // 뷰포트가 월드보다 커도 하한이 상한(0)을 넘지 않게
    const minX = Math.min(0, el.clientWidth - WORLD_W);
    const minY = Math.min(0, el.clientHeight - WORLD_H);
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  }, []);

  // 마운트 시 컨테이너 실측 후 초기 오프셋 클램프 (첫 드래그 점프 제거)
  const attachContainer = useCallback(
    (el: HTMLDivElement | null) => {
      containerRef.current = el;
      if (el) setOffset((o) => clamp(o.x, o.y));
    },
    [clamp],
  );

  return (
    <div
      ref={attachContainer}
      className="relative h-full w-full touch-none select-none overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => {
        if (drag.current) return; // 두 번째 손가락 무시 (핀치 오동작 방지)
        (e.target as Element).setPointerCapture?.(e.pointerId);
        drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, bx: offset.x, by: offset.y, moved: false };
      }}
      onPointerMove={(e) => {
        if (!drag.current || e.pointerId !== drag.current.id) return;
        const dx = e.clientX - drag.current.sx;
        const dy = e.clientY - drag.current.sy;
        if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true;
        setOffset(clamp(drag.current.bx + dx, drag.current.by + dy));
      }}
      onPointerUp={(e) => {
        if (drag.current && e.pointerId !== drag.current.id) return;
        setTimeout(() => (drag.current = null), 0);
      }}
      onPointerCancel={(e) => {
        if (drag.current && e.pointerId !== drag.current.id) return;
        setTimeout(() => (drag.current = null), 0);
      }}
      onClick={(e) => {
        // 드래그가 아니었고 핀이 아닌 빈 지도를 탭 → 선택 해제
        if (drag.current?.moved) return;
        if ((e.target as Element).closest("button")) return;
        onSelect(null);
      }}
    >
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{ width: WORLD_W, height: WORLD_H, transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <MapArt />

        {/* 현재 위치: 큰 반투명 원 + 파란 점 */}
        <div className="absolute" style={{ left: 560, top: 660 }}>
          <span className="absolute -left-[70px] -top-[70px] block h-[140px] w-[140px] rounded-full bg-[#3E7BFA]/12" />
          <span className="absolute -left-[9px] -top-[9px] block h-[18px] w-[18px] rounded-full border-[3px] border-white bg-[#3E7BFA] shadow-md" />
        </div>

        {places.map((p) => {
          const active = p.id === selectedId;
          const color = CATEGORIES[p.category].color;
          return (
            <button
              key={p.id}
              type="button"
              aria-label={p.name}
              onClick={() => {
                if (drag.current?.moved) return;
                onSelect(p.id);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ${
                active ? "z-20 scale-[1.18]" : "z-10 hover:scale-110"
              }`}
              style={{ left: p.x, top: p.y }}
            >
              <span
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] ring-[2.5px] ring-white"
                style={{ background: color }}
              >
                <IconPlaceholder size={15} />
              </span>
            </button>
          );
        })}
      </div>

      <p className="pointer-events-none absolute bottom-1 left-2 z-10 text-[10px] text-[var(--faint)]">
        지도 데이터 · 데모 (API 연동 예정)
      </p>
    </div>
  );
}

/** 우측 플로팅 지도 컨트롤: 내 위치 + 줌 (시안 배치) */
export function MapControls({ bottom = 120 }: { bottom?: number }) {
  return (
    <div className="absolute right-3 z-30 flex flex-col items-center gap-2" style={{ bottom }}>
      <button
        type="button"
        aria-label="내 위치"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] shadow-sm active:scale-95"
      >
        <IconPlaceholder size={17} />
      </button>
      <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-sm">
        <button type="button" aria-label="확대" className="flex h-10 w-10 items-center justify-center text-[18px] font-semibold text-[var(--ink)] active:bg-black/5">
          +
        </button>
        <span className="mx-2 h-px bg-[var(--line)]" />
        <button type="button" aria-label="축소" className="flex h-10 w-10 items-center justify-center text-[18px] font-semibold text-[var(--ink)] active:bg-black/5">
          −
        </button>
      </div>
    </div>
  );
}

/** 밝은 회백색 도시 지도 아트 (시안 톤) — overlay로 경로 등을 얹을 수 있다 */
export function MapArt({ overlay }: { overlay?: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      width={WORLD_W}
      height={WORLD_H}
      className="absolute left-0 top-0"
      aria-hidden
    >
      <rect width={WORLD_W} height={WORLD_H} fill="var(--map-paper)" />

      {/* 경의선숲길 — 선형 공원 (초록) */}
      <path
        d="M 1040 0 C 980 220 1010 420 900 560 C 800 690 830 900 760 1300 L 900 1300 C 960 950 940 760 1030 620 C 1120 480 1090 240 1150 0 Z"
        fill="var(--map-park)"
      />

      {/* 공원 */}
      <path
        d="M 540 330 C 660 280 850 300 890 420 C 930 540 850 640 730 670 C 610 700 500 640 470 540 C 440 440 460 365 540 330 Z"
        fill="var(--map-park)"
      />
      <path
        d="M 590 400 C 660 370 780 385 800 460 C 820 535 760 590 680 605 C 600 620 530 580 520 510 C 512 455 530 425 590 400 Z"
        fill="var(--map-park-deep)"
      />

      {/* 도로 */}
      <g stroke="var(--map-road)" strokeLinecap="round" fill="none">
        <path d="M 60 120 L 1240 120" strokeWidth="34" />
        <path d="M 60 1180 L 1240 1180" strokeWidth="34" />
        <path d="M 120 60 L 120 1240" strokeWidth="34" />
        <path d="M 1180 60 L 1180 1240" strokeWidth="34" />
        <path d="M 120 800 C 350 780 520 820 700 790 C 880 760 1020 800 1180 780" strokeWidth="30" />
        <path d="M 430 120 C 440 350 410 560 430 800" strokeWidth="26" />
        <path d="M 120 560 L 470 545" strokeWidth="18" />
        <path d="M 250 560 L 250 1180" strokeWidth="18" />
        <path d="M 430 950 L 1180 960" strokeWidth="20" />
        <path d="M 640 790 C 650 900 640 1050 650 1180" strokeWidth="16" />
        <path d="M 430 300 L 120 310" strokeWidth="16" />
        <path d="M 900 120 C 890 220 910 280 940 350" strokeWidth="16" />
      </g>

      {/* 블록 */}
      <g fill="var(--map-block)">
        <rect x="160" y="150" width="230" height="120" rx="10" />
        <rect x="160" y="350" width="120" height="170" rx="10" />
        <rect x="300" y="350" width="100" height="80" rx="8" />
        <rect x="470" y="150" width="380" height="130" rx="10" />
        <rect x="930" y="150" width="200" height="180" rx="10" />
        <rect x="160" y="600" width="220" height="150" rx="10" />
        <rect x="290" y="830" width="110" height="90" rx="8" />
        <rect x="160" y="990" width="240" height="150" rx="10" />
        <rect x="470" y="840" width="140" height="90" rx="8" />
        <rect x="700" y="870" width="180" height="60" rx="8" />
        <rect x="470" y="1000" width="150" height="140" rx="10" />
        <rect x="700" y="1000" width="200" height="140" rx="10" />
        <rect x="960" y="1010" width="170" height="130" rx="10" />
        <rect x="1000" y="700" width="140" height="120" rx="10" />
      </g>
      <g fill="var(--map-block-deep)">
        <rect x="500" y="180" width="120" height="70" rx="8" />
        <rect x="200" y="1020" width="90" height="60" rx="8" />
        <rect x="1010" y="180" width="80" height="80" rx="8" />
      </g>

      {/* 나무 */}
      <g fill="var(--map-tree)">
        {[
          [520, 370], [590, 340], [680, 330], [780, 350], [850, 420],
          [860, 520], [800, 610], [700, 650], [590, 640], [500, 590],
          [480, 470], [545, 430], [990, 900], [960, 1000], [200, 540],
          [330, 300], [1100, 400], [1090, 620],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 10 : 7} opacity={0.9} />
        ))}
      </g>

      {/* 라벨 */}
      <g fontSize="14" fontWeight="600" fill="var(--map-label)">
        <text x="640" y="480" textAnchor="middle" fill="var(--map-label-park)">홍익문화공원</text>
        <text x="1005" y="470" textAnchor="middle" fill="var(--map-label-park)" transform="rotate(72 1005 470)">경의선숲길</text>
        <text x="275" y="215" textAnchor="middle">연남동</text>
        <text x="545" y="1075" textAnchor="middle">홍대거리</text>
      </g>

      {overlay}
    </svg>
  );
}
