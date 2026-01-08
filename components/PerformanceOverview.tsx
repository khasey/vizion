import { GlowingEffect } from "@/components/ui/glowing-effect";

interface PerformanceOverviewProps {
  equityCurveData: { day: number; equity: number; pnl: number }[];
  maxValue: number;
  minValue: number;
  range: number;
  curveView: 'equity' | 'pnl' | 'both';
  setCurveView: (view: 'equity' | 'pnl' | 'both') => void;
}

export default function PerformanceOverview({
  equityCurveData,
  maxValue,
  minValue,
  range,
  curveView,
  setCurveView,
}: PerformanceOverviewProps) {
  return (
    <div className="min-h-[250px] max-h-[600px]">
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-xl p-4 bg-white dark:bg-black">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-lg font-bold">Performance Overview</h3>
              <p className="text-xs text-default-600">Last 20 trades</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-default-100 dark:bg-default-50/10 rounded-lg p-0.5">
                <button
                  onClick={() => setCurveView('equity')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                    curveView === 'equity'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200'
                  }`}
                >
                  Equity
                </button>
                <button
                  onClick={() => setCurveView('pnl')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                    curveView === 'pnl'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200'
                  }`}
                >
                  Trade PnL
                </button>
                <button
                  onClick={() => setCurveView('both')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${
                    curveView === 'both'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200'
                  }`}
                >
                  Both
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                {(curveView === 'equity' || curveView === 'both') && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-default-600">Equity</span>
                  </div>
                )}
                {(curveView === 'pnl' || curveView === 'both') && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-default-600">PnL</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] text-default-600">
              <span>${(maxValue / 1000).toFixed(1)}k</span>
              <span>${((maxValue + minValue) / 2000).toFixed(1)}k</span>
              <span>${(minValue / 1000).toFixed(1)}k</span>
            </div>
            <div className="ml-12 h-full pb-6 relative">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="400" y2="0" stroke="currentColor" strokeWidth="0.3" className="text-default-300 dark:text-default-700" />
                <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" strokeWidth="0.3" className="text-default-300 dark:text-default-700" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="0.3" className="text-default-300 dark:text-default-700" />

                {(curveView === 'equity' || curveView === 'both') && (
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(59, 130, 246, 0.3))' }}
                    points={equityCurveData
                      .map((d, i) => {
                        const x = (i / (equityCurveData.length - 1)) * 400;
                        const y = 150 - ((d.equity - minValue) / range) * 150;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {(curveView === 'pnl' || curveView === 'both') && (
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(34, 197, 94, 0.3))' }}
                    points={equityCurveData
                      .map((d, i) => {
                        const x = (i / (equityCurveData.length - 1)) * 400;
                        const y = 150 - ((d.pnl - minValue) / range) * 150;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {(curveView === 'equity' || curveView === 'both') &&
                  equityCurveData.map((d, i) => {
                    const x = (i / (equityCurveData.length - 1)) * 400;
                    const y = 150 - ((d.equity - minValue) / range) * 150;

                    return (
                      <g key={`equity-point-${i}`}>
                        <circle cx={x} cy={y} r="0.8" fill="#3b82f6" opacity="0.2" />
                        <circle
                          cx={x}
                          cy={y}
                          r="0.8"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="0.8"
                          style={{ cursor: 'pointer' }}
                          className="hover:r-3 transition-all"
                        />
                      </g>
                    );
                  })}

                {(curveView === 'pnl' || curveView === 'both') &&
                  equityCurveData.map((d, i) => {
                    const x = (i / (equityCurveData.length - 1)) * 400;
                    const y = 150 - ((d.pnl - minValue) / range) * 150;

                    return (
                      <g key={`pnl-point-${i}`}>
                        <circle cx={x} cy={y} r="0.8" fill="#22c55e" opacity="0.2" />
                        <circle
                          cx={x}
                          cy={y}
                          r="0.8"
                          fill="#22c55e"
                          stroke="white"
                          strokeWidth="0.8"
                          style={{ cursor: 'pointer' }}
                          className="hover:r-3 transition-all"
                        />
                      </g>
                    );
                  })}

                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                  </linearGradient>
                  <linearGradient id="pnlAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>

                {(curveView === 'equity' || curveView === 'both') && (
                  <polygon
                    fill="url(#areaGradient)"
                    points={`0,150 ${equityCurveData
                      .map((d, i) => {
                        const x = (i / (equityCurveData.length - 1)) * 400;
                        const y = 150 - ((d.equity - minValue) / range) * 150;
                        return `${x},${y}`;
                      })
                      .join(' ')} 400,150`}
                  />
                )}

                {(curveView === 'pnl' || curveView === 'both') && (
                  <polygon
                    fill="url(#pnlAreaGradient)"
                    points={`0,150 ${equityCurveData
                      .map((d, i) => {
                        const x = (i / (equityCurveData.length - 1)) * 400;
                        const y = 150 - ((d.pnl - minValue) / range) * 150;
                        return `${x},${y}`;
                      })
                      .join(' ')} 400,150`}
                  />
                )}
              </svg>
            </div>
            <div className="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-default-600">
              <span>Day 1</span>
              <span>Day 10</span>
              <span>Day 20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}