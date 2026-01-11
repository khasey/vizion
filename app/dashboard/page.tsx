"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getTrades } from "@/app/actions/trades";
import { getStrategies } from "@/app/actions/strategies";
import type { Trade } from "@/types/trades";
import type { Strategy } from "@/types/strategies";
import { Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CircularRings from "@/components/CircularRings";
import PieChart from "@/components/PieChart";
import PerformanceStats from "@/components/PerformanceStats";
import PerformanceOverview from "@/components/PerformanceOverview";
import RecentTrades from "@/components/RecentTrades";
import LongVsShort from "@/components/LongVsShort";
import { FuturisticStrategyPieChart } from "@/components/ui/FuturisticStrategyPieChart";
import { FuturisticLongShortBattle } from "@/components/ui/FuturisticLongShortBattle";

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
  console.log('Total P&L calculation:', { totalPnL, tradeCount: allTrades.length, trades: allTrades.map(t => ({ id: t.id, pnl: t.profit_loss })) });
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

  // Prepare strategy data for pie chart
  const strategyChartData = Object.entries(setupDistribution).map(([name, data], index) => {
    // Assign colors based on index
    const colors = ['#00ff88', '#ffd700', '#ff3366', '#00d4ff', '#b366ff', '#ff6b35'];
    return {
      name,
      count: data.total,
      color: colors[index % colors.length],
      winners: data.winners,
      losers: data.losers,
      pnl: data.pnl,
    };
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-gray-800/50 flex items-center justify-between px-6 mt-0 md:mt-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-100  bg-clip-text ">
            Master Your Trading Edge
          </h2>
          <p className="text-sm text-gray-400 font-mono">
            Transform data into decisions. Turn insights into profits.
          </p>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full flex flex-col gap-4">
          {/* Performance Stats Cards */}
          <PerformanceStats
            totalPnL={totalPnL}
            balanceChange={balanceChange}
            totalTrades={totalTrades}
            winRate={winRate}
            winners={winners}
            profitFactor={profitFactor}
            maxDrawdown={maxDrawdown}
            maxDrawdownValue={maxDrawdownValue}
            avgRMultiple={avgRMultiple}
            losers={losers}
          />

          {/* Performance Overview + Recent Trades (left) / Distributions (right) */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Left column */}
            <div className="xl:col-span-2 flex flex-col">
              {/* Performance Overview */}
              <div className="flex-1">
                <PerformanceOverview
                  equityCurveData={equityCurveData}
                  maxValue={maxValue}
                  minValue={minValue}
                  range={range}
                  curveView={curveView}
                  setCurveView={setCurveView}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Long vs Short Battle with REAL data */}
              <FuturisticLongShortBattle
                longCount={directionDistribution['Long']?.total || 0}
                shortCount={directionDistribution['Short']?.total || 0}
              />
              
              {/* Strategy Distribution with REAL data */}
              {strategyChartData.length > 0 ? (
                <FuturisticStrategyPieChart
                  strategies={strategyChartData}
                />
              ) : (
                <div className="min-h-[300px] rounded-2xl border border-gray-800/50 p-4 bg-black/40 backdrop-blur-xl flex items-center justify-center">
                  <div className="text-center">
                    <Icon icon="mdi:chart-pie" className="text-4xl text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 font-mono text-sm">NO STRATEGY DATA</p>
                    <p className="text-gray-500 text-xs mt-1">Add strategies to your trades</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}