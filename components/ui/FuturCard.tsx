import { ReactNode } from "react";

interface FuturCardProps {
  children: ReactNode;
  className?: string;
}

export function FuturCard({
  children,
  className = ""
}: FuturCardProps) {
  const accentColor = '#00ff88';

  return (
    <div className={`min-h-[80px] ${className}`}>
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
          {children}
        </div>

        {/* Coins décoratifs */}
       
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