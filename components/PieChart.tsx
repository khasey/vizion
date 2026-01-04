import React, { useState, useEffect } from 'react';

export default function PieChart() {
  const [mounted, setMounted] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const segments = [
    {
      id: 1,
      color: '#3B9FD8',
      value: 30,
      label: 'Objectif 1',
    },
    {
      id: 2,
      color: '#00D084',
      value: 25,
      label: 'Objectif 2',
    },
    {
      id: 3,
      color: '#FFD700',
      value: 20,
      label: 'Objectif 3',
    },
    {
      id: 4,
      color: '#8B7355',
      value: 25,
      label: 'Objectif 4',
    }
  ];

  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const radius = 150;
  const centerX = 250;
  const centerY = 250;

  // Calculate segment paths
  let currentAngle = -90; // Start at top
  const segmentPaths = segments.map((segment) => {
    const percentage = (segment.value / total);
    const angle = percentage * 360;
    
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    // Calculate label position (middle of segment)
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(midRad);
    const labelY = centerY + labelRadius * Math.sin(midRad);

    // Calculate outer label position
    const outerLabelRadius = radius + 40;
    const outerLabelX = centerX + outerLabelRadius * Math.cos(midRad);
    const outerLabelY = centerY + outerLabelRadius * Math.sin(midRad);
    
    currentAngle = endAngle;
    
    return {
      ...segment,
      pathData,
      percentage: (percentage * 100).toFixed(1),
      labelX,
      labelY,
      outerLabelX,
      outerLabelY,
      midAngle
    };
  });

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
            {/* Gradient definitions for each segment */}
            {segments.map(segment => (
              <linearGradient 
                key={`grad-${segment.id}`}
                id={`gradient-${segment.id}`}
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="100%"
              >
                <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                <stop offset="100%" stopColor={segment.color} stopOpacity="0.7" />
              </linearGradient>
            ))}
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Shadow filter */}
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 5}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="2"
          />

          {/* Pie segments */}
          <g filter="url(#shadow)">
            {segmentPaths.map((segment, index) => {
              const isHovered = hoveredSegment === segment.id;
              
              return (
                <g key={`segment-${segment.id}`}>
                  <path
                    d={segment.pathData}
                    fill={`url(#gradient-${segment.id})`}
                    stroke="rgba(0, 0, 0, 0.3)"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    filter={isHovered ? "url(#glow)" : "none"}
                    style={{
                      cursor: 'pointer',
                      transform: isHovered ? `translate(${Math.cos((segment.midAngle * Math.PI) / 180) * 10}px, ${Math.sin((segment.midAngle * Math.PI) / 180) * 10}px)` : 'none',
                      transformOrigin: `${centerX}px ${centerY}px`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: mounted ? 1 : 0,
                      transitionDelay: `${index * 0.1}s`
                    }}
                  />
                  
                  {/* Inner percentage label */}
                  {mounted && (
                    <text
                      x={segment.labelX}
                      y={segment.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={isHovered ? "22" : "18"}
                      fontWeight="bold"
                      style={{
                        transition: 'all 0.3s ease',
                        transitionDelay: `${index * 0.1 + 0.3}s`,
                        opacity: mounted ? 1 : 0,
                        pointerEvents: 'none',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                      }}
                    >
                      {segment.percentage}%
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="40"
            fill="black"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
            filter="url(#shadow)"
          />

          {/* Center icon/text */}
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
            opacity="0.6"
          >
            Total
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="18"
            fontWeight="bold"
          >
            {total}
          </text>
        </svg>

        {/* Floating outer labels */}

        {/* Legend */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {segments.map((segment, index) => (
            <div 
              key={`legend-${segment.id}`}
              className="flex items-center gap-1 cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSegment(segment.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              style={{
                opacity: hoveredSegment === null || hoveredSegment === segment.id ? 1 : 0.4,
                transitionDelay: `${index * 0.1 + 0.5}s`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: segment.color,
                  boxShadow: hoveredSegment === segment.id ? `0 0 8px ${segment.color}` : 'none'
                }}
              />
              <span className="text-[10px] text-gray-300 font-medium whitespace-nowrap">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}