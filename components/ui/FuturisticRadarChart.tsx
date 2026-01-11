"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RadarMetric {
  label: string;
  value: number; // 0-100
  description: string;
}

interface FuturisticRadarChartProps {
  title: string;
  metrics: RadarMetric[];
  color?: string;
}

export function FuturisticRadarChart({ 
  title, 
  metrics, 
  color = '#00ff88' 
}: FuturisticRadarChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const centerX = 50;
  const centerY = 50;
  const maxRadius = 40;
  const levels = 5; // 5 niveaux (20%, 40%, 60%, 80%, 100%)

  // Calculer les points du polygone
  const calculatePoint = (angle: number, value: number) => {
    const radius = (value / 100) * maxRadius;
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  // Créer les points du radar
  const angleStep = 360 / metrics.length;
  const radarPoints = metrics.map((metric, index) => {
    const angle = angleStep * index;
    return calculatePoint(angle, metric.value);
  });

  // Créer le path du polygone
  const radarPath = radarPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z';

  // Score global moyen
  const averageScore = Math.round(
    metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length
  );

  // Déterminer la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { primary: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' };
    if (score >= 60) return { primary: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' };
    return { primary: '#ff3366', glow: 'rgba(255, 51, 102, 0.6)' };
  };

  const scoreColors = getScoreColor(averageScore);

  return (
    <div className="relative h-full rounded-2xl border border-gray-800/50 p-4 bg-black/40 backdrop-blur-xl overflow-hidden group hover:border-gray-700/70 transition-all">
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

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-mono text-white">{title}</h3>
            <p className="text-xs text-gray-400 font-mono">Multi-dimensional analysis</p>
          </div>
          <div 
            className="px-4 py-2 rounded-lg border font-mono font-bold text-2xl"
            style={{
              borderColor: `${scoreColors.primary}40`,
              background: `linear-gradient(135deg, ${scoreColors.primary}20, transparent)`,
              color: scoreColors.primary,
            //   boxShadow: `0 0 20px ${scoreColors.glow}`
            }}
          >
            {averageScore}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex-1 flex items-center justify-center relative">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full max-w-[280px] max-h-[280px]"
          >
            <defs>
              <filter id="glow-radar">
                <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={scoreColors.primary} stopOpacity="0.1" />
                <stop offset="100%" stopColor={scoreColors.primary} stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Cercles de niveau de fond */}
            {[...Array(levels)].map((_, i) => {
              const radius = maxRadius * ((i + 1) / levels);
              return (
                <circle
                  key={i}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Lignes radiales vers chaque métrique */}
            {metrics.map((_, index) => {
              const angle = angleStep * index;
              const endPoint = calculatePoint(angle, 100);
              return (
                <line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Polygone du radar avec animation */}
            {mounted && (
              <motion.path
                d={radarPath}
                fill="url(#radar-gradient)"
                stroke={scoreColors.primary}
                strokeWidth="0.3"
                filter="url(#glow-radar)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                style={{ transformOrigin: '50% 50%' }}
              />
            )}

            {/* Points aux extrémités avec valeurs */}
            {mounted && radarPoints.map((point, index) => {
              const metric = metrics[index];
              const isHovered = hoveredIndex === index;
              const angle = angleStep * index;
              const labelPoint = calculatePoint(angle, 110);

              return (
                <g 
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Point */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 1.1 : 0.8}
                    fill={scoreColors.primary}
                    filter="url(#glow-radar)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  />

                  {/* Label avec texte */}
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isHovered ? scoreColors.primary : 'rgba(255, 255, 255, 0.7)'}
                    fontSize="3.5"
                    fontWeight="bold"
                    style={{ 
                      fontFamily: 'monospace',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {metric.label}
                  </text>

                  {/* Valeur en pourcentage */}
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y + 4}
                    textAnchor="middle"
                    fill={scoreColors.primary}
                    fontSize="2.5"
                    fontWeight="bold"
                    style={{ fontFamily: 'monospace' }}
                    opacity={isHovered ? 1 : 0.7}
                  >
                    {metric.value}%
                  </text>
                </g>
              );
            })}

            {/* Centre avec icône */}
            <circle
              cx={centerX}
              cy={centerY}
              r="10"
              fill="rgba(0, 0, 0, 0.8)"
              stroke={scoreColors.primary}
              strokeWidth="0.5"
            />
            <text
              x={centerX}
              y={centerY + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={scoreColors.primary}
              fontSize="4"
              fontWeight="bold"
              style={{ fontFamily: 'monospace' }}
            >
              ★
            </text>
          </svg>

          {/* Tooltip au survol */}
          {hoveredIndex !== null && (
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border rounded-lg p-3 min-w-[200px]"
              style={{
                borderColor: `${scoreColors.primary}40`,
                boxShadow: `0 0 20px ${scoreColors.glow}`
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-mono font-bold mb-1" style={{ color: scoreColors.primary }}>
                {metrics[hoveredIndex].label}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                {metrics[hoveredIndex].description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">SCORE</span>
                <span className="text-sm font-bold font-mono" style={{ color: scoreColors.primary }}>
                  {metrics[hoveredIndex].value}%
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}