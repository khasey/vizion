"use client";

import { Icon } from "@iconify/react";
import CalendarMonth from "@/components/calendar/CalendarMonth";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { useState, useMemo, useEffect } from "react";
import { getTrades } from "@/app/actions/trades";
import type { Trade } from "@/types/trades";

export default function CalendarPage() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      const result = await getTrades();
      if (result.data) {
        setAllTrades(result.data);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  // Calculate monthly statistics
  const monthlyStats = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let totalTrades = 0;
    let totalPnL = 0;
    let winningDays = 0;
    let losingDays = 0;
    let bestDay = { date: "", pnl: -Infinity };
    let worstDay = { date: "", pnl: Infinity };

    // Group trades by day
    const tradesByDay: Record<string, Trade[]> = {};
    allTrades.forEach(trade => {
      const tradeDate = new Date(trade.trade_date);
      if (tradeDate.getFullYear() === currentYear && tradeDate.getMonth() === currentMonth) {
        const dateKey = trade.trade_date.split('T')[0]; // YYYY-MM-DD
        if (!tradesByDay[dateKey]) {
          tradesByDay[dateKey] = [];
        }
        tradesByDay[dateKey].push(trade);
      }
    });

    // Calculate stats for each day
    Object.entries(tradesByDay).forEach(([date, trades]) => {
      const dayPnL = trades.reduce((sum: number, t: Trade) => sum + t.profit_loss, 0);
      totalTrades += trades.length;
      totalPnL += dayPnL;
      
      if (dayPnL > 0) winningDays++;
      if (dayPnL < 0) losingDays++;
      
      if (dayPnL > bestDay.pnl) {
        bestDay = { date, pnl: dayPnL };
      }
      if (dayPnL < worstDay.pnl) {
        worstDay = { date, pnl: dayPnL };
      }
    });

    const tradingDays = winningDays + losingDays;
    const winRate = tradingDays > 0 ? ((winningDays / tradingDays) * 100).toFixed(1) : "0.0";

    return {
      totalTrades,
      totalPnL,
      winningDays,
      losingDays,
      tradingDays,
      winRate,
      bestDay,
      worstDay,
    };
  }, [currentYear, currentMonth, allTrades]);

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-gray-800/50 flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:calendar-month" className="text-2xl" />
            Trading Calendar
          </h2>
          <p className="text-sm text-default-600">
            Track your daily trading performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={NextLink}
            href="/dashboard"
            variant="light"
            size="sm"
          >
            <Icon icon="mdi:arrow-left" className="text-lg" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Monthly Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: "mdi:swap-horizontal",
              label: "Total Trades",
              value: monthlyStats.totalTrades.toString(),
              subtext: `${monthlyStats.tradingDays} trading days`,
            },
            {
              icon: "mdi:chart-line",
              label: "Win Rate",
              value: `${monthlyStats.winRate}%`,
              subtext: `${monthlyStats.winningDays}W / ${monthlyStats.losingDays}L`,
              positive: parseFloat(monthlyStats.winRate) >= 50,
            },
            {
              icon: "mdi:cash",
              label: "Total P&L",
              value: `${monthlyStats.totalPnL >= 0 ? "+" : ""}${monthlyStats.totalPnL.toFixed(2)}€`,
              subtext: "This month",
              positive: monthlyStats.totalPnL >= 0,
            },
            {
              icon: "mdi:trophy",
              label: "Best Day",
              value: monthlyStats.bestDay.pnl > -Infinity 
                ? `+${monthlyStats.bestDay.pnl.toFixed(2)}€`
                : "N/A",
              subtext: monthlyStats.bestDay.pnl > -Infinity
                ? new Date(monthlyStats.bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : "No trades yet",
              positive: true,
            },
            {
              icon: "mdi:calendar-check",
              label: "Avg per Day",
              value: monthlyStats.tradingDays > 0
                ? `${(monthlyStats.totalPnL / monthlyStats.tradingDays).toFixed(2)}€`
                : "N/A",
              subtext: "Trading days only",
              positive: monthlyStats.tradingDays > 0 && (monthlyStats.totalPnL / monthlyStats.tradingDays) >= 0,
            },
          ].map((stat, index) => (
            <div key={index} className="min-h-[120px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-4 bg-white dark:bg-black border border-divider">
                  <div className="flex items-center justify-between">
                    <div className="w-fit rounded-lg border border-gray-600 p-2">
                      <Icon
                        icon={stat.icon}
                        className="text-xl text-black dark:text-neutral-400"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 ${
                      stat.positive === true
                        ? "text-success"
                        : stat.positive === false
                          ? "text-danger"
                          : ""
                    }`}>
                      {stat.value}
                    </h3>
                    <p className="text-sm text-default-600 mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-xs text-default-500">{stat.subtext}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
            <CalendarMonth 
              year={currentYear} 
              month={currentMonth}
              trades={allTrades}
              onMonthChange={(year, month) => {
                setCurrentYear(year);
                setCurrentMonth(month);
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Icon icon="mdi:information" className="text-xl" />
              Calendar Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success/10 border-2 border-success flex items-center justify-center">
                  <Icon icon="mdi:trending-up" className="text-success text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Profitable Day</p>
                  <p className="text-xs text-default-600">Positive P&L</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-danger/10 border-2 border-danger flex items-center justify-center">
                  <Icon icon="mdi:trending-down" className="text-danger text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Loss Day</p>
                  <p className="text-xs text-default-600">Negative P&L</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-default-100 dark:bg-default-800 border-2 border-divider flex items-center justify-center">
                  <Icon icon="mdi:minus" className="text-default-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-sm">No Trading</p>
                  <p className="text-xs text-default-600">No trades recorded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
