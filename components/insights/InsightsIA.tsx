"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Setup } from "@/components/analytics/types";
import { simulateTradesForSetup, computeHourlyAgg } from "@/components/analytics/helpers";

function readSetups(): Setup[] {
  try {
    const raw = localStorage.getItem("vizion:setups");
    if (!raw) return [];
    return JSON.parse(raw) as Setup[];
  } catch (e) {
    return [];
  }
}

function simulateMarketSnapshot(seed = new Date().toISOString()) {
  // very small pseudo-market snapshot used for UX only.
  const score = seedFromString(seed) % 101; // 0..100
  const direction = score > 55 ? "Bullish" : score < 45 ? "Bearish" : "Neutral";
  const volatility = ((score % 20) / 20) * 2 + 0.2; // 0.2 - 2.2
  const change = (score - 50) / 2; // -25 .. 25
  return { direction, volatility, change: +change.toFixed(2) };
}

function seedFromString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export default function InsightsIA() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [seed, setSeed] = useState(() => new Date().toISOString());
  const snapshot = useMemo(() => simulateMarketSnapshot(seed), [seed]);

  useEffect(() => {
    setSetups(readSetups());
  }, []);

  const insights = useMemo(() => {
    const out: { title: string; reason?: string }[] = [];

    if (!setups.length) {
      out.push({ title: "No setups yet — create your first Setup to get insights" });
      return out;
    }

    // For each setup compute hourly agg and metrics
    const metrics = setups.map((s) => {
      const trades = simulateTradesForSetup(s, 60);
      const agg = computeHourlyAgg(trades);
      const avgPnl = trades.reduce((a, b) => a + b.pnl, 0) / trades.length;
      const avgRr = trades.reduce((a, b) => a + b.rr, 0) / trades.length;
      const bestHour = agg.reduce((best, cur) => (cur.avgPnl > best.avgPnl ? cur : best), agg[0]);
      const worstHour = agg.reduce((best, cur) => (cur.avgPnl < best.avgPnl ? cur : best), agg[0]);
      return { setup: s, trades, agg, avgPnl, avgRr, bestHour, worstHour };
    });

    // Example Insight: specific best hour > 20% improvement
    for (const m of metrics) {
      const rel = (m.bestHour.avgPnl - m.avgPnl) / (Math.abs(m.avgPnl) || 1);
      if (rel > 0.2 && m.bestHour.trades > 0) {
        out.push({
          title: `Ton setup ${m.setup.name} fonctionne ${(rel * 100).toFixed(0)}% mieux entre ${String(m.bestHour.hour).padStart(2, "0")}h et ${String((m.bestHour.hour + 1) % 24).padStart(2, "0")}h`,
          reason: `Average PnL ${m.avgPnl.toFixed(2)} vs hour ${m.bestHour.avgPnl.toFixed(2)} (${m.bestHour.trades} trades)`,
        });
      }
    }

    // Volume vs RR insight: compare avgRr and trades count
    const mostVolume = metrics.reduce((best, cur) => (cur.trades.length > best.trades.length ? cur : best), metrics[0]);
    const bestRr = metrics.reduce((best, cur) => (cur.avgRr > best.avgRr ? cur : best), metrics[0]);
    if (mostVolume.setup && bestRr.setup) {
      out.push({
        title: `${bestRr.setup.name} a un meilleur RR moyen (${bestRr.avgRr.toFixed(2)}) mais ${mostVolume.setup.name} génère plus de volume (${mostVolume.trades.length} trades).`,
      });
    }

    // Last 12 losing trades check (detect revenge trading)
    const allTrades = metrics.flatMap((m) => m.trades).sort((a, b) => a.id.localeCompare(b.id));
    const last12 = allTrades.slice(-12);
    const last12Losing = last12.filter(t => !t.win);
    if (last12.length === 12 && last12Losing.length >= 6) {
      out.push({
        title: `Vous avez ${last12Losing.length}/12 trades perdants récents — attention au revenge trading`,
      });
    }

    // Momentum stop after 15h rule
    const momentum = metrics.find((m) => m.setup.name.toLowerCase().includes("momentum"));
    if (momentum) {
      const after15 = momentum.agg.filter(h => h.hour >= 15);
      const avgAfter15 = after15.reduce((a, b) => a + b.avgPnl, 0) / (after15.length || 1);
      if (avgAfter15 < 0) {
        out.push({ title: `Conseil : Arrête les trades Momentum après 15h (avg PnL ${avgAfter15.toFixed(2)})` });
      }
    }

    // Market direction based suggestion
    if (snapshot.direction === "Bearish") {
      out.push({ title: "Market is Bearish: favor short-biased or mean-reversion strategies at US open" });
    } else if (snapshot.direction === "Bullish") {
      out.push({ title: "Market is Bullish: trend-following and momentum setups might perform better at open" });
    } else {
      out.push({ title: "Market is Neutral: prefer OPR/BnR setups or smaller position sizes" });
    }

    // deduplicate
    return out;
  }, [setups, seed, snapshot]);

  function regen() {
    setSeed(new Date().toISOString());
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"> 
            <Icon icon="mdi:robot" className="text-xl" /> Insights IA
          </h1>
          <p className="text-default-600 text-sm">Recommandations générées automatiquement par l'IA (local).</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-default-600 mr-2">Snapshot: <span className={`font-semibold ${snapshot.direction === "Bullish" ? "text-success" : snapshot.direction === "Bearish" ? "text-danger" : "text-default-600"}`}>{snapshot.direction}</span> {snapshot.change}%</div>
          <button className="px-3 py-1 rounded-md border" onClick={regen}>Regenerate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border p-4 bg-white dark:bg-black border-divider">
            <h3 className="text-lg font-semibold mb-2">Top Insights</h3>
            <div className="space-y-3">
              {insights.map((s, i) => (
                <div key={i} className="rounded-md border p-3 border-divider bg-default-100 dark:bg-default-900">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      {s.reason && <div className="text-xs text-default-600 mt-1">{s.reason}</div>}
                    </div>
                    <div className="ml-4">
                      <button className="text-xs px-2 py-1 rounded-md border">Explain</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border p-4 bg-white dark:bg-black border-divider">
            <h3 className="text-lg font-semibold mb-2">Market Snapshot</h3>
            <div className="text-sm text-default-600">Direction: <span className={`font-semibold ${snapshot.direction === "Bullish" ? "text-success" : snapshot.direction === "Bearish" ? "text-danger" : "text-default-600"}`}>{snapshot.direction}</span></div>
            <div className="text-sm text-default-600">Change: <span className="font-semibold">{snapshot.change}%</span></div>
            <div className="text-sm text-default-600">Volatility: <span className="font-semibold">{snapshot.volatility.toFixed(2)}</span></div>
            <div className="mt-4 text-sm">What I'd do at US Open:</div>
            <div className="mt-2 text-sm font-semibold">{snapshot.direction === "Bullish" ? "Favor momentum & trend setups with reduced size" : snapshot.direction === "Bearish" ? "Prefer shorts and mean reversion entries" : "Wait for confirmed direction; favor high RR setups"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
