"use client";

import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

interface StrategyData {
  name: string;
  count: number;
  color: string;
  icon?: string;
}

interface FuturisticStrategyPieChartProps {
  strategies: StrategyData[];
}

export function FuturisticStrategyPieChart({ strategies }: FuturisticStrategyPieChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Couleurs par défaut si non spécifiées
  const defaultColors = ['#00ff88', '#ffd700', '#ff3366', '#00d4ff', '#b366ff', '#ff6b35'];
  
  const strategiesWithColors = strategies.map((strat, i) => ({
    ...strat,
    color: strat.color || defaultColors[i % defaultColors.length]
  }));

  const total = strategiesWithColors.reduce((sum, s) => sum + s.count, 0);

  // Calculer les segments
  let currentAngle = -90;
  const segments = strategiesWithColors.map((strategy, index) => {
    const percentage = (strategy.count / total) * 100;
    const angle = (percentage / 100) * 360;
    
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;
    
    return {
      ...strategy,
      percentage,
      startAngle,
      endAngle,
      index
    };
  });

  const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const createPieSlice = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  };

  const cx = 50;
  const cy = 50;
  const radius = 35;
  const holeRadius = 20;

  return (
    <div className="min-h-[200px]">
      <div className="relative h-full rounded-2xl border border-gray-800/50 p-2 md:rounded-3xl md:p-3 overflow-hidden">
        {/* Grille de fond */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative flex h-full flex-col gap-4 rounded-xl p-6 bg-black/40 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold font-mono text-white">
                <span className="text-[#00ff88]">STRATEGY</span> DISTRIBUTION
              </h3>
              <p className="text-sm text-gray-400 font-mono mt-1">
                Total: {total} trades
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/10 flex items-center justify-center">
              <Icon icon="mdi:chart-pie" className="text-xl text-[#00ff88]" />
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="relative h-px mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff88]/40 to-transparent" />
          </div>

          {total === 0 ? (
            <div className="flex-1 flex items-center justify-center min-h-[250px]">
              <div className="text-center text-gray-500">
                <Icon icon="mdi:chart-pie" className="text-5xl mx-auto mb-3 opacity-30" />
                <p className="text-sm font-mono">NO DATA TO DISPLAY</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[250px] gap-8">
              {/* Pie Chart SVG */}
              <div className="relative w-[200px] h-[200px]">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-full h-full"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  <defs>
                    {segments.map((segment, i) => (
                      <filter key={`glow-${i}`} id={`segment-glow-${i}`}>
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    ))}

                    {segments.map((segment, i) => (
                      <linearGradient key={`grad-${i}`} id={`segment-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={segment.color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={segment.color} stopOpacity="1" />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Cercles de fond concentriques */}
                  {[0.5, 0.7, 0.9].map((scale, i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={radius * scale}
                      fill="none"
                      stroke="rgba(0, 255, 136, 0.1)"
                      strokeWidth="0.3"
                      opacity={0.3}
                    />
                  ))}

                  {/* Segments du pie */}
                  {mounted && segments.map((segment, i) => {
                    const isHovered = hoveredSegment === i;
                    const midAngle = (segment.startAngle + segment.endAngle) / 2;
                    const midRad = ((midAngle - 90) * Math.PI) / 180.0;
                    const offset = isHovered ? 3 : 0;
                    const offsetX = offset * Math.cos(midRad);
                    const offsetY = offset * Math.sin(midRad);

                    return (
                      <g 
                        key={i}
                        onMouseEnter={() => setHoveredSegment(i)}
                        onMouseLeave={() => setHoveredSegment(null)}
                        style={{
                          cursor: 'pointer',
                          transform: `translate(${offsetX}px, ${offsetY}px)`,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {/* Segment principal */}
                        <path
                          d={createPieSlice(cx, cy, radius, segment.startAngle, segment.endAngle)}
                          fill={`url(#segment-gradient-${i})`}
                          stroke="rgba(0, 0, 0, 0.5)"
                          strokeWidth="0.5"
                          filter={isHovered ? `url(#segment-glow-${i})` : 'none'}
                          opacity={mounted ? 1 : 0}
                          style={{
                            transition: 'all 0.3s ease',
                            transitionDelay: `${i * 0.1}s`
                          }}
                        />

                        {/* Trou central pour effet donut */}
                        <path
                          d={createPieSlice(cx, cy, holeRadius, segment.startAngle, segment.endAngle)}
                          fill="#000000"
                        />

                        {/* Pourcentage au centre du segment (si assez grand) */}
                        {segment.percentage > 10 && (
                          <text
                            x={cx + (radius - (radius - holeRadius) / 2) * Math.cos(midRad)}
                            y={cy + (radius - (radius - holeRadius) / 2) * Math.sin(midRad)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="4"
                            fontWeight="bold"
                            style={{ fontFamily: 'monospace' }}
                          >
                            {segment.percentage.toFixed(1)}%
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Centre avec total */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={holeRadius}
                    fill="#0a0a0a"
                    stroke="#00ff88"
                    strokeWidth="0.5"
                  />
                  <text
                    x={cx}
                    y={cy - 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#00ff88"
                    fontSize="8"
                    fontWeight="bold"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {total}
                  </text>
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255, 255, 255, 0.5)"
                    fontSize="3"
                    style={{ fontFamily: 'monospace' }}
                  >
                    TRADES
                  </text>
                </svg>
              </div>

              {/* Légende interactive */}
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {segments.map((segment, i) => {
                  const isHovered = hoveredSegment === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredSegment(i)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className="flex items-center gap-3 cursor-pointer transition-all duration-300 group"
                      style={{
                        opacity: hoveredSegment === null || isHovered ? 1 : 0.4,
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                        transitionDelay: `${i * 0.05}s`
                      }}
                    >
                      {/* Indicateur de couleur avec effet pulsant */}
                      <div 
                        className="relative w-4 h-4 rounded-sm flex-shrink-0"
                        style={{ 
                          backgroundColor: segment.color,
                          boxShadow: isHovered ? `0 0 15px ${segment.color}` : 'none',
                          transition: 'box-shadow 0.3s ease'
                        }}
                      >
                        {isHovered && (
                          <div 
                            className="absolute inset-0 rounded-sm animate-ping"
                            style={{ backgroundColor: segment.color, opacity: 0.4 }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span 
                            className="text-sm font-mono font-bold truncate"
                            style={{ color: segment.color }}
                          >
                            {segment.name}
                          </span>
                          <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                            {segment.count}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: mounted ? `${segment.percentage}%` : '0%',
                                backgroundColor: segment.color,
                                boxShadow: `0 0 8px ${segment.color}`,
                                transitionDelay: `${i * 0.1}s`
                              }}
                            />
                          </div>
                          <span 
                            className="text-xs font-mono font-bold flex-shrink-0"
                            style={{ color: segment.color }}
                          >
                            {segment.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coins décoratifs */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#00ff88]/30" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#00ff88]/30" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#00ff88]/30" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#00ff88]/30" />
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00ff88;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00cc6a;
        }
      `}</style>
    </div>
  );
}