"use client"
import { Icon } from "@iconify/react";
import { FuturisticGauge } from "./ui/FuturisticGauge";
import { FuturisticPnLCard } from "./ui/FuturisticPnlCard";
import { FuturisticGlowingEffect } from "./ui/FuturisticGlowingEffect";
import { FuturisticRadarChart } from "./ui/FuturisticRadarChart";

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
  allTrades?: any[]; // Pour calculer les métriques de discipline/consistance
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
  allTrades = [],
}: PerformanceStatsProps) {
  
  // Calculer les métriques de discipline
  const calculateDisciplineMetrics = () => {
    if (allTrades.length === 0) {
      return [
        { label: "Setup", value: 85, description: "Trades matching defined setups" },
        { label: "Risk", value: 78, description: "Proper position sizing adherence" },
        { label: "Stop Loss", value: 92, description: "Stop loss placement discipline" },
        { label: "Session", value: 88, description: "Trading during planned sessions" },
        { label: "Rules", value: 80, description: "Overall rule adherence" },
      ];
    }

    // TODO: Calculer depuis les vraies données
    // Pour l'instant, valeurs de démonstration
    const setupScore = 85; // % de trades avec un setup assigné
    const riskScore = 78; // % de trades avec position sizing correcte
    const stopLossScore = 92; // % de trades avec stop loss respecté
    const sessionScore = 88; // % de trades pendant les sessions US/EU
    const rulesScore = 80; // Score global de respect des règles

    return [
      { label: "Setup", value: setupScore, description: "Trades matching defined setups" },
      { label: "Risk", value: riskScore, description: "Proper position sizing adherence" },
      { label: "Stop Loss", value: stopLossScore, description: "Stop loss placement discipline" },
      { label: "Session", value: sessionScore, description: "Trading during planned sessions" },
      { label: "Rules", value: rulesScore, description: "Overall rule adherence" },
    ];
  };

  // Calculer les métriques de consistance
  const calculateConsistencyMetrics = () => {
    if (allTrades.length === 0) {
      return [
        { label: "PnL Variance", value: 75, description: "Consistency of profit/loss" },
        { label: "Win Streak", value: 82, description: "Win streak stability" },
        { label: "Hold Time", value: 70, description: "Consistency in trade duration" },
        { label: "R:R Ratio", value: 88, description: "Risk-reward ratio consistency" },
        { label: "Emotional", value: 79, description: "Emotional control score" },
      ];
    }

    // TODO: Calculer depuis les vraies données
    // Calculer l'écart-type des résultats pour la variance
    const pnls = allTrades.map(t => t.profit_loss);
    const mean = pnls.reduce((a, b) => a + b, 0) / pnls.length;
    const variance = pnls.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / pnls.length;
    const stdDev = Math.sqrt(variance);
    const pnlVarianceScore = Math.max(0, 100 - (stdDev / mean * 100)); // Plus l'écart-type est faible, meilleur c'est

    return [
      { label: "PnL Variance", value: Math.round(pnlVarianceScore), description: "Consistency of profit/loss" },
      { label: "Win Streak", value: 82, description: "Win streak stability" },
      { label: "Hold Time", value: 70, description: "Consistency in trade duration" },
      { label: "R:R Ratio", value: 88, description: "Risk-reward ratio consistency" },
      { label: "Emotional", value: 79, description: "Emotional control score" },
    ];
  };

  const disciplineMetrics = calculateDisciplineMetrics();
  const consistencyMetrics = calculateConsistencyMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-[200px]">
      {/* PnL Réalisé */}
      <FuturisticPnLCard
        title="PnL RÉALISÉ"
        value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}€`}
        change={balanceChange}
        isPositive={totalPnL >= 0}
        icon="mdi:wallet"
      />

      {/* Win Rate avec Gauge */}
      <div className="h-[200px]">
        <div className="relative h-full rounded-2xl p-2 md:rounded-3xl md:p-3">
          <FuturisticGlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          
          <div className="h-[190px] flex flex-col justify-center items-center overflow-hidden">
            <FuturisticGauge
              value={parseFloat(winRate)}
              winners={winners}
              totalTrades={totalTrades}
              label="WIN RATE"
              showStats={true}
            />
            <p className="absolute bottom-5 text-xs font-semibold text-center text-default-600">
              Percentage of winning trades
            </p>
          </div>
        </div>
      </div>

      {/* Profit Factor avec Gauge */}
      <div className="h-[200px]">
        <div className="relative h-full rounded-2xl p-2 md:rounded-3xl md:p-3">
          <FuturisticGlowingEffect
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
            <p className="absolute bottom-5 text-xs font-semibold text-center text-default-600">
              Ratio of total profits to total losses
            </p>
          </div>
        </div>
      </div>

      {/* Discipline Radar Chart */}
      <div className="h-[200px]">
        <FuturisticRadarChart
          title="DISCIPLINE"
          metrics={disciplineMetrics}
          color="#00ff88"
        />
      </div>

      {/* Consistency Radar Chart */}
      <div className="h-[200px]">
        <FuturisticRadarChart
          title="CONSISTENCY"
          metrics={consistencyMetrics}
          color="#00ff88"
        />
      </div>
    </div>
  );
}