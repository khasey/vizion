"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getTrades } from "@/app/actions/trades";
import type { Trade } from "@/types/trades";

export default function DashboardPage() {
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      const [recentResult, allResult] = await Promise.all([
        getTrades(5), // Last 5 trades for display
        getTrades(), // All trades for statistics
      ]);
      
      if (recentResult.data) {
        setRecentTrades(recentResult.data);
      }
      if (allResult.data) {
        setAllTrades(allResult.data);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  // Calculate statistics from real trades
  const STARTING_BALANCE = 0;
  const totalPnL = allTrades.reduce((sum, trade) => sum + trade.profit_loss, 0);
  const currentBalance = STARTING_BALANCE + totalPnL;
  const balanceChange = totalPnL >= 0 ? `+${totalPnL.toFixed(0)}` : totalPnL.toFixed(0);
  
  const winners = allTrades.filter(t => t.profit_loss > 0).length;
  const losers = allTrades.filter(t => t.profit_loss < 0).length;
  const totalTrades = allTrades.length;
  const winRate = totalTrades > 0 ? ((winners / totalTrades) * 100).toFixed(1) : "0.0";
  
  const totalWins = allTrades
    .filter(t => t.profit_loss > 0)
    .reduce((sum, t) => sum + t.profit_loss, 0);
  const totalLosses = Math.abs(
    allTrades
      .filter(t => t.profit_loss < 0)
      .reduce((sum, t) => sum + t.profit_loss, 0)
  );
  const profitFactor = totalLosses > 0 ? (totalWins / totalLosses).toFixed(1) : "0.0";
  
  // Calculate max drawdown
  let peak = STARTING_BALANCE;
  let maxDrawdown = 0;
  let runningBalance = STARTING_BALANCE;
  
  [...allTrades]
    .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    .forEach(trade => {
      runningBalance += trade.profit_loss;
      if (runningBalance > peak) peak = runningBalance;
      const drawdown = ((runningBalance - peak) / peak) * 100;
      if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    });
  
  const maxDrawdownValue = (peak * Math.abs(maxDrawdown) / 100).toFixed(0);
  
  // Calculate average R-multiple (using average win vs average loss)
  const avgWin = winners > 0 ? totalWins / winners : 0;
  const avgLoss = losers > 0 ? totalLosses / losers : 0;
  const avgRMultiple = avgLoss > 0 ? (avgWin / avgLoss).toFixed(1) : "0.0";

  // Generate equity curve from last 20 trades
  const last20Trades = [...allTrades]
    .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    .slice(-20);
  
  const equityCurveData = last20Trades.length > 0 
    ? (() => {
        let balance = 0;
        // Calculate starting balance for the last 20 trades
        const tradesBeforeLast20 = [...allTrades]
          .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
          .slice(0, -20);
        
        balance += tradesBeforeLast20.reduce((sum, t) => sum + t.profit_loss, 0);
        
        return last20Trades.map((trade, index) => {
          balance += trade.profit_loss;
          return { day: index + 1, value: balance };
        });
      })()
    : [{ day: 1, value: 0 }];

  const maxValue = Math.max(...equityCurveData.map((d) => d.value));
  const minValue = Math.min(...equityCurveData.map((d) => d.value));
  const range = maxValue - minValue || 1000; // Prevent division by zero

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold">Trading Journal</h2>
          <p className="text-sm text-default-600">
            Track, analyze, and improve your trading performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={NextLink}
            href="/dashboard/trades/new"
            color="primary"
            size="sm"
          >
            <Icon icon="mdi:plus" className="text-lg" />
            New Trade
          </Button>
          <Button isIconOnly variant="light">
            <Icon icon="mdi:bell" className="text-xl" />
          </Button>
          <Button isIconOnly variant="light">
            <Icon icon="mdi:cog" className="text-xl" />
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Performance Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: "mdi:wallet",
              label: "PnL Réalisé",
              value: `${totalPnL >= 0 ? '+' : ''}$${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
              change: `${balanceChange}$`,
              positive: totalPnL >= 0,
              subtext: `${totalTrades} trades`,
            },
            {
              icon: "mdi:chart-line",
              label: "Win Rate",
              value: `${winRate}%`,
              change: `${winners}/${totalTrades} trades`,
              positive: parseFloat(winRate) >= 50,
              subtext: `Target: 65%`,
            },
            {
              icon: "mdi:trending-up",
              label: "Profit Factor",
              value: profitFactor,
              change: totalTrades > 0 ? `${totalTrades} trades` : "No trades",
              positive: parseFloat(profitFactor) >= 1.5,
              subtext: parseFloat(profitFactor) >= 2 ? "Excellent" : parseFloat(profitFactor) >= 1.5 ? "Good" : "Needs work",
            },
            {
              icon: "mdi:arrow-down-bold",
              label: "Max Drawdown",
              value: `${Math.abs(maxDrawdown).toFixed(1)}%`,
              change: `-$${maxDrawdownValue}`,
              positive: false,
              subtext: Math.abs(maxDrawdown) < 10 ? "Acceptable" : "High",
            },
            {
              icon: "mdi:chart-box",
              label: "Avg R-Multiple",
              value: `${avgRMultiple}R`,
              change: `${winners}W / ${losers}L`,
              positive: parseFloat(avgRMultiple) >= 1.5,
              subtext: "Per trade",
            },
          ].map((stat, index) => (
            <div key={index} className="min-h-[140px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-5 bg-white dark:bg-black border border-divider">
                  <div className="flex items-center justify-between">
                    <div className="w-fit rounded-lg border border-gray-600 p-2">
                      <Icon
                        icon={stat.icon}
                        className="text-xl text-black dark:text-neutral-400"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        stat.positive === true
                          ? "text-success"
                          : stat.positive === false
                            ? "text-danger"
                            : "text-default-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
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

        {/* Equity Curve & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equity Curve */}
          <div className="lg:col-span-2 min-h-[400px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">Equity Curve</h3>
                    <p className="text-sm text-default-600">
                      Last 20 trading days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="light" size="sm">
                      1W
                    </Button>
                    <Button variant="light" size="sm" color="primary">
                      1M
                    </Button>
                    <Button variant="light" size="sm">
                      3M
                    </Button>
                    <Button variant="light" size="sm">
                      1Y
                    </Button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-default-600">
                    <span>${(maxValue / 1000).toFixed(1)}k</span>
                    <span>
                      ${((maxValue + minValue) / 2000).toFixed(1)}k
                    </span>
                    <span>${(minValue / 1000).toFixed(1)}k</span>
                  </div>
                  {/* Chart area */}
                  <div className="ml-16 h-full pb-8 relative">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 200"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="0"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-default-300 dark:text-default-700"
                      />
                      <line
                        x1="0"
                        y1="100"
                        x2="400"
                        y2="100"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-default-300 dark:text-default-700"
                      />
                      <line
                        x1="0"
                        y1="200"
                        x2="400"
                        y2="200"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-default-300 dark:text-default-700"
                      />
                      {/* Equity curve line */}
                      <polyline
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={equityCurveData
                          .map((d, i) => {
                            const x = (i / (equityCurveData.length - 1)) * 400;
                            const y =
                              200 - ((d.value - minValue) / range) * 200;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                      {/* Gradient fill under curve */}
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            style={{ stopColor: "#22c55e", stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                          />
                        </linearGradient>
                        <linearGradient
                          id="areaGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style={{ stopColor: "#22c55e", stopOpacity: 0.2 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#3b82f6", stopOpacity: 0 }}
                          />
                        </linearGradient>
                      </defs>
                      <polygon
                        fill="url(#areaGradient)"
                        points={`0,200 ${equityCurveData
                          .map((d, i) => {
                            const x = (i / (equityCurveData.length - 1)) * 400;
                            const y =
                              200 - ((d.value - minValue) / range) * 200;
                            return `${x},${y}`;
                          })
                          .join(" ")} 400,200`}
                      />
                    </svg>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-16 right-0 flex justify-between text-xs text-default-600">
                    <span>Day 1</span>
                    <span>Day 10</span>
                    <span>Day 20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Calendar */}
          <div className="min-h-[400px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div>
                  <h3 className="text-xl font-bold">November 2025</h3>
                  <p className="text-sm text-default-600">Trading activity</p>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className="font-semibold text-default-600">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => {
                    const isToday = i === 24;
                    const hasProfit = [2, 5, 8, 11, 15, 18, 22, 24].includes(i);
                    const hasLoss = [4, 9, 13, 20].includes(i);
                    const isWeekend = i % 7 === 5 || i % 7 === 6;

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                          isToday
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                            : hasProfit
                              ? "bg-success/20 text-success hover:bg-success/30"
                              : hasLoss
                                ? "bg-danger/20 text-danger hover:bg-danger/30"
                                : isWeekend
                                  ? "bg-default-100 dark:bg-default-800 text-default-400"
                                  : "bg-default-100 dark:bg-default-800 hover:bg-default-200 dark:hover:bg-default-700"
                        }`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-success/20"></div>
                    <span className="text-default-600">Profit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-danger/20"></div>
                    <span className="text-default-600">Loss</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 min-h-[400px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">Recent Trades</h3>
                  <Button
                    as={NextLink}
                    href="/dashboard/trades"
                    variant="light"
                    size="sm"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8 text-default-600">
                      <Icon icon="mdi:loading" className="text-3xl animate-spin mx-auto mb-2" />
                      <p className="text-sm">Chargement des trades...</p>
                    </div>
                  ) : recentTrades.length === 0 ? (
                    <div className="text-center py-8 text-default-600">
                      <Icon icon="mdi:information-outline" className="text-3xl mx-auto mb-2" />
                      <p className="text-sm mb-3">Aucun trade trouvé</p>
                      <Button
                        as={NextLink}
                        href="/dashboard/upload"
                        color="primary"
                        size="sm"
                      >
                        Importer des trades
                      </Button>
                    </div>
                  ) : recentTrades.map((trade, i) => (
                    <div
                      key={trade.id || i}
                      className="flex items-center justify-between p-4 rounded-lg border border-divider hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            trade.profit_loss >= 0
                              ? "bg-success/20"
                              : "bg-danger/20"
                          }`}
                        >
                          <Icon
                            icon={
                              trade.side === "long" || trade.side === "buy"
                                ? "mdi:arrow-up-bold"
                                : "mdi:arrow-down-bold"
                            }
                            className={`text-xl ${
                              trade.profit_loss >= 0 ? "text-success" : "text-danger"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold font-mono">{trade.symbol}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                trade.side === "long" || trade.side === "buy"
                                  ? "bg-success/20 text-success"
                                  : "bg-danger/20 text-danger"
                              }`}
                            >
                              {trade.side.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-default-600 mt-1">
                            <span>Entry: {trade.entry_price.toFixed(2)}</span>
                            <span>•</span>
                            <span>Exit: {trade.exit_price.toFixed(2)}</span>
                            <span>•</span>
                            <span className="text-default-500">
                              {new Date(trade.trade_date).toLocaleDateString('fr-FR', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-semibold text-lg ${
                            trade.profit_loss >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {trade.profit_loss >= 0 ? '+' : ''}{trade.profit_loss.toFixed(2)}$
                        </span>
                        <p className="text-xs text-default-600 mt-1">
                          {trade.quantity}x
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Notes & Quick Stats */}
          <div className="min-h-[400px] space-y-6">
            {/* Quick Actions */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <h3 className="text-xl font-bold">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    as={NextLink}
                    href="/dashboard/trades/new"
                    className="w-full justify-start"
                    color="primary"
                  >
                    <Icon icon="mdi:plus" className="text-xl" />
                    Add New Trade
                  </Button>
                  <Button
                    as={NextLink}
                    href="/dashboard/setups"
                    className="w-full justify-start"
                    variant="bordered"
                  >
                    <Icon icon="mdi:strategy" className="text-xl" />
                    Manage Setups
                  </Button>
                  <Button
                    as={NextLink}
                    href="/dashboard/insights"
                    className="w-full justify-start"
                    variant="bordered"
                  >
                    <Icon icon="mdi:lightbulb" className="text-xl" />
                    AI Insights
                  </Button>
                </div>
              </div>
            </div>

            {/* Today's Notes */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Today's Notes</h3>
                  <Button isIconOnly variant="light" size="sm">
                    <Icon icon="mdi:pencil" className="text-lg" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-default-100 dark:bg-default-800">
                    <p className="text-sm text-default-700 dark:text-default-300">
                      Market showing strong bullish momentum on EUR/USD. Waiting
                      for pullback to key support level.
                    </p>
                    <p className="text-xs text-default-500 mt-2">08:45 AM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-default-100 dark:bg-default-800">
                    <p className="text-sm text-default-700 dark:text-default-300">
                      Took profit early on GBP/JPY - need to work on letting
                      winners run.
                    </p>
                    <p className="text-xs text-default-500 mt-2">02:30 PM</p>
                  </div>
                </div>
                <Button
                  as={NextLink}
                  href="/dashboard/journal"
                  variant="light"
                  size="sm"
                  className="w-full"
                >
                  View All Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
