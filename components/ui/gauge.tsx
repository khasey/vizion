"use client";

interface GaugeProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  winners?: number;
  totalTrades?: number;
  colorStops?: Array<{ percent: number; color: string }>;
}

export function Gauge({
  value,
  label,
  showValue = true,
  winners,
  totalTrades,
  colorStops = [
    { percent: 0, color: "#3b82f6" },    // blue
    { percent: 100, color: "#22c55e" },   // green
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

  const centerY = 25; // moitié de 50
  const radius = 20; // 25 - 5 (marge)
  const centerX = 50; // moitié de 100
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
    const baseWidth = 2;
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
    <div className="flex flex-col items-center justify-center w-full h-full">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 50" 
        preserveAspectRatio="xMidYMid meet" 
        className="w-full h-full"
        style={{ maxHeight: '100%' }}
      >
        {/* Texte centré sur les pointillés */}
        {showValue && (
          <text
            x="50"
            y="25"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-current text-default-600 dark:text-default-400"
            style={{ fontSize: '3px' }}
          >
            {clampedValue.toFixed(0)}%
          </text>
        )}
        {showValue && winners !== undefined && totalTrades !== undefined && (
          <text
            x="50"
            y="30"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-current text-default-500"
            style={{ fontSize: '2px' }}
          >
            {winners}/{totalTrades} trades
          </text>
        )}
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
          strokeWidth="1"
          className="text-default-300 dark:text-default-700"
          strokeLinecap="round"
        />

        {/* Arc coloré complet avec gradient permanent */}
        <path
          d={createArc(centerX, centerY, radius, startAngle, endAngle)}
          fill="none"
          stroke={`url(#gauge-gradient-${label})`}
          strokeWidth="3"
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
            strokeWidth="0.5"
            className="text-default-400 dark:text-default-600"
            strokeDasharray="2 3"
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
          r="4" 
          fill="#9ca3af"
          filter={`url(#needle-shadow-${label})`}
          opacity="0.9"
        />
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="2.5" 
          fill="url(#needle-gradient-${label})"
        />
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="1" 
          fill="white"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}