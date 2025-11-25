"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button } from "@heroui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CurvesPage() {
  const [timeRange, setTimeRange] = useState("1M");

  // Données simulées pour l'equity curve
  const equityData = [
    { date: "Jan 1", equity: 10000, balance: 10000 },
    { date: "Jan 8", equity: 10350, balance: 10200 },
    { date: "Jan 15", equity: 10800, balance: 10500 },
    { date: "Jan 22", equity: 10650, balance: 10400 },
    { date: "Jan 29", equity: 11200, balance: 10900 },
    { date: "Feb 5", equity: 11500, balance: 11100 },
    { date: "Feb 12", equity: 11350, balance: 11000 },
    { date: "Feb 19", equity: 11800, balance: 11400 },
    { date: "Feb 26", equity: 12200, balance: 11800 },
    { date: "Mar 5", equity: 12450, balance: 12000 },
  ];

  // Données pour le PnL journalier
  const pnlData = [
    { date: "Jan 1", pnl: 120 },
    { date: "Jan 8", pnl: -80 },
    { date: "Jan 15", pnl: 250 },
    { date: "Jan 22", pnl: -120 },
    { date: "Jan 29", pnl: 380 },
    { date: "Feb 5", pnl: 150 },
    { date: "Feb 12", pnl: -90 },
    { date: "Feb 19", pnl: 420 },
    { date: "Feb 26", pnl: 200 },
    { date: "Mar 5", pnl: 180 },
  ];

  // Données pour le drawdown
  const drawdownData = [
    { date: "Jan 1", drawdown: 0 },
    { date: "Jan 8", drawdown: -2.5 },
    { date: "Jan 15", drawdown: -1.8 },
    { date: "Jan 22", drawdown: -3.2 },
    { date: "Jan 29", drawdown: -1.2 },
    { date: "Feb 5", drawdown: -0.8 },
    { date: "Feb 12", drawdown: -2.1 },
    { date: "Feb 19", drawdown: -0.5 },
    { date: "Feb 26", drawdown: -1.5 },
    { date: "Mar 5", drawdown: -0.3 },
  ];

  // Données pour le win/loss ratio
  const winLossData = [
    { date: "Week 1", wins: 12, losses: 5 },
    { date: "Week 2", wins: 15, losses: 8 },
    { date: "Week 3", wins: 18, losses: 6 },
    { date: "Week 4", wins: 14, losses: 7 },
    { date: "Week 5", wins: 20, losses: 9 },
    { date: "Week 6", wins: 16, losses: 5 },
    { date: "Week 7", wins: 19, losses: 8 },
    { date: "Week 8", wins: 22, losses: 7 },
  ];

  const timeRanges = ["1W", "1M", "3M", "6M", "1Y", "ALL"];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Performance Curves</h1>
          <p className="text-default-600">
            Visualize your trading performance over time
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-lg border border-divider bg-white dark:bg-black">
          {timeRanges.map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? "solid" : "light"}
              color={timeRange === range ? "primary" : "default"}
              onPress={() => setTimeRange(range)}
              className="min-w-12"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Equity Curve */}
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-fit rounded-lg border border-gray-600 p-2">
                  <Icon
                    icon="mdi:chart-line"
                    className="text-xl text-black dark:text-neutral-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Equity Curve</h3>
                  <p className="text-sm text-default-600">
                    Track your account growth over time
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-default-600">Equity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-default-600">Balance</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070f3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0070f3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17c964" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#17c964" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#0070f3"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEquity)"
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#17c964"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PnL & Drawdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily PnL */}
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
              <div className="flex items-center gap-3 mb-2">
                <div className="w-fit rounded-lg border border-gray-600 p-2">
                  <Icon
                    icon="mdi:currency-usd"
                    className="text-xl text-black dark:text-neutral-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Daily PnL</h3>
                  <p className="text-sm text-default-600">
                    Profit and loss by day
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="pnl"
                    fill="#0070f3"
                    radius={[4, 4, 0, 0]}
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Drawdown */}
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
              <div className="flex items-center gap-3 mb-2">
                <div className="w-fit rounded-lg border border-gray-600 p-2">
                  <Icon
                    icon="mdi:trending-down"
                    className="text-xl text-black dark:text-neutral-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Drawdown</h3>
                  <p className="text-sm text-default-600">
                    Maximum drawdown percentage
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient
                      id="colorDrawdown"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f31260" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f31260" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#f31260"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDrawdown)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Win/Loss Ratio */}
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-fit rounded-lg border border-gray-600 p-2">
                  <Icon
                    icon="mdi:chart-bar"
                    className="text-xl text-black dark:text-neutral-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Win/Loss Ratio</h3>
                  <p className="text-sm text-default-600">
                    Weekly winning vs losing trades
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-default-600">Wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <span className="text-default-600">Losses</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="wins"
                  fill="#17c964"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                />
                <Bar
                  dataKey="losses"
                  fill="#f31260"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
