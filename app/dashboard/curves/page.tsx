"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { getTrades } from "@/app/actions/trades";
import type { Trade } from "@/types/trades";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function FuturisticCurvesPage() {
  const [timeRange, setTimeRange] = useState("week");
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
        cutoffDate.setDate(now.getDate() - 7);
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

    const getDateFormat = (date: Date) => {
      if (timeRange === "week") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (timeRange === "month") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
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

    if (timeRange === "year") {
      const monthlyData = data.reduce((acc, point) => {
        const monthKey = new Date(point.fullDate).toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: monthKey,
            equity: point.equity,
            balance: point.balance,
          };
        } else {
          acc[monthKey].equity = point.equity;
          acc[monthKey].balance = point.balance;
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

  // Calculate PnL
  const pnlData = useMemo(() => {
    if (filteredTrades.length === 0) {
      return [{ date: "No data", pnl: 0 }];
    }

    const getDateKey = (date: Date) => {
      if (timeRange === "week") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (timeRange === "month") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
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
      .slice(-20);
  }, [filteredTrades, timeRange]);

  // Calculate drawdown
  const drawdownData = useMemo(() => {
    if (equityData.length === 0) {
      return [{ date: "No data", drawdown: 0 }];
    }

    let peak = equityData[0].equity;
    return equityData.map((point) => {
      if (point.equity > peak) peak = point.equity;
      const drawdown = peak !== 0 ? ((point.equity - peak) / peak) * 100 : 0;
      return { date: point.date, drawdown: drawdown };
    });
  }, [equityData]);

  // Calculate win/loss
  const winLossData = useMemo(() => {
    if (filteredTrades.length === 0) {
      return [{ date: "No data", wins: 0, losses: 0 }];
    }

    const getDateKey = (date: Date) => {
      if (timeRange === "week") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (timeRange === "month") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
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
      .slice(-15);
  }, [filteredTrades, timeRange]);

  const timeRanges = [
    { value: "week", label: "Week", icon: "mdi:calendar-week" },
    { value: "month", label: "Month", icon: "mdi:calendar-month" },
    { value: "year", label: "Year", icon: "mdi:calendar" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-[#00ff88]/30 rounded-lg p-3 font-mono">
          <p className="text-[#00ff88] font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-950 via-black to-gray-900 min-h-screen">
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold font-mono mb-2">
            <span className="text-[#00ff88]">PERFORMANCE</span>{" "}
            <span className="text-white">ANALYTICS</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            {loading
              ? "◆ Loading performance data..."
              : `◆ ${filteredTrades.length} of ${trades.length} trades • ${timeRange.toUpperCase()}`}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-800/50 bg-black/40 backdrop-blur-sm">
          {timeRanges.map((range, index) => (
            <motion.button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`relative px-6 py-2.5 rounded-lg font-mono text-sm font-bold transition-all duration-300 ${
                timeRange === range.value
                  ? "text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {timeRange === range.value && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #00ff88, #00cc6a)",
                    boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
                  }}
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon icon={range.icon} className="text-lg" />
                {range.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Icon
            icon="mdi:loading"
            className="text-6xl animate-spin mx-auto mb-4 text-[#00ff88]"
          />
          <p className="text-gray-400 font-mono">LOADING CHARTS...</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && trades.length === 0 && (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Icon
            icon="mdi:chart-line-variant"
            className="text-6xl mx-auto mb-4 text-gray-600"
          />
          <p className="text-gray-400 font-mono mb-6">NO TRADES FOUND</p>
          <Button 
            className="bg-[#00ff88] text-black font-mono font-bold hover:bg-[#00cc6a]"
            href="/dashboard/upload"
          >
            <Icon icon="mdi:upload" className="text-lg" />
            IMPORT TRADES
          </Button>
        </motion.div>
      )}

      {/* Charts Grid */}
      {!loading && trades.length > 0 && (
        <div className="space-y-6">
          {/* Equity Curve - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl border border-gray-800/50 p-4 bg-black/40 backdrop-blur-xl overflow-hidden group hover:border-gray-700/70 transition-all"
          >
            {/* Grille de fond */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #00ff88, #00cc6a)",
                      boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
                    }}
                  >
                    <Icon icon="mdi:chart-line" className="text-2xl text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono text-white">EQUITY CURVE</h3>
                    <p className="text-sm text-gray-400 font-mono">Track your account growth</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
                    <span className="text-gray-400">EQUITY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00d4ff]"></div>
                    <span className="text-gray-400">BALANCE</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#00ff88"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEquity)"
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </motion.div>

          {/* PnL & Drawdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily PnL */}
            <ChartCard
              title="PROFIT & LOSS"
              subtitle="Daily performance breakdown"
              icon="mdi:currency-usd"
              color="#00d4ff"
              delay={0.3}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pnl"
                    fill="#00d4ff"
                    radius={[6, 6, 0, 0]}
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Drawdown */}
            <ChartCard
              title="DRAWDOWN"
              subtitle="Maximum drawdown tracking"
              icon="mdi:trending-down"
              color="#ff3366"
              delay={0.4}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3366" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#ff3366"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDrawdown)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Win/Loss Ratio - Full Width */}
          <ChartCard
            title="WIN / LOSS RATIO"
            subtitle="Winning vs losing trades distribution"
            icon="mdi:chart-bar"
            color="#b366ff"
            delay={0.5}
            legend={
              <div className="flex items-center gap-4 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
                  <span className="text-gray-400">WINS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff3366]"></div>
                  <span className="text-gray-400">LOSSES</span>
                </div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={11} 
                  fontFamily="monospace"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={11} 
                  fontFamily="monospace"
                  tick={{ fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="wins"
                  fill="#00ff88"
                  radius={[6, 6, 0, 0]}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(0, 255, 136, 0.5))",
                  }}
                />
                <Bar
                  dataKey="losses"
                  fill="#ff3366"
                  radius={[6, 6, 0, 0]}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255, 51, 102, 0.5))",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

// Composant réutilisable pour les cards de charts
function ChartCard({ 
  title, 
  subtitle, 
  icon, 
  color, 
  delay, 
  legend,
  children 
}: { 
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  delay: number;
  legend?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative rounded-2xl border border-gray-800/50 p-4 bg-black/40 backdrop-blur-xl overflow-hidden group hover:border-gray-700/70 transition-all"
    >
      {/* Grille de fond */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                boxShadow: `0 0 20px ${color}40`,
              }}
            >
              <Icon icon={icon} className="text-2xl text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono text-white">{title}</h3>
              <p className="text-sm text-gray-400 font-mono">{subtitle}</p>
            </div>
          </div>
          {legend}
        </div>

        {children}
      </div>

      {/* Coins décoratifs */}

    </motion.div>
  );
}