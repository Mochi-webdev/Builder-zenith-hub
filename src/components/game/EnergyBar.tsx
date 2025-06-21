import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Zap, Battery } from "lucide-react";
import { useEffect, useState } from "react";

interface EnergyBarProps {
  current: number;
  max: number;
  regenRate: number;
  className?: string;
}

interface EnergyParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function EnergyBar({
  current,
  max,
  regenRate,
  className,
}: EnergyBarProps) {
  const [particles, setParticles] = useState<EnergyParticle[]>([]);
  const [isCharging, setIsCharging] = useState(false);

  const energyPercentage = (current / max) * 100;
  const energyCrystals = Array.from({ length: max }, (_, i) => i < current);
  const isLowEnergy = energyPercentage < 30;
  const isFullEnergy = energyPercentage >= 100;

  // Particle effects for energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0);

        // Add particles when energy is regenerating
        if (current < max && Math.random() < 0.3) {
          for (let i = 0; i < 2; i++) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 200,
              y: 60 + Math.random() * 20,
              vx: (Math.random() - 0.5) * 2,
              vy: -Math.random() * 2 - 1,
              life: 30,
              maxLife: 30,
            });
          }
        }

        return newParticles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [current, max]);

  // Detect energy charging state
  useEffect(() => {
    if (current < max) {
      setIsCharging(true);
      const timeout = setTimeout(() => setIsCharging(false), 2000);
      return () => clearTimeout(timeout);
    } else {
      setIsCharging(false);
    }
  }, [current, max]);

  return (
    <div
      className={cn("floating-panel p-6 relative overflow-hidden", className)}
    >
      {/* Energy Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life / particle.maxLife,
              boxShadow: "0 0 6px currentColor",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isFullEnergy
                ? "bg-gradient-to-br from-green-500 to-emerald-500 animate-pulse-glow"
                : isLowEnergy
                  ? "bg-gradient-to-br from-red-500 to-orange-500"
                  : "bg-gradient-to-br from-blue-500 to-purple-500",
            )}
          >
            {isCharging ? (
              <Battery className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Zap
                className={cn(
                  "w-5 h-5 text-white transition-all duration-300",
                  isFullEnergy && "animate-bounce-glow",
                )}
              />
            )}
          </div>

          {/* Energy Status Ring */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 transition-all duration-300",
              isFullEnergy
                ? "border-green-400 animate-pulse-glow"
                : isCharging
                  ? "border-blue-400 animate-pulse"
                  : "border-transparent",
            )}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-white tracking-wide mb-1">
            Energy Core
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-2xl font-mono font-bold tracking-wider transition-colors duration-300",
                isFullEnergy
                  ? "text-green-400"
                  : isLowEnergy
                    ? "text-red-400"
                    : "text-blue-400",
              )}
            >
              {Math.floor(current)}
            </span>
            <span className="text-white/60">/</span>
            <span className="text-white/80 font-mono font-bold">{max}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-right">
          <div
            className={cn(
              "text-xs font-medium uppercase tracking-wide mb-1 transition-colors duration-300",
              isFullEnergy
                ? "text-green-400"
                : isCharging
                  ? "text-blue-400"
                  : "text-white/60",
            )}
          >
            {isFullEnergy
              ? "Fully Charged"
              : isCharging
                ? "Charging..."
                : "Ready"}
          </div>
          <div className="text-xs text-white/60">+{regenRate}/sec</div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative mb-6">
        <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden border border-white/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Main Progress */}
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full relative overflow-hidden",
              isFullEnergy
                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                : isLowEnergy
                  ? "bg-gradient-to-r from-red-500 to-orange-400"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400",
            )}
            style={{ width: `${energyPercentage}%` }}
          >
            {/* Animated Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

            {/* Energy Flow Animation */}
            {isCharging && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-energy-flow" />
            )}
          </div>

          {/* Segment Markers */}
          {Array.from({ length: max - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${((i + 1) / max) * 100}%` }}
            />
          ))}
        </div>

        {/* Percentage Label */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full transition-all duration-300",
              isFullEnergy
                ? "bg-green-500/20 text-green-400"
                : isLowEnergy
                  ? "bg-red-500/20 text-red-400"
                  : "bg-blue-500/20 text-blue-400",
            )}
          >
            {Math.round(energyPercentage)}%
          </span>
        </div>
      </div>

      {/* Enhanced Energy Crystals */}
      <div className="flex gap-3 justify-center mb-4">
        {energyCrystals.map((filled, index) => (
          <div key={index} className="relative group">
            <div
              className={cn(
                "w-8 h-8 rounded-lg transition-all duration-300 relative overflow-hidden",
                filled
                  ? "bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 animate-pulse-glow shadow-lg"
                  : "bg-gradient-to-br from-slate-600 to-slate-800 opacity-40",
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Crystal Inner Glow */}
              {filled && (
                <>
                  <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-shimmer" />
                </>
              )}

              {/* Crystal Facets */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1 left-1 right-1 h-px bg-white/50" />
                <div className="absolute top-1 bottom-1 left-1 w-px bg-white/30" />
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Status Messages */}
      <div className="text-center">
        {isFullEnergy && (
          <div className="text-xs text-green-400 font-medium animate-pulse-glow">
            ⚡ Energy Core at Maximum Capacity ⚡
          </div>
        )}
        {isLowEnergy && !isFullEnergy && (
          <div className="text-xs text-red-400 font-medium animate-pulse">
            ⚠️ Low Energy - Regenerating...
          </div>
        )}
        {!isLowEnergy && !isFullEnergy && (
          <div className="text-xs text-white/60">
            Energy regenerating at {regenRate} units per second
          </div>
        )}
      </div>

      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Energy Orbs */}
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full opacity-30 transition-all duration-300",
              isFullEnergy ? "bg-green-400" : "bg-blue-400",
            )}
            style={{
              left: `${15 + i * 25}%`,
              top: `${20 + (i % 2) * 40}%`,
              animation: `character-hover ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
