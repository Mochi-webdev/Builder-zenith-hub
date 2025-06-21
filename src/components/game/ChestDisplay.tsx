import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chestManager, Chest, ChestReward } from "@/lib/chestSystem";
import { Clock, Gift, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChestDisplayProps {
  className?: string;
}

export default function ChestDisplay({ className }: ChestDisplayProps) {
  const [chests, setChests] = useState<Chest[]>([]);
  const [selectedChest, setSelectedChest] = useState<Chest | null>(null);
  const [rewards, setRewards] = useState<ChestReward[] | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    updateChests();
    const interval = setInterval(updateChests, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateChests = () => {
    setChests(chestManager.getChests());
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const handleOpenChest = async (chest: Chest) => {
    if (!chestManager.canOpenChest(chest.id)) return;

    setIsOpening(true);
    setSelectedChest(chest);

    // Simulate opening animation
    setTimeout(() => {
      const chestRewards = chestManager.openChest(chest.id);
      setRewards(chestRewards);
      setIsOpening(false);
      updateChests();
    }, 1000);
  };

  const handleSpeedUp = (chest: Chest) => {
    chestManager.speedUpChest(chest.id);
    updateChests();
  };

  const closeRewardsDialog = () => {
    setSelectedChest(null);
    setRewards(null);
  };

  const canEarnMore = chestManager.canEarnChest();

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="glass-effect p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Chests</h3>
          </div>
          <Badge
            variant={canEarnMore ? "outline" : "secondary"}
            className={
              canEarnMore
                ? "text-green-400 border-green-400"
                : "text-red-400 border-red-400"
            }
          >
            {chests.length}/4
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => {
            const chest = chests[index];

            if (!chest) {
              return (
                <div
                  key={index}
                  className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center text-gray-500">
                    <Gift className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Empty Slot</p>
                  </div>
                </div>
              );
            }

            const timeLeft = chestManager.getTimeUntilChestReady(chest.id);
            const canOpen = timeLeft <= 0;
            const progress = Math.max(
              0,
              100 - (timeLeft / (chest.type.openTime * 1000)) * 100,
            );

            return (
              <Card
                key={chest.id}
                className={cn(
                  "aspect-square p-3 cursor-pointer transition-all duration-300 hover:scale-105",
                  canOpen
                    ? "glass-effect border-green-400 animate-pulse-glow"
                    : "glass-effect border-gray-600",
                )}
                onClick={() => canOpen && handleOpenChest(chest)}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{chest.type.icon}</div>
                    <p className={`text-xs font-semibold ${chest.type.color}`}>
                      {chest.type.name}
                    </p>
                  </div>

                  {!canOpen && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-1" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">
                          {formatTime(timeLeft)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeedUp(chest);
                          }}
                        >
                          <Zap className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {canOpen && (
                    <div className="text-center">
                      <p className="text-xs text-green-400 font-bold">
                        TAP TO OPEN!
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {!canEarnMore && (
          <p className="text-xs text-white/70 text-center mt-3">
            Chest slots full! Open chests to earn more.
          </p>
        )}
      </Card>

      {/* Opening Animation Dialog */}
      <Dialog open={isOpening} onOpenChange={() => {}}>
        <DialogContent className="glass-effect border-purple-500/50">
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-spin">
              {selectedChest?.type.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Opening {selectedChest?.type.name}...
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto animate-pulse" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Rewards Dialog */}
      <Dialog open={!!rewards} onOpenChange={closeRewardsDialog}>
        <DialogContent className="glass-effect border-purple-500/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <Star className="w-6 h-6 text-yellow-400 anime-glow" />
              Chest Rewards!
            </DialogTitle>
          </DialogHeader>

          {rewards && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-white mb-4">
                  You got {rewards.length} cards!
                </h3>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {rewards.map((reward, index) => (
                  <Card key={index} className="glass-effect p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {reward.character.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {reward.character.name}
                        </h4>
                        <p className="text-sm text-white/70">
                          +{reward.cardsEarned} card
                          {reward.cardsEarned > 1 ? "s" : ""}
                        </p>
                        {reward.newLevel && (
                          <Badge className="bg-green-500/20 text-green-400">
                            Level {reward.newLevel}!
                          </Badge>
                        )}
                      </div>
                      <Badge
                        className={
                          reward.character.rarity === "legendary"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : reward.character.rarity === "epic"
                              ? "bg-purple-500/20 text-purple-400"
                              : reward.character.rarity === "rare"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                        }
                      >
                        {reward.character.rarity}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                onClick={closeRewardsDialog}
                className="anime-button w-full"
              >
                Awesome!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
