import Papa from 'papaparse';
import type { CSVRow, ParsedTrade, TradeMatch, Trade } from '@/types/trades';

export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Detect CSV format by checking the header
      const firstLine = text.split('\n')[0].trim();
      
      console.log('🔍 Analyzing CSV header:', firstLine);
      
      // Check if it's Deepchart format (semicolon-separated with specific columns)
      if (firstLine.includes('Symbol;DT;Quantity;Entry;Exit;ProfitLoss')) {
        console.log('🎯 Detected Deepchart CSV format');
        
        Papa.parse<any>(text, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(), // Remove whitespace from headers
          complete: (results) => {
            console.log('🔍 Deepchart parse results:', results.data.length);
            
            if (results.data.length > 0) {
              console.log('🔑 Column names found:', Object.keys(results.data[0]));
              console.log('📄 First row sample:', results.data[0]);
            }
            
            // Convert Deepchart format to standard CSVRow format
            const convertedRows = results.data
              .filter((row: any) => {
                // Filter out empty rows or invalid data
                const hasSymbol = row.Symbol && row.Symbol.trim() !== '';
                const hasDate = row.DT && row.DT.trim() !== '';
                const hasQuantity = row.Quantity && row.Quantity.toString().trim() !== '';
                const hasEntry = row.Entry && row.Entry.toString().trim() !== '';
                const hasExit = row.Exit && row.Exit.toString().trim() !== '';
                
                return hasSymbol && hasDate && hasQuantity && hasEntry && hasExit;
              })
              .map((row: any) => {
                const quantity = parseFloat(row.Quantity) || 0;
                const entryPrice = parseFloat(row.Entry) || 0;
                const exitPrice = parseFloat(row.Exit) || 0;
                const profitLoss = parseFloat(row.ProfitLoss) || 0;
                
                // Determine side from quantity sign (negative = short, positive = long)
                const isLong = quantity > 0;
                
                // Generate a unique order number
                const timestamp = new Date(row.DT).getTime();
                const orderNumber = `DC-${row.Symbol}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
                
                console.log(`📊 Converting Deepchart row: ${row.Symbol} ${isLong ? 'LONG' : 'SHORT'} ${Math.abs(quantity)} @ ${entryPrice} → ${exitPrice} = $${profitLoss}`);
                
                return {
                  Symbol: row.Symbol.trim(),
                  'Buy/Sell': isLong ? 'B' : 'S',
                  'Qty Filled': Math.abs(quantity).toString(),
                  'Avg Fill Price': entryPrice.toString(),
                  Status: 'Filled',
                  'Create Time (RST)': row.DT,
                  'Update Time (RST)': row.DT,
                  'Order Number': orderNumber,
                  _deepchartData: {
                    exitPrice,
                    profitLoss,
                    isMatched: true,
                    originalQuantity: quantity,
                  }
                };
              });
            
            console.log('✅ Converted Deepchart rows:', convertedRows.length);
            if (convertedRows.length > 0) {
              console.log('📄 Sample converted row:', convertedRows[0]);
            }
            resolve(convertedRows);
          },
          error: (error: Error) => {
            console.error('❌ Deepchart parse error:', error);
            reject(error);
          },
        });
        return;
      }
      
      // Original format: Find the "Completed Orders" section
      console.log('📋 Attempting to parse standard broker CSV format');
      const lines = text.split('\n');
      const completedOrdersLineIndex = lines.findIndex(line => line.includes('Completed Orders'));
      
      if (completedOrdersLineIndex === -1) {
        console.error('❌ "Completed Orders" section not found in CSV');
        console.log('💡 This might be an unsupported CSV format');
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
          console.log('🔍 Standard CSV parse results:', results.data.length);
          
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
          console.error('❌ Standard CSV parse error:', error);
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

  // Check if this is a Deepchart trade (pre-matched)
  const deepchartData = (row as any)._deepchartData;

  return {
    symbol: row.Symbol,
    side,
    quantity,
    price,
    timestamp,
    orderNumber: row['Order Number'],
    status: row.Status,
    ...(deepchartData && { _deepchartData: deepchartData })
  };
}

export function matchTrades(parsedTrades: ParsedTrade[]): TradeMatch[] {
  const matches: TradeMatch[] = [];
  
  // Check if trades are already matched (from Deepchart)
  const deepchartTrades = parsedTrades.filter((t: any) => t._deepchartData?.isMatched);
  
  if (deepchartTrades.length > 0) {
    console.log('🎯 Processing pre-matched Deepchart trades:', deepchartTrades.length);
    
    // For Deepchart, trades are already matched, create exit trades
    for (const entry of deepchartTrades) {
      const deepchartData = (entry as any)._deepchartData;
      
      // Create the exit trade with the opposite side
      const exit: ParsedTrade = {
        ...entry,
        side: entry.side === 'buy' ? 'sell' : 'buy',
        price: deepchartData.exitPrice,
        timestamp: entry.timestamp, // Same date, but exit would be later in time
        orderNumber: `${entry.orderNumber}-EXIT`,
        status: 'Filled'
      };
      
      console.log(`✅ Matched Deepchart trade: ${entry.symbol} ${entry.side.toUpperCase()} ${entry.quantity} @ ${entry.price} → ${exit.price} = $${deepchartData.profitLoss}`);
      
      matches.push({
        entry,
        exit,
        profit_loss: deepchartData.profitLoss,
        duration_minutes: 0, // Deepchart doesn't provide duration
      });
    }
    
    console.log(`🎉 Successfully matched ${matches.length} Deepchart trades`);
    return matches;
  }
  
  // Original matching logic for non-Deepchart trades
  console.log('📊 Using FIFO matching for standard broker trades');
  
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

  console.log(`✅ Matched ${matches.length} trades using FIFO`);
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
  console.log('📁 Processing CSV file:', file.name);
  
  const rows = await parseCSV(file);
  console.log('📊 Total CSV rows:', rows.length);
  
  if (rows.length === 0) {
    console.warn('⚠️ No valid rows found in CSV');
    return [];
  }
  
  console.log('📋 First row sample:', rows[0]);
  
  const parsedTrades = rows
    .map(parseTradeRow)
    .filter((trade): trade is ParsedTrade => trade !== null);

  console.log('✅ Parsed filled orders:', parsedTrades.length);
  
  if (parsedTrades.length === 0) {
    console.warn('⚠️ No valid trades found after parsing');
    return [];
  }
  
  console.log('🔍 Sample trades:', parsedTrades.slice(0, 3));
  
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
    console.log('💡 For Deepchart format, ensure the CSV has the correct headers');
  }
  
  const trades = matches.map((match) => convertToTrade(match, userId, file.name));

  console.log('🎉 Successfully processed', trades.length, 'trades');
  return trades;
}