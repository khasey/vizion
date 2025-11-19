import type { Trade, Setup, HourlyAgg } from "./types";

// Deterministic PRNG from string seed
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function simulateTradesForSetup(setup: Setup, count = 50): Trade[] {
  const seed = seedFromString(setup.name + setup.id);
  const rnd = mulberry32(seed);
  const trades: Trade[] = [];
  for (let i = 0; i < count; i++) {
    const hour = Math.floor(rnd() * 24);
    const rr = +(0.5 + rnd() * 3).toFixed(2);
    const winProb = 0.35 + rnd() * 0.4; // between 0.35 and 0.75
    const win = rnd() < winProb;
    // pnl magnitude reflects rr and randomness
    const base = (rnd() * 100 + 20) * (rr);
    const pnl = +(win ? base : -base * (0.6 + rnd() * 0.8)).toFixed(2);
    trades.push({ id: `${setup.id}-${i}`, setupId: setup.id, hour, pnl, rr, win });
  }
  return trades;
}

export function computeHourlyAgg(trades: Trade[]): HourlyAgg[] {
  const buckets: Map<number, { sumPnl: number; wins: number; trades: number }> = new Map();
  for (let h = 0; h < 24; h++) buckets.set(h, { sumPnl: 0, wins: 0, trades: 0 });
  for (const t of trades) {
    const b = buckets.get(t.hour)!;
    b.sumPnl += t.pnl;
    if (t.win) b.wins++;
    b.trades++;
  }
  const arr: HourlyAgg[] = [];
  for (let h = 0; h < 24; h++) {
    const b = buckets.get(h)!;
    arr.push({ hour: h, avgPnl: b.trades ? b.sumPnl / b.trades : 0, winRate: b.trades ? b.wins / b.trades : 0, trades: b.trades });
  }
  return arr;
}
