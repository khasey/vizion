"use client"
import { Icon } from "@iconify/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Gauge } from "@/components/ui/gauge";

interface PerformanceStatsProps {
  totalPnL: number;
  balanceChange: string;
  totalTrades: number;
  winRate: string;
  winners: number;
  profitFactor: string;
  maxDrawdown: number;
  maxDrawdownValue: string;
  avgRMultiple: string;
  losers: number;
}

export default function PerformanceStats({
  totalPnL,
  balanceChange,
  totalTrades,
  winRate,
  winners,
  profitFactor,
  maxDrawdown,
  maxDrawdownValue,
  avgRMultiple,
  losers,
}: PerformanceStatsProps) {
  return (
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
  );
}