"use client";

interface GaugeProps {
  value: number; // 0-100
  label?: string;
  size?: number;
  showValue?: boolean;
  colorStops?: Array<{ percent: number; color: string }>;
}

export function Gauge({
  value,
  label,
  size = 120,
  showValue = true,
  colorStops = [
    { percent: 0, color: "#ef4444" },    // red
    { percent: 25, color: "#f59e0b" },   // orange
    { percent: 50, color: "#eab308" },   // yellow
    { percent: 75, color: "#22c55e" },   // green
  ],
}: GaugeProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const startAngle = 90; // gauche
  const endAngle = -90;     // droite
  const angleRange = 360;// droite 

  const needleAngle = startAngle - (clampedValue / 100) * angleRange;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArc = (
    x: number,
    y: number,
    radius: number,
    start: number,
    end: number
  ) => {
    const startPt = polarToCartesian(x, y, radius, start);
    const endPt = polarToCartesian(x, y, radius, end);
    const largeArcFlag = Math.abs(end - start) <= 180 ? "0" : "1";
    return [
      "M",
      startPt.x,
      startPt.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      endPt.x,
      endPt.y,
    ].join(" ");
  };

  const centerY = size / 2;
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const needleLength = radius * 0.85;

  const getCurrentColor = (val: number) => {
    // Inverser la valeur pour que 100% = vert (gauche) et 0% = rouge (droite)
    const invertedVal = 100 - val;
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (invertedVal >= colorStops[i].percent) {
        return colorStops[i].color;
      }
    }
    return colorStops[0].color;
  };

  const currentColor = getCurrentColor(clampedValue);

  // Créer une aiguille en forme de flèche/triangle
  const createNeedle = () => {
    const tipPoint = polarToCartesian(centerX, centerY, needleLength, needleAngle);
    const baseWidth = 6;
    const tailLength = radius * 0.15;
    
    // Points de la base de l'aiguille (perpendiculaires à la direction)
    const perpAngle = needleAngle + 90;
    const leftBase = polarToCartesian(centerX, centerY, baseWidth, perpAngle);
    const rightBase = polarToCartesian(centerX, centerY, baseWidth, perpAngle + 180);
    
    // Point arrière de l'aiguille
    const tailPoint = polarToCartesian(centerX, centerY, tailLength, needleAngle + 180);
    
    return `M ${tipPoint.x} ${tipPoint.y} 
            L ${leftBase.x} ${leftBase.y} 
            L ${tailPoint.x} ${tailPoint.y}
            L ${rightBase.x} ${rightBase.y} 
            Z`;
  };

  return (
    <div className="flex flex-col items-center w-full pb-2">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size * 0.65}`} preserveAspectRatio="xMidYMid meet" className="max-w-full">
        <defs>
          <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            {colorStops.map((stop, i) => (
              <stop key={i} offset={`${stop.percent}%`} stopColor={stop.color} />
            ))}
          </linearGradient>

          <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feOffset in="blur" dx="0" dy="0" result="offsetBlur"/>
            <feComponentTransfer in="offsetBlur" result="brighter">
              <feFuncA type="linear" slope="2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="brighter"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient métallique pour l'aiguille (argenté) */}
          <linearGradient id={`needle-gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="1"/>
            <stop offset="25%" stopColor="#f9fafb" stopOpacity="1"/>
            <stop offset="50%" stopColor="#9ca3af" stopOpacity="1"/>
            <stop offset="75%" stopColor="#d1d5db" stopOpacity="1"/>
            <stop offset="100%" stopColor="#6b7280" stopOpacity="1"/>
          </linearGradient>

          {/* Ombre pour l'aiguille */}
          <filter id={`needle-shadow-${label}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4"/>
          </filter>
        </defs>

        {/* Arc de fond (gris discret) */}
        <path
          d={createArc(centerX, centerY, radius, startAngle, endAngle)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-default-300 dark:text-default-700"
          strokeLinecap="round"
        />

        {/* Arc coloré complet avec gradient permanent */}
        <path
          d={createArc(centerX, centerY, radius, startAngle, endAngle)}
          fill="none"
          stroke={`url(#gauge-gradient-${label})`}
          strokeWidth="10"
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
        />

        {/* Cercles concentriques style sonar */}
        {[0.4, 0.6, 0.8].map((f, i) => (
          <path
            key={i}
            d={createArc(centerX, centerY, radius * f, startAngle, endAngle)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-default-400 dark:text-default-600"
            strokeDasharray="5 6"
            opacity="0.4"
          />
        ))}

        {/* Aiguille en forme de flèche avec dégradé argenté */}
        <path
          d={createNeedle()}
          fill={`url(#needle-gradient-${label})`}
          filter={`url(#needle-shadow-${label})`}
          opacity="0.95"
        />

        {/* Bordure de l'aiguille pour plus de définition */}
        <path
          d={createNeedle()}
          fill="none"
          stroke="#4b5563"
          strokeWidth="0.5"
          opacity="0.8"
        />

        {/* Centre de l'aiguille avec effet 3D - argenté */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="10" 
          fill="#9ca3af"
          filter={`url(#needle-shadow-${label})`}
          opacity="0.9"
        />
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="7" 
          fill="url(#needle-gradient-${label})"
        />
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="3" 
          fill="white"
          opacity="0.9"
        />
      </svg>

      {showValue && (
        <div className="text-center mt-1">
          <div className="text-3xl font-bold" style={{ color: currentColor }}>
            {clampedValue.toFixed(0)}%
          </div>
          {label && (
            <div className="text-sm text-default-600 dark:text-default-400 mt-1">
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}