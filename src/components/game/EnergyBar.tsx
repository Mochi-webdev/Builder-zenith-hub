import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface EnergyBarProps {
  current: number;
  max: number;
  regenRate: number;
  className?: string;
}

export default function EnergyBar({
  current,
  max,
  regenRate,
  className,
}: EnergyBarProps) {
  const energyPercentage = (current / max) * 100;
  const energyCrystals = Array.from({ length: max }, (_, i) => i < current);

  return (
    <div className={cn("glass-effect p-4 rounded-lg", className)}>
      <div className="flex items-center gap-3 mb-3">
        <Zap className="w-6 h-6 text-anime-energy anime-glow" />
        <h3 className="text-lg font-bold text-white">Energy</h3>
        <span className="text-anime-energy font-mono font-bold">
          {Math.floor(current)}/{max}
        </span>
      </div>

      {/* Energy Progress Bar */}
      <div className="relative mb-4">
        <Progress
          value={energyPercentage}
          className="h-3 bg-slate-800/50"
          indicatorClassName="bg-gradient-to-r from-anime-energy via-blue-400 to-purple-400"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-anime-energy/30 to-transparent animate-energy-flow" />
      </div>

      {/* Energy Crystals */}
      <div className="flex gap-2 justify-center">
        {energyCrystals.map((filled, index) => (
          <div
            key={index}
            className={cn(
              "energy-crystal w-8 h-8 transition-all duration-300",
              filled
                ? "bg-gradient-to-br from-anime-energy to-blue-400 animate-pulse-glow"
                : "bg-gradient-to-br from-slate-600 to-slate-800 opacity-50",
            )}
          />
        ))}
      </div>

      {/* Regen Rate */}
      <div className="text-center mt-3">
        <span className="text-xs text-white/70">
          +{regenRate}/sec regeneration
        </span>
      </div>

      {/* Floating Energy Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-anime-energy rounded-full opacity-60 animate-character-hover"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
