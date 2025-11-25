"use client";

import { Icon } from "@iconify/react";
import SetupsManager from "@/components/analytics/SetupsManager";
import SetupsLeaderboard from "@/components/analytics/SetupsLeaderboard";
import TimeOfDayHeatmap from "@/components/analytics/TimeOfDayHeatmap";
import { useEffect, useState } from "react";
import type { Setup } from "@/components/analytics/types";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@heroui/button";
import NextLink from "next/link";

export default function SetupsPage() {
  const [setups, setSetups] = useState<Setup[]>([]);
  
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vizion:setups");
      if (raw) setSetups(JSON.parse(raw));
    } catch (e) {
      setSetups([]);
    }
  }, []);

  // Mock data for setup statistics - in real app, this would come from actual trade data
  const setupStats = setups.map((setup) => ({
    ...setup,
    trades: Math.floor(Math.random() * 50) + 10,
    winRate: Math.floor(Math.random() * 40) + 50,
    avgRR: (Math.random() * 2 + 1).toFixed(1),
    totalPnL: Math.floor(Math.random() * 5000) - 1000,
  }));

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:strategy" className="text-2xl" />
            Trading Setups
          </h2>
          <p className="text-sm text-default-600">
            Configure and analyze your trading strategies
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
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: "mdi:strategy",
              label: "Total Setups",
              value: setups.length.toString(),
              subtext: "Active configurations",
            },
            {
              icon: "mdi:trophy",
              label: "Best Win Rate",
              value: setupStats.length > 0 
                ? `${Math.max(...setupStats.map(s => s.winRate))}%`
                : "N/A",
              subtext: setupStats.length > 0
                ? setupStats.reduce((a, b) => a.winRate > b.winRate ? a : b).name
                : "No setups yet",
            },
            {
              icon: "mdi:chart-line",
              label: "Avg R-Multiple",
              value: setupStats.length > 0
                ? `${(setupStats.reduce((sum, s) => sum + parseFloat(s.avgRR), 0) / setupStats.length).toFixed(1)}R`
                : "N/A",
              subtext: "Across all setups",
            },
            {
              icon: "mdi:swap-horizontal",
              label: "Total Trades",
              value: setupStats.reduce((sum, s) => sum + s.trades, 0).toString(),
              subtext: "Using setups",
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

        {/* Setup Manager & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Setup Manager */}
          <div className="min-h-[500px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <SetupsManager onChange={(s) => setSetups(s)} />
              </div>
            </div>
          </div>

          {/* Setup Performance Leaderboard */}
          <div className="min-h-[500px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <SetupsLeaderboard setups={setups} />
              </div>
            </div>
          </div>
        </div>

        {/* Setup Performance Cards */}
        {setupStats.length > 0 && (
          <div>
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">Setup Performance</h3>
                  <p className="text-sm text-default-600">
                    Detailed statistics per setup
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {setupStats.map((setup) => (
                    <div
                      key={setup.id}
                      className="rounded-lg border border-divider p-4 hover:bg-default-50 dark:hover:bg-default-900 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-1 h-16 rounded-full"
                          style={{ backgroundColor: setup.color }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">
                            {setup.name}
                          </h4>
                          {setup.description && (
                            <p className="text-xs text-default-600">
                              {setup.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-default-100 dark:bg-default-800 rounded-lg p-3">
                          <p className="text-xs text-default-600 mb-1">
                            Trades
                          </p>
                          <p className="text-lg font-bold">{setup.trades}</p>
                        </div>
                        <div className="bg-default-100 dark:bg-default-800 rounded-lg p-3">
                          <p className="text-xs text-default-600 mb-1">
                            Win Rate
                          </p>
                          <p className="text-lg font-bold text-success">
                            {setup.winRate}%
                          </p>
                        </div>
                        <div className="bg-default-100 dark:bg-default-800 rounded-lg p-3">
                          <p className="text-xs text-default-600 mb-1">
                            Avg R/R
                          </p>
                          <p className="text-lg font-bold">{setup.avgRR}R</p>
                        </div>
                        <div className="bg-default-100 dark:bg-default-800 rounded-lg p-3">
                          <p className="text-xs text-default-600 mb-1">
                            Total P&L
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              setup.totalPnL >= 0
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            ${setup.totalPnL >= 0 ? "+" : ""}
                            {setup.totalPnL}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time of Day Heatmap */}
        <div>
          <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
              <TimeOfDayHeatmap setups={setups} />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {setups.length === 0 && (
          <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl p-12 bg-white dark:bg-black border border-divider text-center">
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
