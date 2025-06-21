import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trophyManager, Area } from "@/lib/trophySystem";
import {
  Trophy,
  Star,
  Crown,
  Zap,
  MapPin,
  Gift,
  Lock,
  ChevronRight,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardsPathProps {
  className?: string;
}

interface AreaReward {
  type: "coins" | "gems" | "chest" | "character";
  amount: number;
  name: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

interface AreaDetails extends Area {
  rewards: AreaReward[];
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert" | "Master";
  enemies: string[];
}

export default function RewardsPath({ className }: RewardsPathProps) {
  const [currentTrophies, setCurrentTrophies] = useState(0);
  const [selectedArea, setSelectedArea] = useState<AreaDetails | null>(null);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);

  const areaDetails: AreaDetails[] = [
    {
      id: 1,
      name: "Training Grounds",
      emoji: "🏃",
      trophyRequirement: 0,
      maxTrophies: 100,
      rewards: [
        { type: "coins", amount: 50, name: "Starting Coins" },
        { type: "chest", amount: 1, name: "Welcome Chest", rarity: "common" },
      ],
      description:
        "Begin your journey as an anime warrior. Learn the basics of combat and strategy.",
      difficulty: "Easy",
      enemies: ["Training Dummy", "Rookie Sparring Partner"],
    },
    {
      id: 2,
      name: "Forest Valley",
      emoji: "🌲",
      trophyRequirement: 100,
      maxTrophies: 250,
      rewards: [
        { type: "coins", amount: 100, name: "Forest Treasure" },
        { type: "chest", amount: 1, name: "Nature Chest", rarity: "common" },
        {
          type: "character",
          amount: 1,
          name: "Forest Guardian",
          rarity: "rare",
        },
      ],
      description:
        "Navigate through mystical forests filled with nature spirits and elemental challenges.",
      difficulty: "Easy",
      enemies: ["Forest Spirit", "Wild Beast", "Nature Guardian"],
    },
    {
      id: 3,
      name: "Crystal Caves",
      emoji: "💎",
      trophyRequirement: 250,
      maxTrophies: 500,
      rewards: [
        { type: "gems", amount: 10, name: "Crystal Gems" },
        { type: "chest", amount: 2, name: "Crystal Chest", rarity: "rare" },
        { type: "coins", amount: 200, name: "Miner's Fortune" },
      ],
      description:
        "Explore luminous crystal caverns where ancient magic resonates through the walls.",
      difficulty: "Medium",
      enemies: ["Crystal Golem", "Cave Dweller", "Gem Guardian"],
    },
    {
      id: 4,
      name: "Volcanic Peak",
      emoji: "🌋",
      trophyRequirement: 500,
      maxTrophies: 850,
      rewards: [
        { type: "chest", amount: 1, name: "Lava Chest", rarity: "epic" },
        { type: "coins", amount: 300, name: "Volcanic Treasure" },
        { type: "character", amount: 1, name: "Fire Lord", rarity: "epic" },
      ],
      description:
        "Ascend the fiery volcanic peaks where fire elementals rule supreme.",
      difficulty: "Medium",
      enemies: ["Fire Elemental", "Lava Beast", "Flame Dragon"],
    },
    {
      id: 5,
      name: "Sky Temple",
      emoji: "☁️",
      trophyRequirement: 850,
      maxTrophies: 1300,
      rewards: [
        { type: "gems", amount: 25, name: "Heaven's Blessing" },
        { type: "chest", amount: 2, name: "Divine Chest", rarity: "epic" },
        { type: "character", amount: 1, name: "Angel Warrior", rarity: "epic" },
      ],
      description:
        "Reach the celestial sky temple where ancient wisdom and divine power await.",
      difficulty: "Hard",
      enemies: ["Sky Guardian", "Cloud Spirit", "Divine Sentinel"],
    },
    {
      id: 6,
      name: "Shadow Realm",
      emoji: "🌑",
      trophyRequirement: 1300,
      maxTrophies: 1900,
      rewards: [
        { type: "chest", amount: 1, name: "Shadow Chest", rarity: "legendary" },
        { type: "gems", amount: 50, name: "Dark Energy" },
        {
          type: "character",
          amount: 1,
          name: "Shadow Master",
          rarity: "legendary",
        },
      ],
      description:
        "Enter the mysterious shadow realm where darkness holds ancient secrets.",
      difficulty: "Hard",
      enemies: ["Shadow Assassin", "Dark Wraith", "Void Lord"],
    },
    {
      id: 7,
      name: "Electric Storm",
      emoji: "⚡",
      trophyRequirement: 1900,
      maxTrophies: 2600,
      rewards: [
        { type: "coins", amount: 500, name: "Storm Coins" },
        { type: "chest", amount: 3, name: "Thunder Chest", rarity: "epic" },
        {
          type: "character",
          amount: 1,
          name: "Lightning God",
          rarity: "legendary",
        },
      ],
      description:
        "Weather the electric storm where lightning strikes with devastating power.",
      difficulty: "Expert",
      enemies: ["Thunder Spirit", "Electric Dragon", "Storm Titan"],
    },
    {
      id: 8,
      name: "Ocean Depths",
      emoji: "🌊",
      trophyRequirement: 2600,
      maxTrophies: 3400,
      rewards: [
        { type: "gems", amount: 75, name: "Ocean Pearls" },
        {
          type: "chest",
          amount: 2,
          name: "Abyssal Chest",
          rarity: "legendary",
        },
        {
          type: "character",
          amount: 1,
          name: "Sea Emperor",
          rarity: "legendary",
        },
      ],
      description:
        "Dive into the deepest ocean trenches where ancient sea creatures dwell.",
      difficulty: "Expert",
      enemies: ["Sea Monster", "Kraken", "Leviathan"],
    },
    {
      id: 9,
      name: "Time Spiral",
      emoji: "🌀",
      trophyRequirement: 3400,
      maxTrophies: 4300,
      rewards: [
        {
          type: "chest",
          amount: 5,
          name: "Temporal Chest",
          rarity: "legendary",
        },
        { type: "gems", amount: 100, name: "Time Crystals" },
        { type: "character", amount: 1, name: "Chronos", rarity: "legendary" },
      ],
      description:
        "Navigate through twisted time where past, present, and future collide.",
      difficulty: "Expert",
      enemies: ["Time Guardian", "Temporal Anomaly", "Chronos Dragon"],
    },
    {
      id: 10,
      name: "Celestial Palace",
      emoji: "🏰",
      trophyRequirement: 4300,
      maxTrophies: 5300,
      rewards: [
        { type: "gems", amount: 150, name: "Celestial Gems" },
        { type: "chest", amount: 3, name: "Royal Chest", rarity: "legendary" },
        {
          type: "character",
          amount: 2,
          name: "Palace Guards",
          rarity: "legendary",
        },
      ],
      description:
        "Enter the magnificent celestial palace where cosmic powers reign supreme.",
      difficulty: "Master",
      enemies: ["Palace Guardian", "Cosmic Knight", "Star Lord"],
    },
    {
      id: 11,
      name: "Dragon's Lair",
      emoji: "🐉",
      trophyRequirement: 5300,
      maxTrophies: 6500,
      rewards: [
        { type: "chest", amount: 1, name: "Dragon Hoard", rarity: "legendary" },
        { type: "coins", amount: 1000, name: "Dragon's Gold" },
        {
          type: "character",
          amount: 1,
          name: "Ancient Dragon",
          rarity: "legendary",
        },
      ],
      description:
        "Face the legendary dragon in its ancient lair filled with treasures.",
      difficulty: "Master",
      enemies: ["Dragon Whelp", "Elder Dragon", "Ancient Wyrm"],
    },
    {
      id: 12,
      name: "Cosmic Void",
      emoji: "🕳️",
      trophyRequirement: 6500,
      maxTrophies: 8000,
      rewards: [
        { type: "gems", amount: 200, name: "Void Crystals" },
        { type: "chest", amount: 5, name: "Cosmic Chest", rarity: "legendary" },
        {
          type: "character",
          amount: 1,
          name: "Void Walker",
          rarity: "legendary",
        },
      ],
      description:
        "Enter the cosmic void where reality bends and space-time warps.",
      difficulty: "Master",
      enemies: ["Void Entity", "Cosmic Horror", "Reality Bender"],
    },
    {
      id: 13,
      name: "Infinity Nexus",
      emoji: "♾️",
      trophyRequirement: 8000,
      maxTrophies: 10000,
      rewards: [
        {
          type: "chest",
          amount: 10,
          name: "Infinity Chest",
          rarity: "legendary",
        },
        { type: "gems", amount: 500, name: "Infinity Stones" },
        {
          type: "character",
          amount: 1,
          name: "Infinity Lord",
          rarity: "legendary",
        },
      ],
      description:
        "Reach the ultimate nexus where infinite power and eternal glory await.",
      difficulty: "Master",
      enemies: ["Infinity Guardian", "Eternal Being", "Omnipotent Entity"],
    },
  ];

  useEffect(() => {
    const updateTrophies = () => {
      const trophyData = trophyManager.getTrophyData();
      setCurrentTrophies(trophyData.trophies);
      setCurrentArea(trophyData.currentArea);
    };

    updateTrophies();
    const interval = setInterval(updateTrophies, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAreaUnlocked = (area: AreaDetails) => {
    return currentTrophies >= area.trophyRequirement;
  };

  const isCurrentArea = (area: AreaDetails) => {
    return currentArea?.id === area.id;
  };

  const getProgressInArea = (area: AreaDetails) => {
    if (currentTrophies < area.trophyRequirement) return 0;
    if (currentTrophies >= area.maxTrophies) return 100;

    const progressInArea = currentTrophies - area.trophyRequirement;
    const totalAreaTrophies = area.maxTrophies - area.trophyRequirement;
    return (progressInArea / totalAreaTrophies) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-500/20";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "Hard":
        return "text-orange-400 bg-orange-500/20";
      case "Expert":
        return "text-red-400 bg-red-500/20";
      case "Master":
        return "text-purple-400 bg-purple-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-400";
      case "rare":
        return "text-blue-400";
      case "epic":
        return "text-purple-400";
      case "legendary":
        return "text-yellow-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Current Progress Card */}
      <Card className="floating-panel-large p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-cyan-600/10 animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-character-hover">
                {currentArea?.emoji || "🏃"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white text-anime-glow">
                  {currentArea?.name || "Training Grounds"}
                </h2>
                <p className="text-white/70">Your current area</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-xl font-bold text-white">
                  {currentTrophies.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-white/60">Total Trophies</div>
            </div>
          </div>

          {currentArea && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>Area Progress</span>
                <span>
                  {Math.min(currentTrophies, currentArea.maxTrophies)} /{" "}
                  {currentArea.maxTrophies}
                </span>
              </div>
              <Progress
                value={getProgressInArea(currentArea)}
                className="h-3 bg-slate-800/50"
                indicatorClassName="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Rewards Path */}
      <Card className="floating-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-blue-400 animate-pulse-glow" />
          <h3 className="text-xl font-bold text-white">Rewards Path</h3>
          <Badge className="bg-blue-500/20 text-blue-400">
            {areaDetails.filter((area) => isAreaUnlocked(area)).length} /{" "}
            {areaDetails.length} Unlocked
          </Badge>
        </div>

        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {areaDetails.map((area, index) => (
            <div key={area.id} className="relative">
              {/* Connection Line */}
              {index < areaDetails.length - 1 && (
                <div className="absolute left-8 top-16 w-px h-8 bg-gradient-to-b from-purple-400/50 to-transparent" />
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Card
                    className={cn(
                      "floating-panel p-4 cursor-pointer transition-all duration-300 hover-lift",
                      isCurrentArea(area) &&
                        "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900",
                      !isAreaUnlocked(area) && "opacity-50 grayscale",
                    )}
                    onClick={() => setSelectedArea(area)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300",
                            isAreaUnlocked(area)
                              ? "bg-gradient-to-br from-blue-500 to-purple-500"
                              : "bg-gray-600",
                          )}
                        >
                          {isAreaUnlocked(area) ? (
                            area.emoji
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        {isCurrentArea(area) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-white">
                            {area.name}
                          </h4>
                          <Badge
                            className={getDifficultyColor(area.difficulty)}
                          >
                            {area.difficulty}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-white/70">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>{area.trophyRequirement}+ trophies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            <span>{area.rewards.length} rewards</span>
                          </div>
                        </div>

                        {isAreaUnlocked(area) && (
                          <div className="mt-2">
                            <Progress
                              value={getProgressInArea(area)}
                              className="h-1 bg-slate-800/50"
                              indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-5 h-5 text-white/60" />
                    </div>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-2xl bg-slate-900/95 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">{area.emoji}</span>
                      {area.name}
                      <Badge className={getDifficultyColor(area.difficulty)}>
                        {area.difficulty}
                      </Badge>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 mt-6">
                    <p className="text-white/80 leading-relaxed">
                      {area.description}
                    </p>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white">
                        Requirements
                      </h4>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80">
                          {area.trophyRequirement} trophies required
                        </span>
                        {isAreaUnlocked(area) && (
                          <Badge className="bg-green-500/20 text-green-400 ml-2">
                            ✓ Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-white">Rewards</h4>
                      <div className="grid gap-2">
                        {area.rewards.map((reward, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {reward.type === "coins" && "🪙"}
                                {reward.type === "gems" && "💎"}
                                {reward.type === "chest" && "🎁"}
                                {reward.type === "character" && "👤"}
                              </div>
                              <div>
                                <div
                                  className={cn(
                                    "font-medium",
                                    getRarityColor(reward.rarity),
                                  )}
                                >
                                  {reward.name}
                                </div>
                                <div className="text-sm text-white/60">
                                  {reward.type === "character"
                                    ? "New Character"
                                    : `${reward.amount} ${reward.type}`}
                                </div>
                              </div>
                            </div>
                            {reward.rarity && (
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getRarityColor(reward.rarity),
                                )}
                              >
                                {reward.rarity}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enemies */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-white">Enemies</h4>
                      <div className="flex flex-wrap gap-2">
                        {area.enemies.map((enemy, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-red-500/20 border-red-400/30 text-red-400"
                          >
                            <Target className="w-3 h-3 mr-1" />
                            {enemy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
