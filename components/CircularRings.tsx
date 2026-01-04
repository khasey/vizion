import React, { useState, useEffect } from 'react';

export default function CircularRings() {
  const [mounted, setMounted] = useState(false);
  const [hoveredRing, setHoveredRing] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rings = [
    {
      id: 1,
      color: '#3B9FD8',
      radius: 180,
      strokeWidth: 45,
      progress: 0.65,
      label: 'Objectif 1',
      value: '65%'
    },
    {
      id: 2,
      color: '#00D084',
      radius: 135,
      strokeWidth: 40,
      progress: 0.80,
      label: 'Objectif 2',
      value: '80%'
    },
    {
      id: 3,
      color: '#FFD700',
      radius: 95,
      strokeWidth: 35,
      progress: 0.55,
      label: 'Objectif 3',
      value: '55%'
    },
    {
      id: 4,
      color: '#8B7355',
      radius: 60,
      strokeWidth: 30,
      progress: 0.75,
      label: 'Objectif 4',
      value: '75%'
    }
  ];

  const calculatePath = (radius, progress, strokeWidth) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);
    return { circumference, offset };
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Main SVG Container */}
        <svg 
          width="300" 
          height="300" 
          viewBox="0 0 500 500"
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Gradient definitions for each ring */}
            {rings.map(ring => (
              <linearGradient 
                key={`grad-${ring.id}`}
                id={`gradient-${ring.id}`}
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="100%"
              >
                <stop offset="0%" stopColor={ring.color} stopOpacity="1" />
                <stop offset="100%" stopColor={ring.color} stopOpacity="0.6" />
              </linearGradient>
            ))}
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background circles (track) */}
          {rings.map(ring => {
            const { circumference } = calculatePath(ring.radius, ring.progress, ring.strokeWidth);
            return (
              <circle
                key={`bg-${ring.id}`}
                cx="250"
                cy="250"
                r={ring.radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
              />
            );
          })}

          {/* Progress circles */}
          {rings.map(ring => {
            const { circumference, offset } = calculatePath(ring.radius, ring.progress, ring.strokeWidth);
            const isHovered = hoveredRing === ring.id;
            
            return (
              <g key={`ring-${ring.id}`}>
                <circle
                  cx="250"
                  cy="250"
                  r={ring.radius}
                  fill="none"
                  stroke={`url(#gradient-${ring.id})`}
                  strokeWidth={isHovered ? ring.strokeWidth + 4 : ring.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={mounted ? offset : circumference}
                  transform="rotate(-90 250 250)"
                  filter={isHovered ? "url(#glow)" : "none"}
                  onMouseEnter={() => setHoveredRing(ring.id)}
                  onMouseLeave={() => setHoveredRing(null)}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    strokeDashoffset: mounted ? offset : circumference,
                    transitionDelay: `${ring.id * 0.15}s`
                  }}
                />
                
                {/* End cap circle */}
                {mounted && (
                  <circle
                    cx={250 + ring.radius * Math.cos((ring.progress * 2 * Math.PI) - Math.PI / 2)}
                    cy={250 + ring.radius * Math.sin((ring.progress * 2 * Math.PI) - Math.PI / 2)}
                    r={isHovered ? 8 : 6}
                    fill={ring.color}
                    filter="url(#glow)"
                    style={{
                      transition: 'all 0.3s ease',
                      transitionDelay: `${ring.id * 0.15 + 0.5}s`,
                      opacity: mounted ? 1 : 0
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx="250"
            cy="250"
            r="30"
            fill="black"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
        </svg>

        {/* Floating labels */}
        {/* <div className="absolute inset-0 pointer-events-none">
          {rings.map((ring, index) => {
            const angle = (ring.progress * 360) - 90;
            const x = 250 + (ring.radius + 35) * Math.cos((angle * Math.PI) / 180);
            const y = 250 + (ring.radius + 35) * Math.sin((angle * Math.PI) / 180);
            const isHovered = hoveredRing === ring.id;

            return (
              <div
                key={`label-${ring.id}`}
                className="absolute transition-all duration-300"
                style={{
                  left: `${(x / 500) * 100}%`,
                  top: `${(y / 500) * 100}%`,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
                  opacity: mounted ? 1 : 0,
                  transitionDelay: `${ring.id * 0.15 + 0.6}s`
                }}
              >
                <div 
                  className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border"
                  style={{ 
                    borderColor: ring.color,
                    boxShadow: isHovered ? `0 0 20px ${ring.color}40` : 'none'
                  }}
                >
                  <div className="text-xs text-gray-400 font-medium">{ring.label}</div>
                  <div 
                    className="text-lg font-bold"
                    style={{ color: ring.color }}
                  >
                    {ring.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}

        {/* Legend */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {rings.map(ring => (
            <div 
              key={`legend-${ring.id}`}
              className="flex items-center gap-1 cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredRing(ring.id)}
              onMouseLeave={() => setHoveredRing(null)}
              style={{
                opacity: hoveredRing === null || hoveredRing === ring.id ? 1 : 0.4
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: ring.color,
                  boxShadow: hoveredRing === ring.id ? `0 0 8px ${ring.color}` : 'none'
                }}
              />
              <span className="text-[10px] text-gray-300 font-medium whitespace-nowrap">{ring.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}