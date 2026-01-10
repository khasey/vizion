"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface FuturisticGlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "cyan" | "green" | "red";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const FuturisticGlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: FuturisticGlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    // Définir les gradients futuristes selon la variante
    const getGradient = () => {
      switch (variant) {
        case "cyan":
          return `radial-gradient(circle, #00d4ff 10%, #00d4ff00 20%),
                  radial-gradient(circle at 40% 40%, #0088ff 5%, #0088ff00 15%),
                  radial-gradient(circle at 60% 60%, #00ffcc 10%, #00ffcc00 20%), 
                  radial-gradient(circle at 40% 60%, #0066ff 10%, #0066ff00 20%),
                  repeating-conic-gradient(
                    from 236.84deg at 50% 50%,
                    #00d4ff 0%,
                    #0088ff calc(25% / var(--repeating-conic-gradient-times)),
                    #00ffcc calc(50% / var(--repeating-conic-gradient-times)), 
                    #0066ff calc(75% / var(--repeating-conic-gradient-times)),
                    #00d4ff calc(100% / var(--repeating-conic-gradient-times))
                  )`;
        
        case "green":
          return `radial-gradient(circle, #00ff88 10%, #00ff8800 20%),
                  radial-gradient(circle at 40% 40%, #00cc6a 5%, #00cc6a00 15%),
                  radial-gradient(circle at 60% 60%, #00ffaa 10%, #00ffaa00 20%), 
                  radial-gradient(circle at 40% 60%, #00dd77 10%, #00dd7700 20%),
                  repeating-conic-gradient(
                    from 236.84deg at 50% 50%,
                    #00ff88 0%,
                    #00cc6a calc(25% / var(--repeating-conic-gradient-times)),
                    #00ffaa calc(50% / var(--repeating-conic-gradient-times)), 
                    #00dd77 calc(75% / var(--repeating-conic-gradient-times)),
                    #00ff88 calc(100% / var(--repeating-conic-gradient-times))
                  )`;
        
        case "red":
          return `radial-gradient(circle, #ff3366 10%, #ff336600 20%),
                  radial-gradient(circle at 40% 40%, #cc0033 5%, #cc003300 15%),
                  radial-gradient(circle at 60% 60%, #ff5588 10%, #ff558800 20%), 
                  radial-gradient(circle at 40% 60%, #ff1144 10%, #ff114400 20%),
                  repeating-conic-gradient(
                    from 236.84deg at 50% 50%,
                    #ff3366 0%,
                    #cc0033 calc(25% / var(--repeating-conic-gradient-times)),
                    #ff5588 calc(50% / var(--repeating-conic-gradient-times)), 
                    #ff1144 calc(75% / var(--repeating-conic-gradient-times)),
                    #ff3366 calc(100% / var(--repeating-conic-gradient-times))
                  )`;
        
        default: // Thème futuriste principal (vert néon + cyan + violet)
          return `radial-gradient(circle, #00ff88 10%, #00ff8800 20%),
                  radial-gradient(circle at 40% 40%, #00d4ff 5%, #00d4ff00 15%),
                  radial-gradient(circle at 60% 60%, #b366ff 10%, #b366ff00 20%), 
                  radial-gradient(circle at 40% 60%, #00ffcc 10%, #00ffcc00 20%),
                  repeating-conic-gradient(
                    from 236.84deg at 50% 50%,
                    #00ff88 0%,
                    #00d4ff calc(25% / var(--repeating-conic-gradient-times)),
                    #b366ff calc(50% / var(--repeating-conic-gradient-times)), 
                    #00ffcc calc(75% / var(--repeating-conic-gradient-times)),
                    #00ff88 calc(100% / var(--repeating-conic-gradient-times))
                  )`;
      }
    };

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "green" && "border-[#00ff88]",
            variant === "cyan" && "border-[#00d4ff]",
            variant === "red" && "border-[#ff3366]",
            variant === "default" && "border-[#00ff88]",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient": getGradient(),
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              "after:content-[''] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]",
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

FuturisticGlowingEffect.displayName = "FuturisticGlowingEffect";

export { FuturisticGlowingEffect };