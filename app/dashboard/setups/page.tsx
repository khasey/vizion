"use client";

import { Icon } from "@iconify/react";
import SetupsManager from "@/components/analytics/SetupsManager";
import SetupsLeaderboard from "@/components/analytics/SetupsLeaderboard";
import TimeOfDayHeatmap from "@/components/analytics/TimeOfDayHeatmap";
import { useEffect, useState } from "react";
import type { Strategy, StrategyStats } from "@/types/strategies";
import { getStrategyStats } from "@/app/actions/strategies";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { FuturisticCard } from "@/components/ui/FuturisticCard";
import { FuturCard } from "@/components/ui/FuturCard";

export default function SetupsPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [strategyStats, setStrategyStats] = useState<StrategyStats[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStrategyStats();
  }, []);

  async function fetchStrategyStats() {
    setLoading(true);
    const result = await getStrategyStats();
    if (result.data) {
      setStrategyStats(result.data);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-gray-800/50 flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:strategy" className="text-2xl" />
            Trading Setups
          </h2>
          <p className="text-sm text-default-600">
            Configure and analyze your trading strategies
          </p>
        </div>
        
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: "mdi:strategy",
              label: "Total Setups",
              value: strategyStats.length.toString(),
              subtext: "Active strategies",
            },
            {
              icon: "mdi:trophy",
              label: "Best Win Rate",
              value: strategyStats.length > 0 
                ? `${Math.max(...strategyStats.map(s => s.win_rate)).toFixed(0)}%`
                : "N/A",
              subtext: strategyStats.length > 0
                ? strategyStats.reduce((a, b) => a.win_rate > b.win_rate ? a : b).name
                : "No setups yet",
            },
            {
              icon: "mdi:chart-line",
              label: "Avg R-Multiple",
              value: strategyStats.length > 0
                ? `${(strategyStats.reduce((sum, s) => sum + s.avg_rr, 0) / strategyStats.length).toFixed(1)}R`
                : "N/A",
              subtext: "Across all setups",
            },
            {
              icon: "mdi:swap-horizontal",
              label: "Total Trades",
              value: strategyStats.reduce((sum, s) => sum + s.total_trades, 0).toString(),
              subtext: "Using setups",
            },
          ].map((stat, index) => (
            <FuturisticCard
              key={index}
              title={stat.label}
              value={stat.value}
              change={stat.subtext}
              icon={stat.icon}
              isPositive={true}
            />
          ))}
        </div>

        {/* Setup Manager & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Setup Manager */}
          <FuturCard  className="max-h-[350px]">

              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
                <SetupsManager onChange={() => fetchStrategyStats()} />
              </div>

          </FuturCard>

          {/* Setup Performance Leaderboard */}
          <FuturCard  className="max-h-[350px]">
           
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6">
                <SetupsLeaderboard strategies={strategyStats} />
              </div>
    
          </FuturCard>
        </div>

        {/* Setup Performance Cards */}
        {strategyStats.length > 0 && (
          <div>
            <FuturCard  >
             
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 ">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">Setup Performance</h3>
                  <p className="text-sm text-default-600">
                    Detailed statistics per setup
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {strategyStats.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="rounded-lg p-4 bg-gray-100 dark:bg-gray-900/40 hover:bg-gray-200 dark:hover:bg-gray-800/60 transition-colors border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-1 h-16 rounded-full"
                          style={{ backgroundColor: strategy.color }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">
                            {strategy.name}
                          </h4>
                          {strategy.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {strategy.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-200 dark:bg-gray-800/80 rounded-lg p-3 border border-gray-300 dark:border-gray-700/50">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Trades
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{strategy.total_trades}</p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-800/80 rounded-lg p-3 border border-gray-300 dark:border-gray-700/50">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Win Rate
                          </p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {strategy.win_rate.toFixed(0)}%
                          </p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-800/80 rounded-lg p-3 border border-gray-300 dark:border-gray-700/50">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Avg R/R
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{strategy.avg_rr.toFixed(1)}R</p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-800/80 rounded-lg p-3 border border-gray-300 dark:border-gray-700/50">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Total P&L
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              strategy.total_pnl >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            ${strategy.total_pnl >= 0 ? "+" : ""}
                            {strategy.total_pnl.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FuturCard >
          </div>
        )}


        {/* Empty State */}
        {!loading && strategyStats.length === 0 && (
          <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl p-12 bg-white dark:bg-black text-center">
              <Icon
                icon="mdi:strategy"
                className="text-6xl text-default-400"
              />
              <div>
                <h3 className="text-xl font-bold mb-2">No setups yet</h3>
                <p className="text-default-600 mb-4">
                  Create your first trading setup to start tracking your strategies
                </p>
                <p className="text-sm text-default-500 max-w-md">
                  Setups help you categorize your trades by strategy type (e.g., Breakout, Reversal, Momentum).
                  This allows you to analyze which strategies work best for you.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
