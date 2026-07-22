"use client";

import { useState } from "react";
import { MY_REPORTS, REPORT_STATUS, REPORT_TYPES } from "@/lib/data";
import { AppHeader, IconBadge, UnderlineTabs } from "@/components/ui";

export default function ReportsHistoryPage() {
  const [tab, setTab] = useState(0);

  return (
    <main className="flex flex-1 flex-col bg-white">
      <AppHeader title="제보 내역" backHref="/more" />
      <UnderlineTabs tabs={["내 제보", "참여한 제보"]} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 0 ? (
          <ul className="flex flex-col gap-3">
            {MY_REPORTS.map((r, i) => {
              const type = REPORT_TYPES.find((t) => t.id === r.typeId)!;
              const status = REPORT_STATUS[r.status];
              return (
                <li key={i} className="rounded-2xl border border-[var(--line)] p-4">
                  <p className="text-[15px] font-bold leading-snug text-[var(--ink)]">
                    {r.place}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <IconBadge color={type.color} soft size={30} glyph={14} />
                    <span className="flex-1 text-[13.5px] font-semibold" style={{ color: type.color }}>
                      {type.label}
                    </span>
                    <span
                      className="rounded-md px-2 py-[3px] text-[11.5px] font-semibold"
                      style={{ background: status.soft, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] text-[var(--faint)]">{r.ago}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="pt-16 text-center text-[13.5px] text-[var(--faint)]">
            아직 참여한 제보가 없어요
          </p>
        )}
      </div>
    </main>
  );
}
