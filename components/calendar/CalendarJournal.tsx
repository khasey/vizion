"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Trade } from "@/types/trades";

function summarize(trades: Trade[]) {
  const wins = trades.filter(t => t.profit_loss > 0).length;
  const losses = trades.filter(t => t.profit_loss <= 0).length;
  const winRate = trades.length ? wins / trades.length : 0;
  const pnl = trades.reduce((s, t) => s + t.profit_loss, 0);
  const best = trades.length ? Math.max(...trades.map(t => t.profit_loss)) : 0;
  const worst = trades.length ? Math.min(...trades.map(t => t.profit_loss)) : 0;
  return { wins, losses, winRate, pnl, best, worst, trades: trades.length };
}

export default function CalendarJournal({ selectedDate, onClose, trades }: { selectedDate?: string | null; onClose?: () => void; trades: Trade[] }) {
  const openDate = selectedDate;
  const stats = useMemo(() => summarize(trades), [trades]);

  return (
    <div className="space-y-4">
      {openDate && (
        <div className="mt-4 rounded-lg border border-divider bg-white dark:bg-black p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Trades for {new Date(openDate).toLocaleDateString()}</h3>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-md border"
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Stats Summary */}
          {trades.length > 0 && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-default-500">Win Rate</div>
                <div className="text-sm font-semibold">{(stats.winRate * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-xs text-default-500">Total PnL</div>
                <div className={`text-sm font-semibold ${stats.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stats.pnl >= 0 ? '+' : ''}{stats.pnl.toFixed(2)}$
                </div>
              </div>
              <div>
                <div className="text-xs text-default-500">Best Trade</div>
                <div className="text-sm font-semibold text-success">+{stats.best.toFixed(2)}$</div>
              </div>
              <div>
                <div className="text-xs text-default-500">Worst Trade</div>
                <div className="text-sm font-semibold text-danger">{stats.worst.toFixed(2)}$</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {trades.length === 0 ? (
              <div className="text-center text-default-500 py-4">No trades on this day</div>
            ) : (
              trades.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-md border border-divider p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{t.symbol}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${t.side === 'buy' || t.side === 'long' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                        {t.side.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-default-600 mt-1">
                      {new Date(t.trade_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • 
                      Entry: ${t.entry_price?.toFixed(2)} • Exit: ${t.exit_price?.toFixed(2)} • Qty: {t.quantity}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${t.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                    {t.profit_loss >= 0 ? '+' : ''}{t.profit_loss.toFixed(2)}$
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
