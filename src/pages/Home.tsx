import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Tutorial from "@/components/game/Tutorial";
import TrophyDisplay from "@/components/game/TrophyDisplay";
import ChestDisplay from "@/components/game/ChestDisplay";
import ProgressMenu from "@/components/game/ProgressMenu";
import CurrencyDisplay from "@/components/game/CurrencyDisplay";
import BackgroundMusic from "@/components/BackgroundMusic";
import { useCharacterSelection } from "@/hooks/useCharacterSelection";
import { trophyManager } from "@/lib/trophySystem";
import { Swords, Star, Users, Trophy, Flame } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [currentTrophies, setCurrentTrophies] = useState(0);

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

      {/* Top UI Elements */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <TrophyDisplay size="lg" />
            <CurrencyDisplay size="md" />
          </div>
          <div className="flex gap-4">
            <ProgressMenu />
            <div className="scale-125">
              <ChestDisplay />
            </div>
          </div>
        </div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-character-hover"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Swords className="w-12 h-12 text-purple-400 anime-glow" />
            <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text animate-pulse-glow">
              ANIME CLASH
            </h1>
            <Swords className="w-12 h-12 text-purple-400 anime-glow scale-x-[-1]" />
          </div>
          <p className="text-xl text-white/80 mb-4">
            Epic battles with legendary anime warriors
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>3D Combat</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Iconic Heroes</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>Real-time Strategy</span>
              </div>
            </div>
            <Tutorial />
          </div>
        </div>

        {/* Current Area Display */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Card className="glass-effect p-8 relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-400/20 to-green-600/20 animate-pulse" />

            <div className="relative z-10">
              <div className="text-8xl mb-4 animate-character-hover">🏃</div>
              <h2 className="text-4xl font-bold text-white mb-2 text-anime-glow">
                Area 1: Training Grounds
              </h2>
              <p className="text-xl text-white/80 mb-4">
                Begin your journey as an anime warrior
              </p>
              <div className="flex items-center justify-center gap-4 text-white/70">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>0 trophies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Next: Forest Valley (100 trophies)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Button
            onClick={startGame}
            disabled={!isDeckComplete}
            className="anime-button text-xl px-8 py-6 h-auto flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <Swords className="w-6 h-6" />
              <span>Quick Battle</span>
            </div>
            <span className="text-sm opacity-80">
              {isDeckComplete ? "Start with current deck" : "Build deck first"}
            </span>
          </Button>

          <Button
            onClick={() => navigate("/deck-builder")}
            variant="outline"
            className="glass-effect text-xl px-8 py-6 h-auto flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <span>Deck Builder</span>
            </div>
            <span className="text-sm opacity-80">
              Manage your character collection
            </span>
          </Button>
        </div>

        {/* Game Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="glass-effect p-6 text-center">
            <Swords className="w-12 h-12 text-blue-400 mx-auto mb-4 anime-glow" />
            <h3 className="text-xl font-bold text-white mb-2">
              Strategic Combat
            </h3>
            <p className="text-white/70">
              Deploy characters strategically in 3D arena battles. Each warrior
              has unique abilities and playstyles.
            </p>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4 anime-glow" />
            <h3 className="text-xl font-bold text-white mb-2">
              Elemental Powers
            </h3>
            <p className="text-white/70">
              Master fire, water, electric, shadow, and light elements. Create
              powerful combinations and counter strategies.
            </p>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4 anime-glow" />
            <h3 className="text-xl font-bold text-white mb-2">Epic Battles</h3>
            <p className="text-white/70">
              Experience intense real-time battles with iconic anime characters
              in stunning 3D environments.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
