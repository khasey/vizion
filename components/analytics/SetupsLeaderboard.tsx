"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import type { Setup } from "@/components/analytics/types";
import { simulateTradesForSetup } from "@/components/analytics/helpers";

type Row = {
  id: string;
  name: string;
  color: string;
  winRate: number;
  profitFactor: number;
  averageRR: number;
  pnl: number;
  trades: number;
  bestTrade: number;
  worstTrade: number;
};

function computeRow(setup: Setup): Row {
  const trades = simulateTradesForSetup(setup, 50);
  const wins = trades.filter((t: any) => t.pnl > 0);
  const losses = trades.filter((t: any) => t.pnl <= 0);
  const winRate = trades.length ? wins.length / trades.length : 0;
  const profitFactor = (wins.reduce((s: number, t: any) => s + t.pnl, 0)) / Math.max(1e-6, Math.abs(losses.reduce((s: number, t: any) => s + t.pnl, 0)));
  const averageRR = trades.length ? trades.reduce((s: number, t: any) => s + t.rr, 0) / trades.length : 0;
  const pnl = trades.reduce((s: number, t: any) => s + t.pnl, 0);
  const bestTrade = Math.max(...trades.map((t: any) => t.pnl));
  const worstTrade = Math.min(...trades.map((t: any) => t.pnl));
  return {
    id: setup.id,
    name: setup.name,
    color: setup.color,
    winRate,
    profitFactor: isFinite(profitFactor) ? profitFactor : 0,
    averageRR,
    pnl,
    trades: trades.length,
    bestTrade,
    worstTrade,
  };
}

export function SetupsLeaderboard({ setups }: { setups: Setup[] }) {
  const rows = useMemo(() => setups.map(s => computeRow(s)), [setups]);
  const [sortKey, setSortKey] = useState<keyof Row>("winRate");
  const [reverse, setReverse] = useState(true);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (a[sortKey] === b[sortKey]) return 0;
      return (a[sortKey] < b[sortKey] ? -1 : 1) * (reverse ? -1 : 1);
    });
  }, [rows, sortKey, reverse]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg flex items-center gap-2"><Icon icon="mdi:trophy" /> Top Setups</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-default-600">Sort by:</label>
          <select value={sortKey as string} onChange={e => setSortKey(e.target.value as keyof Row)} className="rounded-md border border-divider bg-white dark:bg-black p-1">
            <option value="winRate">Win Rate</option>
            <option value="pnl">PnL</option>
            <option value="profitFactor">Profit Factor</option>
            <option value="averageRR">Avg RR</option>
            <option value="trades">Trades</option>
          </select>
          <button onClick={() => setReverse(prev => !prev)} className="rounded-md px-2 py-1 border border-divider">{reverse ? "Desc" : "Asc"}</button>
        </div>
      </div>
      <div className="bg-white dark:bg-black rounded-lg border border-divider overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-default-50 dark:bg-default-900">
            <tr>
              <th className="text-left px-3 py-2">Setup</th>
              <th className="text-right px-3 py-2">Win %</th>
              <th className="text-right px-3 py-2">PnL</th>
              <th className="text-right px-3 py-2">PF</th>
              <th className="text-right px-3 py-2">Avg RR</th>
              <th className="text-right px-3 py-2">Trades</th>
              <th className="text-right px-3 py-2">Best / Worst</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r.id} className="border-t border-divider">
                <td className="px-3 py-2 flex items-center gap-2">
                  <div className="w-3 h-6 rounded-sm" style={{ background: r.color }} />
                  <div>{r.name}</div>
                </td>
                <td className="px-3 py-2 text-right">{(r.winRate * 100).toFixed(0)}%</td>
                <td className="px-3 py-2 text-right">{r.pnl.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{r.profitFactor.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{r.averageRR.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{r.trades}</td>
                <td className="px-3 py-2 text-right">{r.bestTrade.toFixed(2)} / {r.worstTrade.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SetupsLeaderboard;
