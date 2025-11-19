"use client";

import { useMemo } from "react";
import type { Setup } from "@/components/analytics/types";
import { simulateTradesForSetup, computeHourlyAgg } from "@/components/analytics/helpers";

function toColor(value: number, maxAbs: number) {
  // Green for positive, red for negative, opacity by intensity
  if (maxAbs === 0) return "rgba(0,0,0,0.04)";
  const norm = Math.max(-1, Math.min(1, value / maxAbs));
  if (norm >= 0) {
    const opacity = 0.15 + 0.85 * norm; // 0.15 to 1.0
    return `rgba(34,197,94,${opacity})`; // green
  } else {
    const opacity = 0.15 + 0.85 * -norm;
    return `rgba(239,68,68,${opacity})`; // red
  }
}

export function TimeOfDayHeatmap({ setups }: { setups: Setup[] }) {
  const rows = useMemo(() => {
    return setups.map(s => {
      const trades = simulateTradesForSetup(s, 50);
      const hourly = computeHourlyAgg(trades);
      return { setup: s, hourly };
    });
  }, [setups]);

  // Find max absolute value of avgPnl across all to normalize colors
  const maxAbs = useMemo(() => {
    let max = 0;
    for (const r of rows) {
      for (const h of r.hourly) max = Math.max(max, Math.abs(h.avgPnl));
    }
    return max;
  }, [rows]);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Time of Day Heatmap</h3>
      <div className="overflow-auto border rounded-lg border-divider bg-white dark:bg-black">
        <div className="p-3">
          <div className="flex items-center gap-2 text-sm mb-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-default-600">Positive average PnL</span>
            <div className="w-3 h-3 bg-red-500 rounded-sm ml-4" />
            <span className="text-default-600">Negative average PnL</span>
          </div>
          <div className="grid gap-2">
            {rows.map(r => (
              <div key={r.setup.id} className="flex items-center gap-2">
                <div className="w-28 flex items-center gap-2 pl-2">
                  <div className="w-3 h-6 rounded-sm" style={{ background: r.setup.color }} />
                  <div className="truncate">{r.setup.name}</div>
                </div>
                <div className="flex-1 overflow-auto">
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                    {r.hourly.map(h => (
                      <div key={h.hour} className="h-6" style={{ background: toColor(h.avgPnl, maxAbs) }} title={`Hour ${h.hour}: Avg PnL ${h.avgPnl.toFixed(2)}, WinRate ${Math.round(h.winRate * 100)}%`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeOfDayHeatmap;
