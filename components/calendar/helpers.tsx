export type CalTrade = {
  id: string;
  time: string; // HH:MM
  pnl: number;
  rr: number;
  notes?: string;
};

function seedFromString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function simulateTradesForDate(date: string, count = 8): CalTrade[] {
  const seed = seedFromString(date);
  const rnd = mulberry32(seed);
  const trades: CalTrade[] = [];
  for (let i = 0; i < count; i++) {
    const hour = Math.floor(rnd() * 8) + 9; // trading hours 9-16
    const minute = Math.floor(rnd() * 60);
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const rr = +(0.5 + rnd() * 3).toFixed(2);
    const win = rnd() > 0.45;
    const size = +(rnd() * 200 + 20).toFixed(2);
    const pnl = +(win ? size * rr : -size * (0.5 + rnd() * 1.5)).toFixed(2);
    trades.push({ id: `${date}-${i}`, time, pnl, rr, notes: win ? "win" : "loss" });
  }
  return trades;
}

export function readDayTrades(date: string): CalTrade[] {
  try {
    const raw = localStorage.getItem(`vizion:trades:${date}`);
    if (!raw) return [];
    return JSON.parse(raw) as CalTrade[];
  } catch (e) {
    return [];
  }
}

export function writeDayTrades(date: string, trades: CalTrade[]) {
  try {
    localStorage.setItem(`vizion:trades:${date}`, JSON.stringify(trades));
  } catch (e) {}
}
