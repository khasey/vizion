"use client";

import { useState, useEffect } from 'react';

interface FuturisticLongShortBattleProps {
  longCount: number;
  shortCount: number;
}

export function FuturisticLongShortBattle({ longCount, shortCount }: FuturisticLongShortBattleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = longCount + shortCount;
  const longPercentage = total > 0 ? (longCount / total) * 100 : 0;
  const shortPercentage = total > 0 ? (shortCount / total) * 100 : 0;

  return (
    <div className="min-h-[120px]">
      <div className="relative h-full rounded-2xl border border-gray-800/50 p-2 md:rounded-3xl md:p-3 overflow-hidden group">
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

        <div className="relative flex flex-col gap-3 rounded-xl p-4 bg-black/40 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-mono text-gray-400">
              Total: <span className="text-white font-bold">{total}</span> positions
            </p>
          </div>

          {/* Battle Bar Container */}
          <div className="relative">
            {/* Background bar */}
            <div className="relative h-20 rounded-xl overflow-hidden bg-gray-900/50 border border-gray-800">
              {/* Long side (left) */}
              <div
                className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${longPercentage}%` : '0%',
                  background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.8) 100%)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                }}
              >
                {/* Animated scan lines */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.3) 2px, rgba(59, 130, 246, 0.3) 4px)',
                    animation: 'scanDown 2s linear infinite'
                  }}
                />
              </div>

              {/* Short side (right) */}
              <div
                className="absolute right-0 top-0 h-full transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${shortPercentage}%` : '0%',
                  background: 'linear-gradient(270deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.8) 100%)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                }}
              >
                {/* Animated scan lines */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.3) 2px, rgba(239, 68, 68, 0.3) 4px)',
                    animation: 'scanDown 2s linear infinite'
                  }}
                />
              </div>

              {/* Long Content (left side) */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <div className="text-left">
                  <div className="text-3xl font-bold font-mono text-blue-400" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}>
                    {longCount}
                  </div>
                  <div className="text-xs font-mono text-blue-300 uppercase tracking-wider">
                    LONG
                  </div>
                  <div className="text-xs font-mono text-blue-200 mt-0.5">
                    {longPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* VS Badge (center) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div 
                    className="w-14 h-14 rounded-full border-2 border-white/30 bg-black flex items-center justify-center font-bold text-white text-sm font-mono"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 255, 136, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    VS
                  </div>
                  {/* Pulsing ring */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-[#00ff88] animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
              </div>

              {/* Short Content (right side) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                <div className="text-right">
                  <div className="text-3xl font-bold font-mono text-red-400" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}>
                    {shortCount}
                  </div>
                  <div className="text-xs font-mono text-red-300 uppercase tracking-wider">
                    SHORT
                  </div>
                  <div className="text-xs font-mono text-red-200 mt-0.5">
                    {shortPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Central dividing line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />

              {/* Lightning effects at collision point */}
              {mounted && (
                <>
                  <div 
                    className="absolute left-1/2 top-1/4 w-1 h-1 rounded-full bg-[#00ff88] animate-pulse"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                  <div 
                    className="absolute left-1/2 top-3/4 w-1 h-1 rounded-full bg-[#00ff88] animate-pulse"
                    style={{ transform: 'translateX(-50%)', animationDelay: '0.5s' }}
                  />
                </>
              )}
            </div>

            {/* Battle intensity indicators */}
            <div className="flex items-center justify-between mt-3 px-2">
              {/* Long indicator */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-3 rounded-sm transition-all duration-500"
                      style={{
                        backgroundColor: i < Math.round(longPercentage / 20) ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                        boxShadow: i < Math.round(longPercentage / 20) ? '0 0 5px #3b82f6' : 'none',
                        transitionDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-blue-400">
                  📈
                </span>
              </div>

              {/* Dominant side indicator */}
              <div className="text-center">
                <p className="text-xs font-mono text-gray-400">
                  {longPercentage > shortPercentage ? (
                    <span className="text-blue-400 font-bold">LONG DOMINANT</span>
                  ) : longPercentage < shortPercentage ? (
                    <span className="text-red-400 font-bold">SHORT DOMINANT</span>
                  ) : (
                    <span className="text-[#00ff88] font-bold">BALANCED</span>
                  )}
                </p>
              </div>

              {/* Short indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-red-400">
                  📉
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-3 rounded-sm transition-all duration-500"
                      style={{
                        backgroundColor: i < Math.round(shortPercentage / 20) ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                        boxShadow: i < Math.round(shortPercentage / 20) ? '0 0 5px #ef4444' : 'none',
                        transitionDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coins décoratifs */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#00ff88]/30" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#00ff88]/30" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#00ff88]/30" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#00ff88]/30" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scanDown {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}