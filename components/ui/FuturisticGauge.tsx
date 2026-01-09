"use client";

import { useEffect, useState } from 'react';

interface FuturisticGaugeProps {
  value: number; // 0-100 (win rate percentage)
  winners?: number;
  totalTrades?: number;
  label?: string;
  showStats?: boolean;
}

export function FuturisticGauge({
  value,
  winners = 0,
  totalTrades = 0,
  label = "WIN RATE",
  showStats = true,
}: FuturisticGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setMounted(true);
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const clampedValue = Math.max(0, Math.min(100, value));
  
  const startAngle = -120;
  const endAngle = 120;
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (clampedValue / 100) * angleRange;
  
  // Angle animé basé sur displayValue pour l'arc
  const animatedAngle = startAngle + (displayValue / 100) * angleRange;

  const getColor = (val: number) => {
    if (val >= 60) return { primary: '#00ff88', secondary: '#00cc6a', glow: 'rgba(0, 255, 136, 0.6)' };
    if (val >= 45) return { primary: '#ffd700', secondary: '#ffaa00', glow: 'rgba(255, 215, 0, 0.6)' };
    return { primary: '#ff3366', secondary: '#cc0033', glow: 'rgba(255, 51, 102, 0.6)' };
  };

  const colors = getColor(clampedValue);

  const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  // Utiliser des valeurs en pourcentage du viewBox - PLUS GRAND
  const cx = 50; // 50% de 100
  const cy = 60; // 50% de 100
  const radius = 45; // Augmenté de 35 à 45 pour être plus grand

  return (
    <div className="w-full h-full flex items-center justify-center  overflow-hidden">
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full "
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1e" />
          </radialGradient>
        </defs>

        {/* Cercles de fond concentriques */}
        {[0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius * scale}
            fill="none"
            stroke="rgba(0, 255, 136, 0.1)"
            strokeWidth="0.15"
            opacity={0.3}
            style={{
              animation: `pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}

        {/* Arc de fond (track) */}
        <path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          stroke="rgba(100, 100, 150, 0.2)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arc de progression avec animation */}
        <path
          d={describeArc(cx, cy, radius, startAngle, mounted ? animatedAngle : startAngle)}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#strongGlow)"
        />

        {/* Points de décoration le long de l'arc */}
        {mounted && [0.25, 0.5, 0.75].map((pos) => {
          const angle = startAngle + (displayValue / 100) * angleRange * pos;
          const point = polarToCartesian(cx, cy, radius, angle);
          return (
            <circle
              key={pos}
              cx={point.x}
              cy={point.y}
              r="0.8"
              fill={colors.primary}
              filter="url(#glow)"
              opacity={0.8}
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Indicateur de position (needle) */}
        {mounted && (
          <g>
            <line
              x1={cx}
              y1={cy}
              x2={polarToCartesian(cx, cy, radius - 2, animatedAngle).x}
              y2={polarToCartesian(cx, cy, radius - 2, animatedAngle).y}
              stroke={colors.primary}
              strokeWidth="0.8"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <circle
              cx={polarToCartesian(cx, cy, radius, animatedAngle).x}
              cy={polarToCartesian(cx, cy, radius, animatedAngle).y}
              r="1.5"
              fill={colors.primary}
              filter="url(#strongGlow)"
            >
              <animate
                attributeName="r"
                values="1.5;2;1.5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Centre du gauge */}
        <circle
          cx={cx}
          cy={cy}
          r="22"
          fill="url(#centerGradient)"
          stroke={colors.primary}
          strokeWidth="0.5"
          opacity="0.9"
        />

        {/* Valeur centrale */}
        <text
          x={cx}
          y={cy - 2.5}
          fill={colors.primary}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          filter="url(#glow)"
          style={{ fontFamily: 'monospace' }}
        >
          {mounted ? Math.round(displayValue) : 0}
          <tspan fontSize="6" fill="rgba(255, 255, 255, 0.8)">%</tspan>
        </text>

        {/* Label */}
        <text
          x={cx}
          y={cy + 5}
          fill="rgba(255, 255, 255, 0.6)"
          fontSize="5.5"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.5"
          style={{ fontFamily: 'monospace' }}
        >
          {label}
        </text>

        {/* Stats en bas */}
        {showStats && totalTrades > 0 && (
          <g>
            <text
              x={cx}
              y={cy + 10}
              fill="rgba(255, 255, 255, 0.5)"
              fontSize="2.5"
              textAnchor="middle"
              style={{ fontFamily: 'monospace' }}
            >
              {winners}/{totalTrades} TRADES
            </text>
          </g>
        )}
      </svg>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}