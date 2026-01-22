"use client";

import React from "react";
import type { OwnedProperty, Player, Tile } from "@/lib/types";
import { propertyGroups } from "@/lib/gameData";
import { isProperty } from "@/lib/rules";

export function TileDetail(props: { tile: Tile | null; owned: OwnedProperty | null; owner: Player | null }) {
  const { tile, owner } = props;
  const prop = tile && isProperty(tile) ? tile : null;
  const group = prop ? propertyGroups.find((g) => g.id === prop.groupId) : null;

  if (!tile) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
        Chọn một ô trên bàn để xem chi tiết.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {group ? <span className={`h-2.5 w-2.5 rounded-full ${group.colorClass}`} /> : null}
            <h3 className="truncate text-sm font-semibold text-zinc-900">Ô số {tile.index}</h3>
          </div>
          <div className="text-xs text-zinc-500">{prop ? group?.name : ""}</div>
        </div>
        {owner ? (
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Đang đứng: {owner.name}
          </div>
        ) : null}
      </div>

      <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">Ô đường đi trong vòng đua.</div>
    </div>
  );
}

