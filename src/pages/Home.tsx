import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Tutorial from "@/components/game/Tutorial";
import TrophyDisplay from "@/components/game/TrophyDisplay";
import ChestDisplay from "@/components/game/ChestDisplay";
import CurrencyDisplay from "@/components/game/CurrencyDisplay";
import Shop from "@/components/game/Shop";
import RewardsPath from "@/components/game/RewardsPath";
import BackgroundMusic from "@/components/BackgroundMusic";
import { useCharacterSelection } from "@/hooks/useCharacterSelection";
import { trophyManager } from "@/lib/trophySystem";
import {
  Swords,
  Star,
  Users,
  Trophy,
  Settings,
  Crown,
  Target,
  Zap,
  Gift,
  ShoppingCart,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [currentTrophies, setCurrentTrophies] = useState(0);
  const [showRewardsPath, setShowRewardsPath] = useState(false);

  const { selectedDeck, isDeckComplete } = useCharacterSelection({
    maxDeckSize: 4,
  });

  useEffect(() => {
    const updateTrophies = () => {
      const trophyData = trophyManager.getTrophyData();
      setCurrentTrophies(trophyData.trophies);
    };

    updateTrophies();
    const interval = setInterval(updateTrophies, 2000);
    return () => clearInterval(interval);
  }, []);

  const startGame = () => {
    if (isDeckComplete) {
      navigate("/game", { state: { deck: selectedDeck } });
    } else {
      // Use default starter deck if no deck is complete
      navigate("/game", {
        state: { deck: ["rookie-fighter", "archer-trainee", "magic-student"] },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundMusic />

      {/* Floating Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full animate-character-hover"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Top Header */}
        <div className="absolute top-6 left-6 right-6 z-20">
          <div className="flex items-center justify-between">
            {/* Left - Currency & Profile */}
            <div className="flex items-center gap-4">
              <CurrencyDisplay size="md" />
              <TrophyDisplay size="md" showProgress={false} />
            </div>

            {/* Center - Game Title */}
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400 anime-glow" />
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text">
                ANIME CLASH
              </h1>
              <Crown className="w-8 h-8 text-yellow-400 anime-glow scale-x-[-1]" />
            </div>

            {/* Right - Settings & Tutorial */}
            <div className="flex items-center gap-3">
              <Tutorial />
              <Button
                variant="outline"
                size="sm"
                className="floating-panel hover-lift"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto px-6 pt-24 pb-8">
          <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
            {/* Left Sidebar - Shop & Daily Rewards */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="floating-panel p-4">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart className="w-6 h-6 text-purple-400 animate-pulse-glow" />
                  <h3 className="text-lg font-bold text-white">
                    Shop & Rewards
                  </h3>
                </div>
                <Shop />
              </Card>

              {/* Quick Stats */}
              <Card className="floating-panel p-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Battle Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Deck Status:</span>
                    <Badge
                      className={
                        isDeckComplete
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    >
                      {isDeckComplete ? "Ready" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Characters:</span>
                    <span className="text-white">{selectedDeck.length}/4</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Battles Today:</span>
                    <span className="text-white">0</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Center - Main Area & Actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Current Area Display with Rewards Path Toggle */}
              <Card
                className="floating-panel-large p-8 cursor-pointer transition-all duration-300 hover-lift relative overflow-hidden"
                onClick={() => setShowRewardsPath(!showRewardsPath)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-cyan-600/10 animate-pulse" />

                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4 animate-character-hover">
                    🏃
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 text-anime-glow">
                    Area 1: Training Grounds
                  </h2>
                  <p className="text-lg text-white/80 mb-4">
                    Begin your journey as an anime warrior
                  </p>

                  <div className="flex items-center justify-center gap-6 text-white/70 mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span>{currentTrophies} trophies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-400" />
                      <span>Next: Forest Valley (100 trophies)</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="floating-panel hover-lift"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    View Rewards Path
                  </Button>
                </div>
              </Card>

              {/* Rewards Path (Collapsible) */}
              {showRewardsPath && (
                <div className="animate-scale-in">
                  <RewardsPath />
                </div>
              )}

              {/* Quick Battle Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <Button
                  onClick={startGame}
                  disabled={!isDeckComplete}
                  className="futuristic-button-primary text-xl px-8 py-8 h-auto flex flex-col gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <Swords className="w-8 h-8" />
                      <span>Quick Battle</span>
                    </div>
                    <span className="text-sm opacity-80">
                      {isDeckComplete
                        ? "Start with current deck"
                        : "Build deck first"}
                    </span>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate("/deck-builder")}
                  variant="outline"
                  className="floating-panel hover-lift text-xl px-8 py-8 h-auto flex flex-col gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-8 h-8" />
                      <span>Deck Builder</span>
                    </div>
                    <span className="text-sm opacity-80">
                      Manage your collection
                    </span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Right Sidebar - Game Features */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="floating-panel p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Game Features
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Swords className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">
                        Strategic Combat
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Deploy characters strategically in 3D arena battles
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">
                        Elemental Powers
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Master fire, water, electric, shadow, and light elements
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">
                        Epic Battles
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Experience intense real-time battles with anime characters
                    </p>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="floating-panel p-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Logged in</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Deck created</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span>Tutorial completed</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Center - Prominent Chest Display */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <Card className="floating-panel-large p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-400/10 to-red-600/10 animate-pulse" />

            <div className="relative z-10 text-center">
              <div className="flex items-center gap-4 mb-4">
                <Gift className="w-8 h-8 text-yellow-400 animate-bounce-glow" />
                <h3 className="text-2xl font-bold text-white text-anime-glow">
                  Treasure Chests
                </h3>
                <Gift className="w-8 h-8 text-yellow-400 animate-bounce-glow scale-x-[-1]" />
              </div>

              <p className="text-white/80 mb-6">
                Open chests to discover new characters, coins, and powerful
                upgrades!
              </p>

              <div className="scale-150">
                <ChestDisplay />
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span>Tap chests to open</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span>Earn through battles</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
