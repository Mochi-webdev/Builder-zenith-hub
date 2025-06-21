import { Character, calculateBattlePower } from "@/lib/characters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Sword,
  Shield,
  Zap,
  Heart,
  Target,
  Sparkles,
  Flame,
  Droplets,
  Sun,
  Moon,
} from "lucide-react";

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  canAfford?: boolean;
  onClick?: () => void;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const getElementIcon = (element: Character["element"]) => {
  switch (element) {
    case "fire":
      return <Flame className="w-4 h-4" />;
    case "water":
      return <Droplets className="w-4 h-4" />;
    case "electric":
      return <Zap className="w-4 h-4" />;
    case "light":
      return <Sun className="w-4 h-4" />;
    case "shadow":
      return <Moon className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const getRarityColor = (rarity: Character["rarity"]) => {
  switch (rarity) {
    case "common":
      return "bg-gray-500";
    case "rare":
      return "bg-blue-500";
    case "epic":
      return "bg-purple-500";
    case "legendary":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getElementColor = (element: Character["element"]) => {
  switch (element) {
    case "fire":
      return "text-orange-400 bg-orange-500/20";
    case "water":
      return "text-blue-400 bg-blue-500/20";
    case "electric":
      return "text-purple-400 bg-purple-500/20";
    case "light":
      return "text-yellow-400 bg-yellow-500/20";
    case "shadow":
      return "text-gray-400 bg-gray-500/20";
    default:
      return "text-gray-400 bg-gray-500/20";
  }
};

export default function CharacterCard({
  character,
  isSelected = false,
  canAfford = true,
  onClick,
  showStats = true,
  size = "md",
  className,
}: CharacterCardProps) {
  const battlePower = calculateBattlePower(character);

  const sizeClasses = {
    sm: "w-24 h-32",
    md: "w-32 h-44",
    lg: "w-40 h-56",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <Card
      className={cn(
        "character-portrait relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 group",
        sizeClasses[size],
        isSelected &&
          "ring-2 ring-purple-400 ring-offset-2 ring-offset-background",
        !canAfford && "opacity-50 grayscale",
        character.gradient,
        className,
      )}
      onClick={onClick}
    >
      {/* Background Gradient */}
      <div className={cn("absolute inset-0", character.color)} />

      {/* Content */}
      <div className="relative z-10 p-2 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <Badge
            className={cn(
              "text-xs px-1 py-0",
              getRarityColor(character.rarity),
            )}
          >
            {character.rarity.toUpperCase()}
          </Badge>
          <div
            className={cn(
              "flex items-center gap-1 px-1 py-0.5 rounded",
              getElementColor(character.element),
            )}
          >
            {getElementIcon(character.element)}
          </div>
        </div>

        {/* Character Portrait Area */}
        <div className="flex-1 flex items-center justify-center mb-2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl font-bold text-white anime-glow">
              {character.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        </div>

        {/* Character Info */}
        <div className="space-y-1">
          <h3
            className={cn(
              "font-bold text-white text-center leading-tight",
              textSizes[size],
            )}
          >
            {character.name}
          </h3>
          <p
            className={cn(
              "text-white/80 text-center",
              size === "sm" ? "text-xs" : "text-xs",
            )}
          >
            {character.anime}
          </p>
        </div>

        {/* Energy Cost */}
        <div className="absolute top-2 right-2 bg-anime-energy text-anime-energy-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {character.cost}
        </div>

        {/* Stats (if enabled) */}
        {showStats && size !== "sm" && (
          <div className="mt-2 space-y-1">
            <div className="grid grid-cols-2 gap-1 text-xs text-white/90">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{character.health}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sword className="w-3 h-3" />
                <span>{character.damage}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{character.speed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>{character.range}</span>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                {battlePower} BP
              </Badge>
            </div>
          </div>
        )}

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Special Ability Tooltip */}
        {size === "lg" && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-xs text-white text-center">
              {character.specialAbility}
            </p>
            <p className="text-xs text-white/70 text-center mt-1">
              {character.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
