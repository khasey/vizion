export interface Trade {
  id?: string;
  user_id: string;
  strategy_id?: string | null;
  symbol: string;
  trade_date: string;
  side: 'buy' | 'sell' | 'long' | 'short';
  entry_price: number;
  exit_price: number;
  quantity: number;
  profit_loss: number;
  commission?: number;
  entry_time?: string | null;
  exit_time?: string | null;
  duration_minutes?: number | null;
  notes?: string | null;
  tags?: string[] | null;
  screenshot_urls?: string[] | null;
  csv_filename?: string | null;
  uploaded_at?: string;
}

export interface CSVRow {
  Account: string;
  Status: string;
  Remarks: string;
  'Buy/Sell': string;
  'Qty To Fill': string;
  'Max Show Qty': string;
  Symbol: string;
  'Price Type': string;
  'Avg Fill Price': string;
  'Limit Price': string;
  'Order Number': string;
  'Original Sequence Number': string;
  'Current Sequence Number': string;
  'User Id': string;
  'Update Time (RST)': string;
  'Qty Filled': string;
  'Create Time (RST)': string;
  'Liquidity Indicator': string;
  'Executing Venue': string;
}

export interface ParsedTrade {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  orderNumber: string;
  status: string;
}

export interface TradeMatch {
  entry: ParsedTrade;
  exit: ParsedTrade;
  profit_loss: number;
  duration_minutes: number;
}
