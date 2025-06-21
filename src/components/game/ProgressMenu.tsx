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
import { currencyManager, TrophyMilestone } from "@/lib/currencySystem";
import { trophyManager } from "@/lib/trophySystem";
import {
  Trophy,
  Target,
  Coins,
  Gem,
  Gift,
  Star,
  Crown,
  Award,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressMenuProps {
  className?: string;
}

export default function ProgressMenu({ className }: ProgressMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [milestones, setMilestones] = useState<TrophyMilestone[]>([]);
  const [currentTrophies, setCurrentTrophies] = useState(0);
  const [currency, setCurrency] = useState(currencyManager.getCurrencyData());
  const [claimedRewards, setClaimedRewards] = useState<TrophyMilestone[]>([]);

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    const trophyData = trophyManager.getTrophyData();
    setCurrentTrophies(trophyData.trophies);
    setMilestones(currencyManager.getMilestones());
    setCurrency(currencyManager.getCurrencyData());

    // Check for new milestone rewards
    const newlyClaimedMilestones = currencyManager.checkAndClaimMilestones(
      trophyData.trophies,
    );
    if (newlyClaimedMilestones.length > 0) {
      setClaimedRewards(newlyClaimedMilestones);
    }
  };

  const nextMilestone = currencyManager.getNextMilestone(currentTrophies);
  const progress = currencyManager.getProgressToNextMilestone(currentTrophies);

  const getRewardIcon = (rewards: TrophyMilestone["rewards"]) => {
    if (rewards.chests && rewards.chests.length > 0) {
      return <Gift className="w-4 h-4" />;
    }
    if (rewards.gems > 0) {
      return <Gem className="w-4 h-4" />;
    }
    return <Coins className="w-4 h-4" />;
  };

  const getMilestoneIcon = (trophies: number) => {
    if (trophies >= 10000) return "🚀";
    if (trophies >= 5000) return "👑";
    if (trophies >= 2500) return "⭐";
    if (trophies >= 1000) return "💎";
    if (trophies >= 500) return "🥇";
    if (trophies >= 100) return "🥈";
    return "🥉";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="glass-effect relative">
            <Target className="w-4 h-4 mr-2" />
            Progress
            {nextMilestone && (
              <Badge className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 text-xs">
                {nextMilestone.trophies - currentTrophies}
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl glass-effect border-purple-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <Trophy className="w-6 h-6 text-yellow-400 anime-glow" />
              Trophy Progress & Rewards
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Status */}
            <Card className="glass-effect p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Current Trophies
                    </h3>
                    <p className="text-2xl font-bold text-yellow-400">
                      {currentTrophies}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-white">
                      {currency.coins}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="font-bold text-white">
                      {currency.gems}
                    </span>
                  </div>
                </div>
              </div>

              {nextMilestone && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">
                      Progress to {nextMilestone.name}
                    </span>
                    <span className="text-white/70">
                      {currentTrophies} / {nextMilestone.trophies}
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-3"
                    indicatorClassName="bg-gradient-to-r from-yellow-400 to-orange-400"
                  />
                  <p className="text-xs text-white/50 text-center">
                    {nextMilestone.trophies - currentTrophies} trophies to go
                  </p>
                </div>
              )}

              {!nextMilestone && (
                <div className="text-center py-2">
                  <Badge className="bg-purple-500/20 text-purple-400">
                    🏆 ALL MILESTONES COMPLETED! 🏆
                  </Badge>
                </div>
              )}
            </Card>

            {/* Milestones */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Trophy Milestones
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {milestones.map((milestone, index) => {
                  const isCompleted = currentTrophies >= milestone.trophies;
                  const isClaimed = milestone.claimed;
                  const isNext = !isClaimed && isCompleted;

                  return (
                    <Card
                      key={index}
                      className={cn(
                        "p-4 transition-all duration-300",
                        isClaimed
                          ? "glass-effect opacity-60"
                          : isCompleted
                            ? "glass-effect border-yellow-400 animate-pulse-glow"
                            : "glass-effect opacity-40",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {getMilestoneIcon(milestone.trophies)}
                          </div>
                          <div>
                            <h4
                              className={cn(
                                "font-semibold",
                                isClaimed ? "text-white/60" : "text-white",
                              )}
                            >
                              {milestone.name}
                            </h4>
                            <p className="text-sm text-white/70">
                              {milestone.trophies} trophies
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Rewards */}
                          <div className="flex items-center gap-2 text-sm">
                            {milestone.rewards.coins > 0 && (
                              <div className="flex items-center gap-1">
                                <Coins className="w-4 h-4 text-yellow-400" />
                                <span className="text-white/70">
                                  {milestone.rewards.coins}
                                </span>
                              </div>
                            )}
                            {milestone.rewards.gems > 0 && (
                              <div className="flex items-center gap-1">
                                <Gem className="w-4 h-4 text-purple-400" />
                                <span className="text-white/70">
                                  {milestone.rewards.gems}
                                </span>
                              </div>
                            )}
                            {milestone.rewards.chests &&
                              milestone.rewards.chests.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Gift className="w-4 h-4 text-blue-400" />
                                  <span className="text-white/70">
                                    {milestone.rewards.chests.length}
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Status */}
                          <div>
                            {isClaimed && (
                              <Badge className="bg-green-500/20 text-green-400">
                                ✓ Claimed
                              </Badge>
                            )}
                            {isNext && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 animate-pulse">
                                🎁 Ready!
                              </Badge>
                            )}
                            {!isCompleted && (
                              <Badge
                                variant="outline"
                                className="text-gray-400"
                              >
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <Card className="glass-effect p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Lifetime Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {currency.totalCoinsEarned.toLocaleString()}
                  </div>
                  <div className="text-white/70">Total Coins Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {currency.totalGemsEarned.toLocaleString()}
                  </div>
                  <div className="text-white/70">Total Gems Earned</div>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Milestone Rewards Popup */}
      {claimedRewards.length > 0 && (
        <Dialog open={true} onOpenChange={() => setClaimedRewards([])}>
          <DialogContent className="glass-effect border-yellow-500/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white">
                <Crown className="w-6 h-6 text-yellow-400 anime-glow" />
                Milestone Achieved!
              </DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>

              {claimedRewards.map((milestone, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-bold text-yellow-400">
                    {milestone.name}
                  </h3>

                  <div className="flex items-center justify-center gap-4">
                    {milestone.rewards.coins > 0 && (
                      <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-400" />
                        <span className="text-lg font-bold text-white">
                          +{milestone.rewards.coins}
                        </span>
                      </div>
                    )}
                    {milestone.rewards.gems > 0 && (
                      <div className="flex items-center gap-2">
                        <Gem className="w-6 h-6 text-purple-400" />
                        <span className="text-lg font-bold text-white">
                          +{milestone.rewards.gems}
                        </span>
                      </div>
                    )}
                    {milestone.rewards.chests &&
                      milestone.rewards.chests.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Gift className="w-6 h-6 text-blue-400" />
                          <span className="text-lg font-bold text-white">
                            {milestone.rewards.chests.length} Chest
                            {milestone.rewards.chests.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              ))}

              <Button
                onClick={() => setClaimedRewards([])}
                className="anime-button w-full"
              >
                Awesome! 🎯
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
