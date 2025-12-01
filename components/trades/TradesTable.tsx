"use client";

import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";
import type { Trade } from "@/types/trades";

interface TradesTableProps {
  trades: Trade[];
  showActions?: boolean;
  maxHeight?: string;
}

export function TradesTable({ trades, showActions = false, maxHeight = "600px" }: TradesTableProps) {
  const [sortField, setSortField] = useState<keyof Trade>("trade_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterSymbol, setFilterSymbol] = useState<string>("all");

  // Get unique symbols
  const symbols = useMemo(() => {
    const uniqueSymbols = Array.from(new Set(trades.map((t) => t.symbol)));
    return uniqueSymbols.sort();
  }, [trades]);

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    let filtered = [...trades];

    if (filterSymbol !== "all") {
      filtered = filtered.filter((t) => t.symbol === filterSymbol);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [trades, filterSymbol, sortField, sortDirection]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPnL = filteredTrades.reduce((sum, t) => sum + t.profit_loss, 0);
    const winners = filteredTrades.filter((t) => t.profit_loss > 0).length;
    const losers = filteredTrades.filter((t) => t.profit_loss < 0).length;
    const winRate = filteredTrades.length > 0 ? (winners / filteredTrades.length) * 100 : 0;

    return { totalPnL, winners, losers, winRate };
  }, [filteredTrades]);

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-white dark:bg-black text-sm"
          >
            <option value="all">Tous les symboles</option>
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <span className="text-sm text-default-600">
            {filteredTrades.length} trade{filteredTrades.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-default-600">P&L:</span>
            <span
              className={`font-bold ${
                stats.totalPnL >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {stats.totalPnL >= 0 ? "+" : ""}
              {stats.totalPnL.toFixed(2)}$
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-default-600">Win Rate:</span>
            <span className="font-bold">{stats.winRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">{stats.winners}W</span>
            <span className="text-default-400">/</span>
            <span className="text-danger">{stats.losers}L</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-auto border border-divider rounded-lg"
        style={{ maxHeight }}
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-default-100 dark:bg-default-900 z-10">
            <tr>
              <th
                className="px-3 py-3 text-left font-semibold cursor-pointer hover:bg-default-200 dark:hover:bg-default-800 transition-colors"
                onClick={() => handleSort("trade_date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  {sortField === "trade_date" && (
                    <Icon
                      icon={
                        sortDirection === "asc"
                          ? "mdi:arrow-up"
                          : "mdi:arrow-down"
                      }
                    />
                  )}
                </div>
              </th>
              <th
                className="px-3 py-3 text-left font-semibold cursor-pointer hover:bg-default-200 dark:hover:bg-default-800 transition-colors"
                onClick={() => handleSort("symbol")}
              >
                <div className="flex items-center gap-2">
                  Symbol
                  {sortField === "symbol" && (
                    <Icon
                      icon={
                        sortDirection === "asc"
                          ? "mdi:arrow-up"
                          : "mdi:arrow-down"
                      }
                    />
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-left font-semibold">Side</th>
              <th className="px-3 py-3 text-right font-semibold">Entry</th>
              <th className="px-3 py-3 text-right font-semibold">Exit</th>
              <th className="px-3 py-3 text-center font-semibold">Qty</th>
              <th
                className="px-3 py-3 text-right font-semibold cursor-pointer hover:bg-default-200 dark:hover:bg-default-800 transition-colors"
                onClick={() => handleSort("profit_loss")}
              >
                <div className="flex items-center justify-end gap-2">
                  P&L
                  {sortField === "profit_loss" && (
                    <Icon
                      icon={
                        sortDirection === "asc"
                          ? "mdi:arrow-up"
                          : "mdi:arrow-down"
                      }
                    />
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-center font-semibold">Duration</th>
              <th className="px-3 py-3 text-left font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr
                key={trade.id}
                className="border-t border-divider hover:bg-default-50 dark:hover:bg-default-900 transition-colors"
              >
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatDate(trade.trade_date)}
                </td>
                <td className="px-3 py-3 font-mono font-semibold">
                  {trade.symbol}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      trade.side === "long" || trade.side === "buy"
                        ? "bg-success/20 text-success"
                        : "bg-danger/20 text-danger"
                    }`}
                  >
                    {trade.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {trade.entry_price.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {trade.exit_price.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-center">{trade.quantity}</td>
                <td
                  className={`px-3 py-3 text-right font-bold ${
                    trade.profit_loss >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {trade.profit_loss >= 0 ? "+" : ""}
                  {trade.profit_loss.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-center text-xs">
                  {trade.duration_minutes ? `${trade.duration_minutes}m` : "-"}
                </td>
                <td className="px-3 py-3 text-xs text-default-600">
                  {formatTime(trade.entry_time)} → {formatTime(trade.exit_time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12 text-default-600">
          <Icon icon="mdi:information-outline" className="text-4xl mb-2 mx-auto" />
          <p>Aucun trade trouvé</p>
        </div>
      )}
    </div>
  );
}
