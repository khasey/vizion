export interface Strategy {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  rules?: Record<string, any> | null;
  total_trades?: number | null;
  winning_trades?: number | null;
  losing_trades?: number | null;
  total_pnl?: number | null;
  win_rate?: number | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface StrategyStats {
  id: string;
  name: string;
  color: string;
  description?: string | null;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  total_pnl: number;
  win_rate: number;
  avg_rr: number;
  is_active: boolean;
}
