import { Icon } from "@iconify/react";

interface FuturisticPnLCardProps {
  title: string;
  value: string;
  change?: string;
  subtext?: string;
  isPositive?: boolean;
  icon?: string;
}

export function FuturisticCard({
  title,
  value,
  change,
  subtext,
  isPositive = true,
  icon = "mdi:wallet"
}: FuturisticPnLCardProps) {
  const accentColor = isPositive ? '#00ff88' : '#ff3366';
  const accentSecondary = isPositive ? '#00cc6a' : '#cc0033';

  return (
    <div className="min-h-[80px]">
      <div className="relative h-full rounded-2xl border border-gray-800/50 p-2 md:rounded-3xl md:p-3 overflow-hidden group hover:border-gray-700/70 transition-all duration-300">
        {/* Gradient de fond animé */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}10, transparent 70%)`
          }}
        />
        
        {/* Grille de fond subtile */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl p-5 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Icône avec effet néon */}
            <div 
              className="w-fit rounded-lg border p-2 relative group-hover:scale-110 transition-transform duration-300"
              style={{
                borderColor: `${accentColor}40`,
                background: `linear-gradient(135deg, ${accentColor}10, transparent)`,
                boxShadow: `0 0 10px ${accentColor}20`
              }}
            >
              <Icon
                icon={icon}
                className="text-xl"
                style={{ color: accentColor }}
              />
              
              {/* Lueur pulsante sur l'icône */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: `0 0 20px ${accentColor}60`,
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
            </div>

            {/* Indicateur de variation */}
            {change && (
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-mono font-bold"
                style={{
                  borderColor: `${accentColor}30`,
                  background: `linear-gradient(90deg, ${accentColor}15, transparent)`,
                  color: accentColor
                }}
              >
                <Icon 
                  icon={isPositive ? "mdi:arrow-up" : "mdi:arrow-down"} 
                  className="text-sm"
                />
                <span>{change}</span>
              </div>
            )}
          </div>

          {/* Ligne de séparation tech */}
          <div className="relative h-px">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`
              }}
            />
            {/* Points décoratifs */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex flex-col gap-1">
            {/* Titre avec effet typing */}
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-mono uppercase tracking-wider opacity-70"
                style={{ color: accentColor }}
              >
                {title}
              </span>
              {/* Petit indicateur clignotant */}
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  animation: 'blink 2s ease-in-out infinite'
                }}
              />
            </div>

            {/* Valeur avec effet glow */}
            <div className="relative">
              <span 
                className="text-2xl md:text-3xl font-bold font-mono"
                style={{
                  color: accentColor,
                  textShadow: `0 0 20px ${accentColor}60, 0 0 40px ${accentColor}30`
                }}
              >
                {value}
              </span>
              
              {/* Scan line qui passe */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-px opacity-50"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  animation: 'scanLine 3s ease-in-out infinite'
                }}
              />
            </div>

            {/* Subtext */}
            {subtext && (
              <div className="text-xs opacity-70" style={{ color: accentColor }}>
                {subtext}
              </div>
            )}
          </div>

          {/* Coins décoratifs */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 opacity-30" style={{ borderColor: accentColor }} />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 opacity-30" style={{ borderColor: accentColor }} />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 opacity-30" style={{ borderColor: accentColor }} />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 opacity-30" style={{ borderColor: accentColor }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes blink {
          0%, 49%, 100% {
            opacity: 1;
          }
          50%, 99% {
            opacity: 0.3;
          }
        }

        @keyframes scanLine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}