"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { readDayTrades } from "./helpers";
import CalendarJournal from "./CalendarJournal";

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function endOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0);
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getCalendarStart(year: number, month: number) {
  const first = startOfMonth(year, month);
  // Start week on Monday
  const day = (first.getDay() + 6) % 7; // Monday=0 .. Sunday=6
  const start = new Date(first);
  start.setDate(first.getDate() - day);
  start.setHours(0,0,0,0);
  return start;
}

function getCalendarEnd(year: number, month: number) {
  const last = endOfMonth(year, month);
  const day = (last.getDay() + 6) % 7;
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - day));
  end.setHours(23,59,59,999);
  return end;
}

export default function CalendarMonth({ year, month }: { year?: number; month?: number }) {
  const now = new Date();
  const initYear = year ?? now.getFullYear();
  const initMonth = typeof month === "number" ? month : now.getMonth();
  const [curYear, setCurYear] = useState<number>(initYear);
  const [curMonth, setCurMonth] = useState<number>(initMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const start = useMemo(() => getCalendarStart(curYear, curMonth), [curYear, curMonth]);
  const end = useMemo(() => getCalendarEnd(curYear, curMonth), [curYear, curMonth]);

  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    return arr;
  }, [start, end]);

  function daySummary(date: string) {
    const trades = readDayTrades(date);
    if (!trades || trades.length === 0) return { trades: 0, pnl: 0 };
    return {
      trades: trades.length,
      pnl: trades.reduce((s, t) => s + t.pnl, 0),
    };
  }

  const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded-md border" onClick={() => {
                const prev = new Date(curYear, curMonth - 1);
                setCurYear(prev.getFullYear());
                setCurMonth(prev.getMonth());
              }}>
                <Icon icon="mdi:chevron-left" />
              </button>
              <h2 className="text-lg font-semibold">{new Date(curYear, curMonth).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h2>
              <button className="px-2 py-1 rounded-md border" onClick={() => {
                const next = new Date(curYear, curMonth + 1);
                setCurYear(next.getFullYear());
                setCurMonth(next.getMonth());
              }}>
                <Icon icon="mdi:chevron-right" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md border" onClick={() => setSelectedDate(null)}><Icon icon="mdi:calendar" /></button>
            </div>
          </div>
      <div className="grid grid-cols-7 gap-1 w-full">
        {weekdayNames.map((w) => (
          <div key={w} className="text-center text-xs font-semibold py-2">{w}</div>
        ))}
      </div>
  <div className="grid grid-cols-7 gap-2 mt-2 w-full h-full min-h-[60vh]">
        {days.map((d) => {
          const isCurrentMonth = d.getMonth() === curMonth;
          const date = formatDate(d);
          const sum = daySummary(date);
          const tradesList = readDayTrades(date);
          const positive = sum.pnl > 0;
          return (
            <div key={date} className={`rounded-lg p-2 border cursor-pointer flex flex-col justify-between ${isCurrentMonth ? "bg-white dark:bg-black" : "bg-default-100/60 dark:bg-default-900/60 opacity-50"} border-divider`} onClick={() => setSelectedDate(date)}>
              <div className="flex items-center justify-between">
                <div className="text-xs text-default-500">{d.getDate()}</div>
                <div className={`text-xs font-semibold ${positive ? "text-success" : sum.pnl === 0 ? "text-default-500" : "text-danger"}`}>{sum.trades ? `${sum.trades} trades` : "—"}</div>
              </div>
              <div className="mt-2">
                <div className={`text-sm font-semibold ${positive ? "text-success" : sum.pnl === 0 ? "text-default-500" : "text-danger"}`}>{sum.pnl >= 0 ? "+" : ""}{sum.pnl.toFixed(2)} €</div>
                <div className="mt-1 space-y-1 text-xs text-default-600">
                  {tradesList.slice(0,3).map(t => (
                    <div key={t.id} className="truncate">{t.time} • {t.notes ?? t.pnl.toFixed(2)} • {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)} €</div>
                  ))}
                  {tradesList.length > 3 && <div className="text-xs text-default-500">+{tradesList.length - 3} more</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day details */}
      <CalendarJournal selectedDate={selectedDate} onClose={() => setSelectedDate(null)} />
    </div>
  );
}
