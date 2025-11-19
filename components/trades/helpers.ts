export type MyTrade = {
  id: string;
  date: string; // YYYY-MM-DD
  instrument?: string; // index or device name
  symbol: string; // e.g., EUR/USD
  pnl: number;
  setupId?: string; // id of setup
  status: "Long" | "Short";
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

export function simulateTrades(count = 10): MyTrade[] {
  const seed = seedFromString("vizion-all-trades");
  const rnd = mulberry32(seed);
  const symbols = ["EUR/USD", "GBP/JPY", "AAPL", "TSLA", "NDX", "SPX"];
  const instruments = ["Forex", "Equity", "Index", "Futures"];
  const arr: MyTrade[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const sym = symbols[Math.floor(rnd() * symbols.length)];
    const instrument = instruments[Math.floor(rnd() * instruments.length)];
    const pnl = +((rnd() * 400 - 200)).toFixed(2);
    const status = rnd() > 0.5 ? "Long" : "Short";
    arr.push({ id: `${date}-${i}`, date, instrument, symbol: sym, pnl, status });
  }
  return arr;
}

export function readAllTrades(): MyTrade[] {
  try {
    const raw = localStorage.getItem("vizion:trades:all");
    if (!raw) return simulateTrades(10);
    return JSON.parse(raw) as MyTrade[];
  } catch (e) {
    return simulateTrades(10);
  }
}

export function writeAllTrades(trades: MyTrade[]) {
  try {
    localStorage.setItem("vizion:trades:all", JSON.stringify(trades));
  } catch (e) {
    // ignore
  }
}
