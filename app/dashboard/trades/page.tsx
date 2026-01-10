"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { getTrades } from "@/app/actions/trades";
import { TradesTable } from "@/components/trades/TradesTable";
import type { Trade } from "@/types/trades";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { FuturisticCard } from "@/components/ui/FuturisticCard";

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    setLoading(true);
    const result = await getTrades();
    if (result.data) {
      setTrades(result.data);
    }
    setLoading(false);
  }

  // Calculate stats
  const stats = {
    totalTrades: trades.length,
    totalPnL: trades.reduce((sum, t) => sum + t.profit_loss, 0),
    winners: trades.filter((t) => t.profit_loss > 0).length,
    losers: trades.filter((t) => t.profit_loss < 0).length,
    winRate: trades.length > 0 ? (trades.filter((t) => t.profit_loss > 0).length / trades.length) * 100 : 0,
  };

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:chart-line" className="text-2xl" />
            My Trades
          </h2>
          <p className="text-sm text-default-600">
            View and manage all your trades
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={NextLink}
            href="/dashboard/upload"
            color="primary"
            size="sm"
          >
            <Icon icon="mdi:upload" className="text-lg" />
            Import CSV
          </Button>
          <Button
            as={NextLink}
            href="/dashboard/trades/new"
            variant="bordered"
            size="sm"
          >
            <Icon icon="mdi:plus" className="text-lg" />
            Add Trade
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: "mdi:chart-box",
              label: "Total Trades",
              value: stats.totalTrades,
              color: "text-primary",
            },
            {
              icon: "mdi:currency-usd",
              label: "Total P&L",
              value: `${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}$`,
              color: stats.totalPnL >= 0 ? "text-success" : "text-danger",
            },
            {
              icon: "mdi:trophy",
              label: "Win Rate",
              value: `${stats.winRate.toFixed(1)}%`,
              color: "text-success",
            },
            {
              icon: "mdi:check-circle",
              label: "Winners",
              value: stats.winners,
              color: "text-success",
            },
            {
              icon: "mdi:close-circle",
              label: "Losers",
              value: stats.losers,
              color: "text-danger",
            },
          ].map((stat, index) => (
            <FuturisticCard
              key={index}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              isPositive={stat.color.includes('success') || stat.color.includes('primary')}
            />
          ))}
        </div>

        {/* Trades Table */}
        <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">All Trades</h3>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <Icon icon="mdi:loading" className="text-4xl animate-spin mx-auto mb-3 text-primary" />
                <p className="text-default-600">Loading trades...</p>
              </div>
            ) : (
              <TradesTable trades={trades} showActions={true} maxHeight="calc(100vh - 450px)" onTradeUpdate={fetchTrades} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
