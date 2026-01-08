import React, { useState, useEffect } from 'react';

export default function LongVsShort() {
  const [mounted, setMounted] = useState(false);
  const [hoveredSide, setHoveredSide] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Data de l'utilisateur
  const longPositions = 65; // Nombre de positions long
  const shortPositions = 35; // Nombre de positions short
  
  const total = longPositions + shortPositions;
  const longPercentage = (longPositions / total) * 100;
  const shortPercentage = (shortPositions / total) * 100;

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full ">
        {/* Titre */}
        <div className="text-center mb-2">
          <p className="text-gray-400 text-sm">
            Total: {total} positions
          </p>
        </div>

        {/* Container principal */}
        <div className="relative">
          {/* Ligne centrale de séparation */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 z-10" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-black border-2 border-white/30 rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VS</span>
            </div>
          </div>

          {/* Barres horizontales */}
          <div className="flex items-center gap-0 relative h-24">
            {/* LONG - côté gauche (bleu) */}
            <div 
              className="relative flex-1 h-full flex items-center justify-end pr-8 cursor-pointer transition-all duration-500"
              onMouseEnter={() => setHoveredSide('long')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                width: mounted ? `${longPercentage}%` : '0%',
              }}
            >
              <div 
                className="absolute inset-0 rounded-l-2xl transition-all duration-500"
                style={{
                  background: hoveredSide === 'long' 
                    ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.9) 100%)'
                    : 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.7) 100%)',
                  boxShadow: hoveredSide === 'long' 
                    ? '0 0 40px rgba(59, 130, 246, 0.6), inset 0 0 40px rgba(59, 130, 246, 0.2)'
                    : '0 0 20px rgba(59, 130, 246, 0.3)',
                  transform: hoveredSide === 'long' ? 'scaleY(1.1)' : 'scaleY(1)',
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                }}
              />
              
              <div className="relative z-10 text-right">
                <div className="text-white font-bold text-4xl mb-1 transition-all duration-300"
                     style={{
                       transform: hoveredSide === 'long' ? 'scale(1.1)' : 'scale(1)',
                       textShadow: '0 2px 10px rgba(59, 130, 246, 0.8)'
                     }}>
                  {longPositions}
                </div>
                <div className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
                  Long
                </div>
                <div className="text-blue-200 text-xs mt-1 font-medium">
                  {longPercentage.toFixed(1)}%
                </div>
              </div>

              {/* Particules décoratives */}
              {hoveredSide === 'long' && (
                <>
                  <div className="absolute left-4 top-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <div className="absolute left-1/4 top-3/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-100" />
                  <div className="absolute left-1/3 top-1/2 w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-200" />
                </>
              )}
            </div>

            {/* SHORT - côté droit (rouge) */}
            <div 
              className="relative flex-1 h-full flex items-center justify-start pl-8 cursor-pointer transition-all duration-500"
              onMouseEnter={() => setHoveredSide('short')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                width: mounted ? `${shortPercentage}%` : '0%',
              }}
            >
              <div 
                className="absolute inset-0 rounded-r-2xl transition-all duration-500"
                style={{
                  background: hoveredSide === 'short' 
                    ? 'linear-gradient(270deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.9) 100%)'
                    : 'linear-gradient(270deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.7) 100%)',
                  boxShadow: hoveredSide === 'short' 
                    ? '0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 40px rgba(239, 68, 68, 0.2)'
                    : '0 0 20px rgba(239, 68, 68, 0.3)',
                  transform: hoveredSide === 'short' ? 'scaleY(1.1)' : 'scaleY(1)',
                  border: '2px solid rgba(239, 68, 68, 0.5)',
                }}
              />
              
              <div className="relative z-10 text-left">
                <div className="text-white font-bold text-4xl mb-1 transition-all duration-300"
                     style={{
                       transform: hoveredSide === 'short' ? 'scale(1.1)' : 'scale(1)',
                       textShadow: '0 2px 10px rgba(239, 68, 68, 0.8)'
                     }}>
                  {shortPositions}
                </div>
                <div className="text-red-300 text-sm font-semibold uppercase tracking-wider">
                  Short
                </div>
                <div className="text-red-200 text-xs mt-1 font-medium">
                  {shortPercentage.toFixed(1)}%
                </div>
              </div>

              {/* Particules décoratives */}
              {hoveredSide === 'short' && (
                <>
                  <div className="absolute right-4 top-1/4 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <div className="absolute right-1/4 top-3/4 w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse delay-100" />
                  <div className="absolute right-1/3 top-1/2 w-1 h-1 bg-red-500 rounded-full animate-pulse delay-200" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}