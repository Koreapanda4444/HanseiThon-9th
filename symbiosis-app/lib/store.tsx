"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { INITIAL_FAVORITES } from "./data";

interface AppStore {
  /** 버릴 물건 필터 (칩/검색에서 설정) */
  itemFilter: string | null;
  setItemFilter: (v: string | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  /** 마지막으로 선택한 수거함 — 길찾기/제보 대상이 된다 */
  lastSelectedId: string | null;
  setLastSelectedId: (id: string) => void;
}

const Ctx = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [itemFilter, setItemFilter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const value = useMemo<AppStore>(
    () => ({
      itemFilter,
      setItemFilter,
      favorites,
      toggleFavorite: (id) =>
        setFavorites((prev) =>
          prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
        ),
      lastSelectedId,
      setLastSelectedId,
    }),
    [itemFilter, favorites, lastSelectedId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
