"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
// tradingDays grid is rendered by CalendarMonth; this file only renders day details
import { simulateTradesForDate, readDayTrades, writeDayTrades, CalTrade } from "./helpers";

function summarize(trades: CalTrade[]) {
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl <= 0).length;
  const winRate = trades.length ? wins / trades.length : 0;
  const pnl = trades.reduce((s, t) => s + t.pnl, 0);
  const best = trades.length ? Math.max(...trades.map(t => t.pnl)) : 0;
  const worst = trades.length ? Math.min(...trades.map(t => t.pnl)) : 0;
  return { wins, losses, winRate, pnl, best, worst, trades: trades.length };
}

export default function CalendarJournal({ selectedDate, onClose }: { selectedDate?: string | null; onClose?: () => void }) {
  const [internalOpenDate, setInternalOpenDate] = useState<string | null>(null);
  const openDate = selectedDate ?? internalOpenDate;
  const [dayTrades, setDayTrades] = useState<CalTrade[]>([]);

  useEffect(() => {
    if (!openDate) return;
    const fromStorage = readDayTrades(openDate);
    if (fromStorage.length) setDayTrades(fromStorage);
    else setDayTrades(simulateTradesForDate(openDate, 8));
  }, [openDate]);

  function openDay(date: string) {
    if (typeof onClose === "function") {
      // If controlled, call onClose with null to indicate opening; parent should set selectedDate
      // But we don't have onOpen; instead we expect parent to set selectedDate via CalendarMonth.
      setInternalOpenDate(date);
    } else {
      setInternalOpenDate(date);
    }
  }

  function addTrade(t: Omit<CalTrade, "id">) {
  if (!openDate) return;
    const newTrade: CalTrade = { ...t, id: `${openDate}-${Date.now()}` };
    const next = [newTrade, ...dayTrades];
    setDayTrades(next);
    writeDayTrades(openDate, next);
  }

  function deleteTrade(id: string) {
  if (!openDate) return;
    const next = dayTrades.filter(d => d.id !== id);
    setDayTrades(next);
    writeDayTrades(openDate, next);
  }

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
                  setInternalOpenDate(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
          <div className="mb-4">
            <TradeForm onAdd={addTrade} />
          </div>
          <div className="space-y-2">
            {dayTrades.map(t => (
              <div key={t.id} className="flex items-center justify-between rounded-md border border-divider p-2">
                <div>
                  <div className="text-sm font-medium">{t.time} • {t.notes}</div>
                  <div className="text-xs text-default-600">RR {t.rr} • PnL {t.pnl.toFixed(2)} €</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-destructive" onClick={() => deleteTrade(t.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TradeForm({ onAdd }: { onAdd: (t: Omit<CalTrade, "id">) => void }) {
  const [time, setTime] = useState("09:30");
  const [pnl, setPnl] = useState(0);
  const [rr, setRr] = useState(1);
  const [notes, setNotes] = useState("");

  function submit(e: any) {
    e.preventDefault();
    onAdd({ time, pnl: Number(pnl), rr: Number(rr), notes });
    setPnl(0); setRr(1); setNotes("");
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
      <div>
        <label className="text-xs">Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full rounded-md border border-divider p-2 bg-transparent" />
      </div>
      <div>
        <label className="text-xs">PnL</label>
        <input type="number" step="0.01" value={pnl} onChange={e => setPnl(e.target.value as any)} className="mt-1 block w-full rounded-md border border-divider p-2 bg-transparent" />
      </div>
      <div>
        <label className="text-xs">RR</label>
        <input type="number" step="0.1" value={rr} onChange={e => setRr(e.target.value as any)} className="mt-1 block w-full rounded-md border border-divider p-2 bg-transparent" />
      </div>
      <div>
        <label className="text-xs">Notes</label>
        <div className="flex gap-2">
          <input value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full rounded-md border border-divider p-2 bg-transparent" />
          <button className="px-3 py-1 rounded-md bg-primary text-white" type="submit">Add</button>
        </div>
      </div>
    </form>
  );
}
