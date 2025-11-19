export type Setup = {
  id: string;
  name: string;
  color: string;
  description?: string;
};

export type Trade = {
  id: string;
  setupId: string;
  hour: number; // 0-23
  pnl: number; // profit/loss in account currency
  rr: number; // risk-reward
  win: boolean;
};

export type HourlyAgg = {
  hour: number;
  avgPnl: number;
  winRate: number;
  trades: number;
};

export default Setup;
