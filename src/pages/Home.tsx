import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { characters, Character } from "@/lib/characters";
import CharacterCard from "@/components/game/CharacterCard";
import { cn } from "@/lib/utils";
import {
  Swords,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  Flame,
  Trophy,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [selectedDeck, setSelectedDeck] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "deck">("all");

  const maxDeckSize = 4;

  const toggleCharacterInDeck = (character: Character) => {
    setSelectedDeck((prev) => {
      if (prev.includes(character.id)) {
        return prev.filter((id) => id !== character.id);
      } else if (prev.length < maxDeckSize) {
        return [...prev, character.id];
      }
      return prev;
    });
  };

  const startGame = () => {
    if (selectedDeck.length === maxDeckSize) {
      navigate("/game", { state: { deck: selectedDeck } });
    }
  };

  const selectedCharacters = characters.filter((c) =>
    selectedDeck.includes(c.id),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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
        </div>

        {/* Deck Status */}
        <Card className="glass-effect p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Build Your Deck</h2>
              <Badge
                variant={
                  selectedDeck.length === maxDeckSize ? "default" : "outline"
                }
                className={cn(
                  "px-3 py-1",
                  selectedDeck.length === maxDeckSize
                    ? "bg-green-500/20 text-green-400 border-green-500"
                    : "border-purple-500/50 text-purple-400",
                )}
              >
                {selectedDeck.length}/{maxDeckSize}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                onClick={() => setViewMode("all")}
                size="sm"
                className="glass-effect"
              >
                All Characters
              </Button>
              <Button
                variant={viewMode === "deck" ? "default" : "outline"}
                onClick={() => setViewMode("deck")}
                size="sm"
                className="glass-effect"
              >
                My Deck
              </Button>
            </div>
          </div>

          {/* Selected Deck Preview */}
          {selectedDeck.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Selected Characters:
              </h3>
              <div className="flex gap-3 justify-center">
                {selectedCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    size="sm"
                    onClick={() => toggleCharacterInDeck(character)}
                    isSelected={true}
                    showStats={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Start Game Button */}
          <div className="text-center">
            <Button
              onClick={startGame}
              disabled={selectedDeck.length !== maxDeckSize}
              className="anime-button text-lg px-8 py-3 font-bold"
            >
              {selectedDeck.length === maxDeckSize ? (
                <>
                  Start Battle <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>Select {maxDeckSize - selectedDeck.length} more characters</>
              )}
            </Button>
          </div>
        </Card>

        {/* Character Selection */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              {viewMode === "all" ? "Choose Your Warriors" : "Your Deck"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {(viewMode === "all" ? characters : selectedCharacters).map(
              (character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  size="lg"
                  onClick={() => toggleCharacterInDeck(character)}
                  isSelected={selectedDeck.includes(character.id)}
                  showStats={true}
                />
              ),
            )}
          </div>
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
