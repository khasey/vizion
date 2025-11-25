export interface TradingDay {
  date: string; // format YYYY-MM-DD
  pnl: number;
}

export const tradingDays: TradingDay[] = [
  { date: "2025-11-10", pnl: 120.5 },
  { date: "2025-11-11", pnl: -45.2 },
  { date: "2025-11-12", pnl: 0 },
  { date: "2025-11-13", pnl: 210.0 },
  { date: "2025-11-14", pnl: -80.0 },
  { date: "2025-11-15", pnl: 50.0 },
  { date: "2025-11-16", pnl: -10.0 },
];
