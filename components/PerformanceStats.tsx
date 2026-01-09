"use client"
import { Icon } from "@iconify/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Gauge } from "@/components/ui/gauge";
import { FuturisticGauge } from "./ui/FuturisticGauge";
import { FuturisticPnLCard } from "./ui/FuturisticPnlCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-[200px]">
          <FuturisticPnLCard
            title="PnL RÉALISÉ"
            value="$1,234.56"
            change="+12.5%"
            isPositive={true}
            icon="mdi:wallet"
          />


      {/* Win Rate avec Gauge */}
     <div className="h-[200px]">
    <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      
      <div className=" h-[190px] flex justify-center items-center overflow-hidden pb-2">
            <FuturisticGauge
            
            value={65.5}
            winners={131}
            totalTrades={200}
            label="WIN RATE"
            showStats={true}
          />
      </div>
    </div>
  </div>

      {/* Profit Factor avec Gauge */}
      <div className="h-[200px]">
        <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />

          <div className="h-[190px] flex justify-center items-center overflow-hidden pb-2">
            <FuturisticGauge
              value={Math.min(100, parseFloat(profitFactor) * 33.33)}
              label="PROFIT FACTOR"
              showStats={false}
            />
          </div>
        </div>
      </div>

      {/* Discipline Score */}
      <div className="h-[200px]">
        <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />

          <div className="h-[190px] flex justify-center items-center overflow-hidden pb-2">
            <FuturisticGauge
              value={85} // TODO: Calculate based on trading discipline metrics
              label="DISCIPLINE SCORE"
              showStats={false}
            />
          </div>
        </div>
      </div>

      {/* Consistency Score */}
      <div className="h-[200px]">
        <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />

          <div className="h-[190px] flex justify-center items-center overflow-hidden pb-2">
            <FuturisticGauge
              value={78} // TODO: Calculate based on standard deviation of results
              label="CONSISTENCY SCORE"
              showStats={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}