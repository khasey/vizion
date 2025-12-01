import Papa from 'papaparse';
import type { CSVRow, ParsedTrade, TradeMatch, Trade } from '@/types/trades';

export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Find the "Completed Orders" section
      const lines = text.split('\n');
      const completedOrdersLineIndex = lines.findIndex(line => line.includes('Completed Orders'));
      
      if (completedOrdersLineIndex === -1) {
        console.error('❌ "Completed Orders" section not found in CSV');
        resolve([]);
        return;
      }
      
      // Skip the "Completed Orders" line and join from the header line
      const completedOrdersText = lines.slice(completedOrdersLineIndex + 1).join('\n');
      
      // Parse the CSV starting from the actual header line
      Papa.parse<CSVRow>(completedOrdersText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('🔍 Papa parse results:', results.data.length);
          
          // Debug: log first row and its keys
          if (results.data.length > 0) {
            const firstRow = results.data[0] as any;
            console.log('🔑 Column names found:', Object.keys(firstRow));
            console.log('📄 First row sample:', firstRow);
          }
          
          // Filter out rows that are section headers or empty
          const validRows = results.data.filter(
            (row) => {
              // Check if row has the essential fields
              const hasStatus = row.Status && row.Status.trim() !== '' && row.Status !== 'Status';
              const hasBuySell = row['Buy/Sell'] && row['Buy/Sell'].trim() !== '';
              const hasSymbol = row.Symbol && row.Symbol.trim() !== '';
              
              return hasStatus && hasBuySell && hasSymbol;
            }
          );
          
          console.log('✅ Valid rows after filtering:', validRows.length);
          if (validRows.length > 0) {
            console.log('📄 First valid row:', validRows[0]);
          }
          resolve(validRows);
        },
        error: (error: Error) => {
          console.error('❌ Papa parse error:', error);
          reject(error);
        },
      });
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function parseTradeRow(row: CSVRow): ParsedTrade | null {
  // Only process filled orders
  if (row.Status !== 'Filled') {
    return null;
  }

  const buySellRaw = row['Buy/Sell']?.trim().toUpperCase();
  const side = buySellRaw === 'B' ? 'buy' : buySellRaw === 'S' ? 'sell' : null;
  
  if (!side) {
    console.log('Invalid side:', row['Buy/Sell']);
    return null;
  }

  const price = parseFloat(row['Avg Fill Price']);
  const quantity = parseInt(row['Qty Filled'], 10);

  if (isNaN(price) || isNaN(quantity) || quantity === 0) {
    console.log('Invalid price or quantity:', { price: row['Avg Fill Price'], quantity: row['Qty Filled'] });
    return null;
  }

  // Use Create Time as the primary timestamp (when order was placed)
  const timestamp = row['Create Time (RST)'] || row['Update Time (RST)'];

  if (!timestamp) {
    console.log('No timestamp found');
    return null;
  }

  return {
    symbol: row.Symbol,
    side,
    quantity,
    price,
    timestamp,
    orderNumber: row['Order Number'],
    status: row.Status,
  };
}

export function matchTrades(parsedTrades: ParsedTrade[]): TradeMatch[] {
  const matches: TradeMatch[] = [];
  
  // Sort all trades by timestamp (oldest first)
  const sortedTrades = [...parsedTrades].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Track remaining quantity for each trade
  const remainingQty = sortedTrades.map(t => t.quantity);

  // Match trades using FIFO principle with quantity tracking
  for (let i = 0; i < sortedTrades.length; i++) {
    if (remainingQty[i] === 0) continue;

    const firstTrade = sortedTrades[i];
    
    // Look for a matching opposite side trade
    for (let j = i + 1; j < sortedTrades.length; j++) {
      if (remainingQty[j] === 0) continue;

      const secondTrade = sortedTrades[j];

      // Check if trades match (same symbol, opposite sides)
      const isSameSymbol = firstTrade.symbol === secondTrade.symbol;
      const isOppositeSide = 
        (firstTrade.side === 'buy' && secondTrade.side === 'sell') ||
        (firstTrade.side === 'sell' && secondTrade.side === 'buy');

      if (isSameSymbol && isOppositeSide) {
        // Match the minimum quantity available
        const matchQty = Math.min(remainingQty[i], remainingQty[j]);
        
        remainingQty[i] -= matchQty;
        remainingQty[j] -= matchQty;

        const entryTime = new Date(firstTrade.timestamp);
        const exitTime = new Date(secondTrade.timestamp);
        const durationMs = exitTime.getTime() - entryTime.getTime();
        const durationMinutes = Math.floor(durationMs / 60000);

        let profitLoss: number;
        let entry: ParsedTrade;
        let exit: ParsedTrade;

        if (firstTrade.side === 'buy') {
          // Long trade: Buy first, then Sell
          entry = { ...firstTrade, quantity: matchQty };
          exit = { ...secondTrade, quantity: matchQty };
          profitLoss = (exit.price - entry.price) * matchQty;
        } else {
          // Short trade: Sell first, then Buy
          entry = { ...firstTrade, quantity: matchQty };
          exit = { ...secondTrade, quantity: matchQty };
          profitLoss = (entry.price - exit.price) * matchQty;
        }

        matches.push({
          entry,
          exit,
          profit_loss: profitLoss,
          duration_minutes: durationMinutes,
        });

        // If first trade is fully matched, move to next
        if (remainingQty[i] === 0) break;
      }
    }
  }

  return matches;
}

export function convertToTrade(match: TradeMatch, userId: string, csvFilename: string): Trade {
  // Determine if it's a long or short trade
  const isLong = match.entry.side === 'buy';
  const side = isLong ? 'long' : 'short';

  return {
    user_id: userId,
    symbol: match.entry.symbol,
    trade_date: match.entry.timestamp,
    side: side,
    entry_price: match.entry.price,
    exit_price: match.exit.price,
    quantity: match.entry.quantity,
    profit_loss: match.profit_loss,
    commission: 0,
    entry_time: new Date(match.entry.timestamp).toTimeString().split(' ')[0],
    exit_time: new Date(match.exit.timestamp).toTimeString().split(' ')[0],
    duration_minutes: match.duration_minutes,
    notes: `Entry Order: ${match.entry.orderNumber}, Exit Order: ${match.exit.orderNumber}`,
    csv_filename: csvFilename,
  };
}

export async function processCSVFile(
  file: File,
  userId: string
): Promise<Trade[]> {
  const rows = await parseCSV(file);
  console.log('📊 Total CSV rows:', rows.length);
  console.log('📋 First row sample:', rows[0]);
  
  const parsedTrades = rows
    .map(parseTradeRow)
    .filter((trade): trade is ParsedTrade => trade !== null);

  console.log('✅ Parsed filled orders:', parsedTrades.length);
  console.log('🔍 Sample trades:', parsedTrades.slice(0, 5));
  
  // Group by symbol and side for debugging
  const bySymbol = parsedTrades.reduce((acc, t) => {
    if (!acc[t.symbol]) acc[t.symbol] = { buy: 0, sell: 0 };
    acc[t.symbol][t.side]++;
    return acc;
  }, {} as Record<string, { buy: number; sell: number }>);
  console.log('📈 Orders by symbol:', bySymbol);

  const matches = matchTrades(parsedTrades);
  console.log('🎯 Matched trades:', matches.length);
  
  if (matches.length === 0 && parsedTrades.length > 0) {
    console.warn('⚠️ No matches found! Check if quantities and symbols match exactly');
  }
  
  const trades = matches.map((match) => convertToTrade(match, userId, file.name));

  return trades;
}
