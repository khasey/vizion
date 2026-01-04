"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Gauge } from "@/components/ui/gauge";
import { getTrades } from "@/app/actions/trades";
import { getStrategies } from "@/app/actions/strategies";
import type { Trade } from "@/types/trades";
import type { Strategy } from "@/types/strategies";
import { Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CircularRings from "@/components/CircularRings";
import PieChart from "@/components/PieChart";

export default function DashboardPage() {
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [curveView, setCurveView] = useState<'equity' | 'pnl' | 'both'>('both');

  useEffect(() => {
    async function fetchTrades() {
      const [recentResult, allResult, strategiesResult] = await Promise.all([
        getTrades(5), // Last 5 trades for display
        getTrades(), // All trades for statistics
        getStrategies(), // All strategies for setup names
      ]);
      
      if (recentResult.data) {
        setRecentTrades(recentResult.data);
      }
      if (allResult.data) {
        setAllTrades(allResult.data);
      }
      if (strategiesResult.data) {
        setStrategies(strategiesResult.data);
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

  // Generate equity curve and PnL curve from last 20 trades
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
          const tradePnL = trade.profit_loss;
          balance += tradePnL;
          return { day: index + 1, equity: balance, pnl: tradePnL };
        });
      })()
    : [{ day: 1, equity: 0, pnl: 0 }];

  const maxEquity = Math.max(...equityCurveData.map((d) => d.equity));
  const minEquity = Math.min(...equityCurveData.map((d) => d.equity));
  const maxPnL = Math.max(...equityCurveData.map((d) => d.pnl), 0);
  const minPnL = Math.min(...equityCurveData.map((d) => d.pnl), 0);
  
  const maxValue = Math.max(maxEquity, maxPnL);
  const minValue = Math.min(minEquity, minPnL);
  const range = maxValue - minValue || 1000; // Prevent division by zero

  // Prepare data for Donut Chart - Setup Distribution
  const setupDistribution = allTrades.reduce((acc, trade) => {
    const strategy = strategies.find(s => s.id === trade.strategy_id);
    const setupName = strategy?.name || 'No Setup';
    if (!acc[setupName]) {
      acc[setupName] = { total: 0, winners: 0, losers: 0, pnl: 0 };
    }
    acc[setupName].total += 1;
    if (trade.profit_loss > 0) {
      acc[setupName].winners += 1;
    } else if (trade.profit_loss < 0) {
      acc[setupName].losers += 1;
    }
    acc[setupName].pnl += trade.profit_loss;
    return acc;
  }, {} as Record<string, { total: number; winners: number; losers: number; pnl: number }>);

  const pieChartData = Object.entries(setupDistribution).map(([name, data]) => ({
    name,
    value: data.total,
    winners: data.winners,
    losers: data.losers,
    pnl: data.pnl,
  }));

  // Prepare data for Direction Distribution (Long/Short)
  const directionDistribution = allTrades.reduce((acc, trade) => {
    const direction = (trade.side === 'long' || trade.side === 'buy') ? 'Long' : 'Short';
    if (!acc[direction]) {
      acc[direction] = { total: 0, winners: 0, losers: 0, pnl: 0 };
    }
    acc[direction].total += 1;
    if (trade.profit_loss > 0) {
      acc[direction].winners += 1;
    } else if (trade.profit_loss < 0) {
      acc[direction].losers += 1;
    }
    acc[direction].pnl += trade.profit_loss;
    return acc;
  }, {} as Record<string, { total: number; winners: number; losers: number; pnl: number }>);

  const directionChartData = Object.entries(directionDistribution).map(([name, data]) => ({
    name,
    value: data.total,
    winners: data.winners,
    losers: data.losers,
    pnl: data.pnl,
  }));

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  const DIRECTION_COLORS = { 'Long': '#22c55e', 'Short': '#ef4444' };

  // Prepare KPIs for Long/Short analysis
  const longData = directionDistribution['Long'] || { total: 0, winners: 0, losers: 0, pnl: 0 };
  const shortData = directionDistribution['Short'] || { total: 0, winners: 0, losers: 0, pnl: 0 };
  
  const directionKPIs = [
    {
      label: 'Long Win Rate',
      value: longData.total > 0 ? (longData.winners / longData.total) * 100 : 0,
      unit: '%',
      icon: 'mdi:arrow-up-bold',
      description: `${longData.winners}/${longData.total} trades`
    },
    {
      label: 'Short Win Rate',
      value: shortData.total > 0 ? (shortData.winners / shortData.total) * 100 : 0,
      unit: '%',
      icon: 'mdi:arrow-down-bold',
      description: `${shortData.winners}/${shortData.total} trades`
    },
    {
      label: 'Avg PnL Long',
      value: longData.total > 0 ? Math.abs(longData.pnl / longData.total) : 0,
      unit: '$',
      icon: 'mdi:cash-plus',
      description: `Total: ${longData.pnl >= 0 ? '+' : ''}${longData.pnl.toFixed(0)}$`
    },
    {
      label: 'Avg PnL Short',
      value: shortData.total > 0 ? Math.abs(shortData.pnl / shortData.total) : 0,
      unit: '$',
      icon: 'mdi:cash-minus',
      description: `Total: ${shortData.pnl >= 0 ? '+' : ''}${shortData.pnl.toFixed(0)}$`
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6 mt-0 md:mt-0">
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
          {/* PnL Réalisé */}
          <div className="min-h-[200px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-5 bg-white dark:bg-black">
                <div className="flex items-center justify-between">
                  <div className="w-fit rounded-lg border border-gray-600 p-2">
                    <Icon
                      icon="mdi:wallet"
                      className="text-xl text-black dark:text-neutral-400"
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      totalPnL >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {balanceChange}$
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </h3>
                  <p className="text-sm text-default-600 mb-0.5">PnL Réalisé</p>
                  <p className="text-xs text-default-500">{totalTrades} trades</p>
                </div>
              </div>
            </div>
          </div>

          {/* Win Rate avec Gauge */}
          <div className="min-h-[200px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative h-full flex flex-col overflow-hidden rounded-xl bg-white dark:bg-black">
                <div className="text-center p-4">
                  <h3 className="text-3xl font-bold mb-1">{winRate}%</h3>
                  <p className="text-sm text-default-600 mb-0.5">Win Rate</p>
                  <p className="text-xs text-default-500">{winners}/{totalTrades} trades</p>
                </div>
                <div className="flex-1 flex items-end px-4 pb-2">
                  <div className="w-full h-[120px]">
                    <Gauge value={parseFloat(winRate)} size={250} showValue={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Factor avec Gauge */}
          <div className="min-h-[200px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative h-full flex flex-col overflow-hidden rounded-xl bg-white dark:bg-black">
                <div className="text-center p-4">
                  <h3 className="text-3xl font-bold mb-1">{profitFactor}</h3>
                  <p className="text-sm text-default-600 mb-0.5">Profit Factor</p>
                  <p className="text-xs text-default-500">
                    {parseFloat(profitFactor) >= 2 ? "Excellent" : parseFloat(profitFactor) >= 1.5 ? "Good" : "Needs work"}
                  </p>
                </div>
                <div className="flex-1 flex items-end px-4 pb-2">
                  <div className="w-full h-[120px]">
                    <Gauge 
                      value={Math.min(100, parseFloat(profitFactor) * 33.33)} 
                      size={250}
                      showValue={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Max Drawdown */}
          <div className="min-h-[200px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-5 bg-white dark:bg-black">
                <div className="flex items-center justify-between">
                  <div className="w-fit rounded-lg border border-gray-600 p-2">
                    <Icon
                      icon="mdi:arrow-down-bold"
                      className="text-xl text-black dark:text-neutral-400"
                    />
                  </div>
                  <span className="text-xs font-semibold text-danger">
                    -${maxDrawdownValue}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{Math.abs(maxDrawdown).toFixed(1)}%</h3>
                  <p className="text-sm text-default-600 mb-0.5">Max Drawdown</p>
                  <p className="text-xs text-default-500">{Math.abs(maxDrawdown) < 10 ? "Acceptable" : "High"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Avg R-Multiple */}
          <div className="min-h-[200px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-5 bg-white dark:bg-black">
                <div className="flex items-center justify-between">
                  <div className="w-fit rounded-lg border border-gray-600 p-2">
                    <Icon
                      icon="mdi:chart-box"
                      className="text-xl text-black dark:text-neutral-400"
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      parseFloat(avgRMultiple) >= 1.5 ? "text-success" : "text-default-600"
                    }`}
                  >
                    {winners}W / {losers}L
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{avgRMultiple}R</h3>
                  <p className="text-sm text-default-600 mb-0.5">Avg R-Multiple</p>
                  <p className="text-xs text-default-500">Per trade</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts - Flex Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Equity Curve */}
          <div className="min-h-[250px] max-h-[600px] flex-1">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-xl p-4 bg-white dark:bg-black">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="text-lg font-bold">Performance Overview</h3>
                    <p className="text-xs text-default-600">
                      Last 20 trades
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Radio buttons for curve selection */}
                    <div className="flex items-center gap-1 bg-default-100 dark:bg-default-50/10 rounded-lg p-0.5">
                      <button
                        onClick={() => setCurveView('equity')}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                          curveView === 'equity'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200'
                        }`}
                      >
                        Equity
                      </button>
                      <button
                        onClick={() => setCurveView('pnl')}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                          curveView === 'pnl'
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200'
                        }`}
                      >
                        Trade PnL
                      </button>
                      <button
                        onClick={() => setCurveView('both')}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                          curveView === 'both'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200'
                        }`}
                      >
                        Both
                      </button>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-2 text-[10px]">
                      {(curveView === 'equity' || curveView === 'both') && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-default-600">Equity</span>
                        </div>
                      )}
                      {(curveView === 'pnl' || curveView === 'both') && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-default-600">PnL</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] text-default-600">
                    <span>${(maxValue / 1000).toFixed(1)}k</span>
                    <span>
                      ${((maxValue + minValue) / 2000).toFixed(1)}k
                    </span>
                    <span>${(minValue / 1000).toFixed(1)}k</span>
                  </div>
                  {/* Chart area */}
                  <div className="ml-12 h-full pb-6 relative">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 150"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="0"
                        stroke="currentColor"
                        strokeWidth="0.3"
                        className="text-default-300 dark:text-default-700"
                      />
                      <line
                        x1="0"
                        y1="75"
                        x2="400"
                        y2="75"
                        stroke="currentColor"
                        strokeWidth="0.3"
                        className="text-default-300 dark:text-default-700"
                      />
                      <line
                        x1="0"
                        y1="150"
                        x2="400"
                        y2="150"
                        stroke="currentColor"
                        strokeWidth="0.3"
                        className="text-default-300 dark:text-default-700"
                      />
                      {/* Equity curve line - connecting all trade points */}
                      {(curveView === 'equity' || curveView === 'both') && (
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(59, 130, 246, 0.3))' }}
                          points={equityCurveData
                            .map((d, i) => {
                              const x = (i / (equityCurveData.length - 1)) * 400;
                              const y = 150 - ((d.equity - minValue) / range) * 150;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                      {/* PnL curve line - connecting all trade PnL points */}
                      {(curveView === 'pnl' || curveView === 'both') && (
                        <polyline
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(34, 197, 94, 0.3))' }}
                          points={equityCurveData
                            .map((d, i) => {
                              const x = (i / (equityCurveData.length - 1)) * 400;
                              const y = 150 - ((d.pnl - minValue) / range) * 150;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                      {/* Trade points on equity line */}
                      {(curveView === 'equity' || curveView === 'both') && equityCurveData.map((d, i) => {
                        const x = (i / (equityCurveData.length - 1)) * 400;
                        const y = 150 - ((d.equity - minValue) / range) * 150;
                        
                        return (
                          <g key={`equity-point-${i}`}>
                            <circle
                              cx={x}
                              cy={y}
                              r="0.8"
                              fill="#3b82f6"
                              opacity="0.2"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="0.8"
                              fill="#3b82f6"
                              stroke="white"
                              strokeWidth="0.8"
                              style={{ cursor: 'pointer' }}
                              className="hover:r-3 transition-all"
                            />
                          </g>
                        );
                      })}
                      {/* Trade points on PnL line */}
                      {(curveView === 'pnl' || curveView === 'both') && equityCurveData.map((d, i) => {
                        const x = (i / (equityCurveData.length - 1)) * 400;
                        const y = 150 - ((d.pnl - minValue) / range) * 150;
                        
                        return (
                          <g key={`pnl-point-${i}`}>
                            <circle
                              cx={x}
                              cy={y}
                              r="0.8"
                              fill="#22c55e"
                              opacity="0.2"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="0.8"
                              fill="#22c55e"
                              stroke="white"
                              strokeWidth="0.8"
                              style={{ cursor: 'pointer' }}
                              className="hover:r-3 transition-all"
                            />
                          </g>
                        );
                      })}
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
                            style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#3b82f6", stopOpacity: 0 }}
                          />
                        </linearGradient>
                        <linearGradient
                          id="pnlAreaGradient"
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
                            style={{ stopColor: "#22c55e", stopOpacity: 0 }}
                          />
                        </linearGradient>
                      </defs>
                      {/* Area fill under equity curve */}
                      {(curveView === 'equity' || curveView === 'both') && (
                        <polygon
                          fill="url(#areaGradient)"
                          points={`0,150 ${equityCurveData
                            .map((d, i) => {
                              const x = (i / (equityCurveData.length - 1)) * 400;
                              const y = 150 - ((d.equity - minValue) / range) * 150;
                              return `${x},${y}`;
                            })
                            .join(" ")} 400,150`}
                        />
                      )}
                      {/* Area fill under PnL curve */}
                      {(curveView === 'pnl' || curveView === 'both') && (
                        <polygon
                          fill="url(#pnlAreaGradient)"
                          points={`0,150 ${equityCurveData
                            .map((d, i) => {
                              const x = (i / (equityCurveData.length - 1)) * 400;
                              const y = 150 - ((d.pnl - minValue) / range) * 150;
                              return `${x},${y}`;
                            })
                            .join(" ")} 400,150`}
                        />
                      )}
                    </svg>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-default-600">
                    <span>Day 1</span>
                    <span>Day 10</span>
                    <span>Day 20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Charts Column */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            {/* Trade Distribution by Setup */}
            <div className="min-h-[300px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 rounded-xl p-6 bg-white dark:bg-black">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">By Setup</h3>
                      <p className="text-sm text-default-600">
                        Strategy distribution
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center min-h-[250px]">
                    {allTrades.length === 0 ? (
                      <div className="text-center text-default-600">
                        <Icon icon="mdi:chart-pie" className="text-4xl mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No data to display</p>
                      </div>
                    ) : (
                      <PieChart/>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Distribution by Direction */}
            <div className="min-h-[300px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 rounded-xl p-6 bg-white dark:bg-black">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">By Direction</h3>
                      <p className="text-sm text-default-600">
                        Long vs Short
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center min-h-[250px]">
                    {allTrades.length === 0 ? (
                      <div className="text-center text-default-600">
                        <Icon icon="mdi:chart-pie" className="text-4xl mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No data to display</p>
                      </div>
                    ) : (
                      <CircularRings />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 p-6 gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 min-h-[400px] 
          ">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
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
        </div>
      </div>
    </>
  );
}
