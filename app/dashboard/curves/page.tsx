"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getTrades } from "@/app/actions/trades";
import type { Trade } from "@/types/trades";
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
import { FuturisticGlowingEffect } from "@/components/ui/FuturisticGlowingEffect";
import { FuturCard } from "@/components/ui/FuturCard";

export default function CurvesPage() {
  const [timeRange, setTimeRange] = useState("day");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      const result = await getTrades();
      if (result.data) {
        setTrades(result.data);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  // Filter trades based on timerange
  const filteredTrades = useMemo(() => {
    if (trades.length === 0) return [];

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "day":
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setHours(0, 0, 0, 0);
    }

    return trades.filter(
      (trade) => new Date(trade.trade_date) >= cutoffDate
    );
  }, [trades, timeRange]);

  // Calculate equity curve from filtered trades
  const equityData = useMemo(() => {
    if (filteredTrades.length === 0) {
      return [{ date: "Start", equity: 0, balance: 0 }];
    }

    const STARTING_BALANCE = 0;
    const sortedTrades = [...filteredTrades].sort(
      (a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
    );

    // Get date format based on timerange
    const getDateFormat = (date: Date) => {
      if (timeRange === "day") {
        // Hourly format for day
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (timeRange === "week" || timeRange === "month") {
        // Daily format for week and month
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        // Monthly format for year
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }
    };

    let runningEquity = STARTING_BALANCE;
    const data = sortedTrades.map((trade) => {
      runningEquity += trade.profit_loss;
      return {
        date: getDateFormat(new Date(trade.trade_date)),
        equity: runningEquity,
        balance: runningEquity,
        fullDate: trade.trade_date,
      };
    });

    // Aggregate data for monthly view if timeRange is year
    if (timeRange === "year") {
      const monthlyData = data.reduce((acc, point) => {
        const monthKey = new Date(point.fullDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: monthKey,
            equity: point.equity,
            balance: point.balance,
            count: 1,
          };
        } else {
          acc[monthKey].equity = point.equity; // Take last value of the month
          acc[monthKey].balance = point.balance;
          acc[monthKey].count++;
        }
        
        return acc;
      }, {} as Record<string, any>);

      return [
        { date: "Start", equity: STARTING_BALANCE, balance: STARTING_BALANCE },
        ...Object.values(monthlyData),
      ];
    }

    return [
      { date: "Start", equity: STARTING_BALANCE, balance: STARTING_BALANCE },
      ...data,
    ];
  }, [filteredTrades, timeRange]);

  // Calculate PnL based on timerange
  const pnlData = useMemo(() => {
    if (filteredTrades.length === 0) {
      return [{ date: "No data", pnl: 0 }];
    }

    const getDateKey = (date: Date) => {
      if (timeRange === "day") {
        // Hourly
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (timeRange === "week" || timeRange === "month") {
        // Daily
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        // Monthly for year
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }
    };

    const pnlByPeriod = filteredTrades.reduce((acc, trade) => {
      const dateKey = getDateKey(new Date(trade.trade_date));
      acc[dateKey] = (acc[dateKey] || 0) + trade.profit_loss;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pnlByPeriod)
      .map(([date, pnl]) => ({ date, pnl }))
      .slice(-20); // Last 20 periods
  }, [filteredTrades, timeRange]);

  // Calculate drawdown
  const drawdownData = useMemo(() => {
    if (equityData.length === 0) {
      return [{ date: "No data", drawdown: 0 }];
    }

    let peak = equityData[0].equity;
    return equityData.map((point) => {
      if (point.equity > peak) peak = point.equity;
      // Avoid division by zero
      const drawdown = peak !== 0 ? ((point.equity - peak) / peak) * 100 : 0;
      return { date: point.date, drawdown: drawdown };
    });
  }, [equityData]);

  // Calculate win/loss by period
  const winLossData = useMemo(() => {
    if (filteredTrades.length === 0) {
      return [{ date: "No data", wins: 0, losses: 0 }];
    }

    const getDateKey = (date: Date) => {
      if (timeRange === "day") {
        // Hourly
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (timeRange === "week" || timeRange === "month") {
        // Daily
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        // Monthly for year
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
      }
    };

    const periods = filteredTrades.reduce((acc, trade) => {
      const periodKey = getDateKey(new Date(trade.trade_date));
      if (!acc[periodKey]) acc[periodKey] = { wins: 0, losses: 0 };
      if (trade.profit_loss > 0) acc[periodKey].wins++;
      else if (trade.profit_loss < 0) acc[periodKey].losses++;
      return acc;
    }, {} as Record<string, { wins: number; losses: number }>);

    return Object.entries(periods)
      .map(([date, data]) => ({ date, ...data }))
      .slice(-15); // Last 15 periods
  }, [filteredTrades, timeRange]);

  const timeRanges = [
    { value: "day", label: "Jour" },
    { value: "week", label: "Semaine" },
    { value: "month", label: "Mois" },
    { value: "year", label: "Année" },
  ];

  {/* Effet vert néon par défaut */}
// {/* <FuturisticGlowingEffect
//   spread={40}
//   glow={true}
//   disabled={false}
//   proximity={64}
//   inactiveZone={0.01}
// />

// {/* Effet cyan pour cards informatives */}
// <FuturisticGlowingEffect
//   variant="cyan"
//   spread={40}
//   glow={true}
//   disabled={false}
//   proximity={64}
// />

// {/* Effet rouge pour drawdown cards */}
// <FuturisticGlowingEffect
//   variant="red"
//   spread={40}
//   glow={true}
//   disabled={false}
//   proximity={64}
// /> */}
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Performance Curves</h1>
          <p className="text-default-600">
            {loading
              ? "Loading performance data..."
              : `Showing ${filteredTrades.length} of ${trades.length} trades`}
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-lg border border-gray-800/50 bg-white dark:bg-black">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              size="sm"
              variant={timeRange === range.value ? "solid" : "light"}
              color={timeRange === range.value ? "primary" : "default"}
              onPress={() => setTimeRange(range.value)}
              className="min-w-16"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Icon
            icon="mdi:loading"
            className="text-5xl animate-spin mx-auto mb-3 text-primary"
          />
          <p className="text-default-600">Loading charts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && trades.length === 0 && (
        <div className="text-center py-12">
          <Icon
            icon="mdi:chart-line-variant"
            className="text-5xl mx-auto mb-3 text-default-400"
          />
          <p className="text-default-600 mb-4">No trades found to display charts</p>
          <Button color="primary" href="/dashboard/upload">
            Import Trades
          </Button>
        </div>
      )}

      {/* Charts */}
      {!loading && trades.length > 0 && (
        <>

      {/* Equity Curve */}
      <div className="min-h-[400px]">
        <FuturCard className="relative h-full rounded-2xl p-2 md:rounded-3xl md:p-3">
          <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
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
        </FuturCard>
      </div>

      {/* PnL & Drawdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily PnL */}
        <div className="min-h-[400px]">
          <FuturCard className="relative h-full rounded-2xl  p-2 md:rounded-3xl md:p-3">
          
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
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
          </FuturCard>
        </div>

        {/* Drawdown */}
        <div className="min-h-[400px]">
          <FuturCard className="relative h-full rounded-2xl  p-2 md:rounded-3xl md:p-3">
     
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
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
          </FuturCard>
        </div>
      </div>

      {/* Win/Loss Ratio */}
      <div className="min-h-[400px]">
        <FuturCard className="relative h-full rounded-2xl  p-2 md:rounded-3xl md:p-3">

          <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
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
        </FuturCard>
      </div>
      </>
      )}
    </div>
  );
}
