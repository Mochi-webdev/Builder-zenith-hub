import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trophyManager, TrophyData, TROPHY_TIERS } from "@/lib/trophySystem";
import { Trophy, TrendingUp, Award, Target, Clock, Zap } from "lucide-react";

interface TrophyDisplayProps {
  className?: string;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TrophyDisplay({
  className = "",
  showProgress = true,
  size = "md",
}: TrophyDisplayProps) {
  const [trophyData, setTrophyData] = useState<TrophyData>(
    trophyManager.getTrophyData(),
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update trophy data periodically
    const interval = setInterval(() => {
      setTrophyData(trophyManager.getTrophyData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentTier = trophyManager.getCurrentTier();
  const nextTier = trophyManager.getNextTier();
  const progressToNext = trophyManager.getProgressToNextTier();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card
            className={`glass-effect p-3 cursor-pointer hover:bg-white/10 transition-colors ${className}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400 anime-glow" />
                <span className={`font-bold text-white ${sizeClasses[size]}`}>
                  {trophyData.trophies}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${currentTier.color} font-semibold`}>
                  {currentTier.icon}
                </span>
                <Badge
                  variant="outline"
                  className={`${currentTier.color} border-current`}
                >
                  {currentTier.name}
                </Badge>
              </div>

              {showProgress && nextTier && (
                <div className="flex-1 max-w-24">
                  <Progress
                    value={progressToNext}
                    className="h-2"
                    indicatorClassName="bg-gradient-to-r from-yellow-400 to-orange-400"
                  />
                </div>
              )}
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-md glass-effect border-purple-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <Trophy className="w-6 h-6 text-yellow-400 anime-glow" />
              Trophy Progress
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Status */}
            <div className="text-center">
              <div className="text-4xl mb-2">{currentTier.icon}</div>
              <h3 className={`text-2xl font-bold ${currentTier.color} mb-1`}>
                {currentTier.name}
              </h3>
              <div className="text-3xl font-bold text-yellow-400 anime-glow mb-2">
                {trophyData.trophies} 🏆
              </div>

              {nextTier && (
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">
                    Progress to {nextTier.name}
                  </p>
                  <Progress
                    value={progressToNext}
                    className="h-3"
                    indicatorClassName="bg-gradient-to-r from-yellow-400 to-orange-400"
                  />
                  <p className="text-xs text-white/50">
                    {Math.ceil(nextTier.minTrophies - trophyData.trophies)}{" "}
                    trophies to go
                  </p>
                </div>
              )}

              {!nextTier && (
                <div className="space-y-2">
                  <p className="text-pink-400 font-bold">MAX TIER REACHED!</p>
                  <p className="text-xs text-white/70">
                    You are a true anime champion!
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-400">
                  {trophyData.wins}
                </div>
                <div className="text-xs text-white/70">Victories</div>
              </div>

              <div className="text-center">
                <Target className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-red-400">
                  {trophyData.losses}
                </div>
                <div className="text-xs text-white/70">Defeats</div>
              </div>

              <div className="text-center">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-purple-400">
                  {trophyData.winStreak}
                </div>
                <div className="text-xs text-white/70">Win Streak</div>
              </div>

              <div className="text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-yellow-400">
                  {trophyData.bestWinStreak}
                </div>
                <div className="text-xs text-white/70">Best Streak</div>
              </div>

              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-400">
                  {formatTime(trophyData.averageGameTime)}
                </div>
                <div className="text-xs text-white/70">Avg. Game</div>
              </div>

              <div className="text-center">
                <Trophy className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-cyan-400">
                  {trophyData.totalGamesPlayed}
                </div>
                <div className="text-xs text-white/70">Total Games</div>
              </div>
            </div>

            {/* Trophy Tiers */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-center">
                Trophy Tiers
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {TROPHY_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`flex items-center justify-between p-2 rounded ${
                      tier.name === currentTier.name
                        ? "bg-white/20 border border-white/30"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tier.icon}</span>
                      <span className={`font-medium ${tier.color}`}>
                        {tier.name}
                      </span>
                    </div>
                    <span className="text-sm text-white/70">
                      {tier.minTrophies}+
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Win Rate */}
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Win Rate</p>
              <div className="text-2xl font-bold text-green-400">
                {trophyData.totalGamesPlayed > 0
                  ? Math.round(
                      (trophyData.wins / trophyData.totalGamesPlayed) * 100,
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
