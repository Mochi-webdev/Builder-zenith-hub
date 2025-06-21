import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  characters,
  Character,
  getUnlockedCharacters,
  isCharacterUnlocked,
} from "@/lib/characters";
import CharacterCard from "@/components/game/CharacterCard";
import Tutorial from "@/components/game/Tutorial";
import TrophyDisplay from "@/components/game/TrophyDisplay";
import ChestDisplay from "@/components/game/ChestDisplay";
import EnhancedCardCollection from "@/components/game/EnhancedCardCollection";
import ProgressMenu from "@/components/game/ProgressMenu";
import CurrencyDisplay from "@/components/game/CurrencyDisplay";
import BackgroundMusic from "@/components/BackgroundMusic";
import { useCharacterSelection } from "@/hooks/useCharacterSelection";
import { trophyManager } from "@/lib/trophySystem";
import { chestManager } from "@/lib/chestSystem";
import { cn } from "@/lib/utils";
import {
  Swords,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  Flame,
  Trophy,
  Lock,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"unlocked" | "locked" | "deck">(
    "unlocked",
  );
  const [currentTrophies, setCurrentTrophies] = useState(0);
  const [unlockedCharacters, setUnlockedCharacters] = useState<Character[]>([]);
  const [lockedCharacters, setLockedCharacters] = useState<Character[]>([]);

  const {
    selectedDeck,
    toggleCharacter,
    isDeckComplete,
    remainingSlots,
    deckSize,
    maxDeckSize,
    isCharacterSelected,
  } = useCharacterSelection({ maxDeckSize: 4 });

  useEffect(() => {
    updateCharacterLists();
    const interval = setInterval(updateCharacterLists, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateCharacterLists = () => {
    const trophyData = trophyManager.getTrophyData();
    const unlockedFromChests = chestManager.getUnlockedCharacterIds();

    setCurrentTrophies(trophyData.trophies);
    setUnlockedCharacters(
      getUnlockedCharacters(trophyData.trophies, unlockedFromChests),
    );
    setLockedCharacters(
      characters.filter(
        (char) =>
          !isCharacterUnlocked(char, trophyData.trophies, unlockedFromChests),
      ),
    );
  };

  const startGame = () => {
    if (isDeckComplete) {
      navigate("/game", { state: { deck: selectedDeck } });
    }
  };

  const selectedCharacters = unlockedCharacters.filter((c) =>
    selectedDeck.includes(c.id),
  );

  const getViewModeCharacters = () => {
    switch (viewMode) {
      case "unlocked":
        return unlockedCharacters;
      case "locked":
        return lockedCharacters;
      case "deck":
        return selectedCharacters;
      default:
        return unlockedCharacters;
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
          <div className="flex gap-3">
            <ProgressMenu />
            <EnhancedCardCollection
              currentDeck={selectedDeck}
              onDeckChange={(newDeck) => {
                // Update selected deck when changed from collection
                newDeck.forEach((characterId) => {
                  const character = characters.find(
                    (c) => c.id === characterId,
                  );
                  if (character && !isCharacterSelected(characterId)) {
                    toggleCharacter(character);
                  }
                });
                // Remove characters not in new deck
                selectedDeck.forEach((characterId) => {
                  if (!newDeck.includes(characterId)) {
                    const character = characters.find(
                      (c) => c.id === characterId,
                    );
                    if (character) {
                      toggleCharacter(character);
                    }
                  }
                });
              }}
            />
            <ChestDisplay />
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

        {/* Deck Status */}
        <Card className="glass-effect p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Build Your Deck</h2>
              <Badge
                variant={isDeckComplete ? "default" : "outline"}
                className={cn(
                  "px-3 py-1",
                  isDeckComplete
                    ? "bg-green-500/20 text-green-400 border-green-500"
                    : "border-purple-500/50 text-purple-400",
                )}
              >
                {deckSize}/{maxDeckSize}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "unlocked" ? "default" : "outline"}
                onClick={() => setViewMode("unlocked")}
                size="sm"
                className="glass-effect"
              >
                Unlocked ({unlockedCharacters.length})
              </Button>
              <Button
                variant={viewMode === "locked" ? "default" : "outline"}
                onClick={() => setViewMode("locked")}
                size="sm"
                className="glass-effect"
              >
                <Lock className="w-4 h-4 mr-1" />
                Locked ({lockedCharacters.length})
              </Button>
              <Button
                variant={viewMode === "deck" ? "default" : "outline"}
                onClick={() => setViewMode("deck")}
                size="sm"
                className="glass-effect"
              >
                My Deck ({deckSize})
              </Button>
            </div>
          </div>

          {/* Selected Deck Preview */}
          {deckSize > 0 && (
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
                    onClick={() => toggleCharacter(character)}
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
              disabled={!isDeckComplete}
              className="anime-button text-lg px-8 py-3 font-bold"
            >
              {isDeckComplete ? (
                <>
                  Start Battle <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>Select {remainingSlots} more characters</>
              )}
            </Button>
          </div>
        </Card>

        {/* Character Selection */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              {viewMode === "unlocked"
                ? "Choose Your Warriors"
                : viewMode === "locked"
                  ? "Locked Characters"
                  : "Your Deck"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {getViewModeCharacters().map((character) => {
              const isUnlocked = unlockedCharacters.includes(character);
              const unlockReq = character.unlockRequirement;

              return (
                <div key={character.id} className="relative">
                  <CharacterCard
                    character={character}
                    size="lg"
                    onClick={() =>
                      isUnlocked ? toggleCharacter(character) : null
                    }
                    isSelected={isCharacterSelected(character.id)}
                    showStats={true}
                    canAfford={isUnlocked}
                  />

                  {/* Lock overlay for locked characters */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm">
                      <Lock className="w-8 h-8 text-white/70 mb-2" />
                      <div className="text-center text-white/70 text-sm px-2">
                        {unlockReq?.trophies && (
                          <p>🏆 {unlockReq.trophies} trophies</p>
                        )}
                        {unlockReq?.chest && <p>📦 Find in chests</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state messages */}
          {getViewModeCharacters().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {viewMode === "locked" ? "🔒" : "📦"}
              </div>
              <p className="text-white/70 text-lg">
                {viewMode === "locked"
                  ? "All characters unlocked! Great job!"
                  : viewMode === "deck"
                    ? "Select characters for your deck"
                    : "No characters available"}
              </p>
            </div>
          )}
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
