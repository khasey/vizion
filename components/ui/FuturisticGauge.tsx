"use client";

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

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

  // Animation fluide avec Framer Motion
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });

  useEffect(() => {
    setMounted(true);
    // Démarrer l'animation après un petit délai
    const timer = setTimeout(() => {
      springValue.set(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, springValue]);

  const clampedValue = Math.max(0, Math.min(100, value));
  
  const startAngle = -120;
  const endAngle = 120;
  const angleRange = endAngle - startAngle;

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

  // ViewBox agrandi pour contenir le stroke et les filtres
  const cx = 60;
  const cy = 60;
  const radius = 45;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.svg 
        viewBox="0 0 120 120" 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
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
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius * scale}
            fill="none"
            stroke="rgba(0, 255, 136, 0.1)"
            strokeWidth="0.15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{
              duration: 1,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0
            }}
          />
        ))}

        {/* Arc de fond (track) */}
        <motion.path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          stroke="rgba(100, 100, 150, 0.2)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Arc de progression avec animation */}
        <motion.path
          d={describeArc(cx, cy, radius, startAngle, startAngle + angleRange * (clampedValue / 100))}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#strongGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.3
          }}
        />

        {/* Points de décoration le long de l'arc */}
        <AnimatedDots 
          springValue={springValue}
          cx={cx}
          cy={cy}
          radius={radius}
          startAngle={startAngle}
          angleRange={angleRange}
          color={colors.primary}
          polarToCartesian={polarToCartesian}
        />

        {/* Indicateur de position (needle) */}
        <AnimatedNeedle
          springValue={springValue}
          cx={cx}
          cy={cy}
          radius={radius}
          startAngle={startAngle}
          angleRange={angleRange}
          color={colors.primary}
          polarToCartesian={polarToCartesian}
        />

        {/* Centre du gauge */}
        <motion.circle
          cx={cx}
          cy={cy}
          r="22"
          fill="url(#centerGradient)"
          stroke={colors.primary}
          strokeWidth="0.5"
          opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        />

        {/* Valeur centrale animée */}
        <AnimatedText
          springValue={springValue}
          cx={cx}
          cy={cy}
          color={colors.primary}
          label={label}
          winners={winners}
          totalTrades={totalTrades}
          showStats={showStats}
        />
      </motion.svg>

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

// Composant pour les points décoratifs animés
function AnimatedDots({ 
  springValue, 
  cx, 
  cy, 
  radius, 
  startAngle, 
  angleRange, 
  color,
  polarToCartesian 
}: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && [0.25, 0.5, 0.75].map((pos, i) => (
        <AnimatedDot
          key={pos}
          springValue={springValue}
          pos={pos}
          cx={cx}
          cy={cy}
          radius={radius}
          startAngle={startAngle}
          angleRange={angleRange}
          color={color}
          polarToCartesian={polarToCartesian}
          delay={i * 0.1}
        />
      ))}
    </>
  );
}

function AnimatedDot({ springValue, pos, cx, cy, radius, startAngle, angleRange, color, polarToCartesian, delay }: any) {
  const angle = useTransform(
    springValue,
    [0, 100],
    [startAngle, startAngle + angleRange]
  );

  const pointX = useTransform(angle, (a) => {
    const pt = polarToCartesian(cx, cy, radius, startAngle + (a - startAngle) * pos);
    return pt.x;
  });

  const pointY = useTransform(angle, (a) => {
    const pt = polarToCartesian(cx, cy, radius, startAngle + (a - startAngle) * pos);
    return pt.y;
  });

  return (
    <motion.circle
      cx={pointX}
      cy={pointY}
      r="0.8"
      fill={color}
      filter="url(#glow)"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: delay + 0.5
      }}
    />
  );
}

// Composant pour l'aiguille animée
function AnimatedNeedle({ springValue, cx, cy, radius, startAngle, angleRange, color, polarToCartesian }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const angle = useTransform(
    springValue,
    [0, 100],
    [startAngle, startAngle + angleRange]
  );

  const needleEndX = useTransform(angle, (a) => polarToCartesian(cx, cy, radius - 2, a).x);
  const needleEndY = useTransform(angle, (a) => polarToCartesian(cx, cy, radius - 2, a).y);
  
  const tipX = useTransform(angle, (a) => polarToCartesian(cx, cy, radius, a).x);
  const tipY = useTransform(angle, (a) => polarToCartesian(cx, cy, radius, a).y);

  if (!mounted) return null;

  return (
    <g>
      <motion.line
        x1={cx}
        y1={cy}
        x2={needleEndX}
        y2={needleEndY}
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <motion.circle
        cx={tipX}
        cy={tipY}
        r="1.5"
        fill={color}
        filter="url(#strongGlow)"
        animate={{ r: [1.5, 2, 1.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.8
        }}
      />
    </g>
  );
}

// Composant pour le texte animé
function AnimatedText({ springValue, cx, cy, color, label, winners, totalTrades, showStats }: any) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <g>
      <motion.text
        x={cx}
        y={cy - 2.5}
        fill={color}
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        filter="url(#glow)"
        style={{ fontFamily: 'monospace' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {displayValue}
        <tspan fontSize="6" fill="rgba(255, 255, 255, 0.8)">%</tspan>
      </motion.text>

      <motion.text
        x={cx}
        y={cy + 5}
        fill="rgba(255, 255, 255, 0.6)"
        fontSize="5.5"
        fontWeight="600"
        textAnchor="middle"
        letterSpacing="0.5"
        style={{ fontFamily: 'monospace' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {label}
      </motion.text>

      {showStats && totalTrades > 0 && (
        <motion.text
          x={cx}
          y={cy + 10}
          fill="rgba(255, 255, 255, 0.5)"
          fontSize="2.5"
          textAnchor="middle"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {winners}/{totalTrades} TRADES
        </motion.text>
      )}
    </g>
  );
}