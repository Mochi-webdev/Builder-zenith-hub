import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chestManager, CardCollection } from "@/lib/chestSystem";
import { currencyManager, UPGRADE_COSTS } from "@/lib/currencySystem";
import { characters, Character, isCharacterUnlocked } from "@/lib/characters";
import { trophyManager } from "@/lib/trophySystem";
import CharacterCard from "./CharacterCard";
import CurrencyDisplay from "./CurrencyDisplay";
import {
  BookOpen,
  Star,
  TrendingUp,
  Edit,
  Coins,
  ArrowUp,
  Check,
  X,
  Lock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedCardCollectionProps {
  className?: string;
  onDeckChange?: (deck: string[]) => void;
  currentDeck?: string[];
}

export default function EnhancedCardCollection({
  className,
  onDeckChange,
  currentDeck = [],
}: EnhancedCardCollectionProps) {
  const [collection, setCollection] = useState<CardCollection>({});
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"collection" | "deck">("collection");
  const [editingDeck, setEditingDeck] = useState<string[]>([...currentDeck]);
  const [currentTrophies, setCurrentTrophies] = useState(0);
  const [currency, setCurrency] = useState(currencyManager.getCurrencyData());

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    setCollection(chestManager.getCollection());
    setCurrency(currencyManager.getCurrencyData());
    const trophyData = trophyManager.getTrophyData();
    setCurrentTrophies(trophyData.trophies);
  };

  const getCharacterData = (character: Character) => {
    const data = collection[character.id];
    if (!data) return null;

    const progressToNextLevel =
      data.cardsNeededForUpgrade > 0
        ? (data.cards / data.cardsNeededForUpgrade) * 100
        : 100;

    const upgradeCost = UPGRADE_COSTS[data.level + 1];
    const canUpgrade =
      data.cards >= data.cardsNeededForUpgrade &&
      data.level < 10 &&
      upgradeCost &&
      currency.coins >= upgradeCost.coins;

    return {
      ...data,
      progressToNextLevel,
      isMaxLevel: data.level >= 10,
      upgradeCost,
      canUpgrade,
    };
  };

  const unlockedFromChests = chestManager.getUnlockedCharacterIds();
  const ownedCharacters = characters.filter((char) =>
    isCharacterUnlocked(char, currentTrophies, unlockedFromChests),
  );

  const lockedCharacters = characters.filter(
    (char) => !isCharacterUnlocked(char, currentTrophies, unlockedFromChests),
  );

  const handleUpgradeCharacter = (character: Character) => {
    const data = getCharacterData(character);
    if (!data || !data.canUpgrade || !data.upgradeCost) return;

    const success = currencyManager.spendCoins(data.upgradeCost.coins);
    if (success) {
      // Simulate upgrade logic (this would normally be in chestManager)
      console.log(`Upgraded ${character.name} to level ${data.level + 1}`);
      updateData();
    }
  };

  const toggleCharacterInDeck = (character: Character) => {
    if (!isCharacterUnlocked(character, currentTrophies, unlockedFromChests))
      return;

    setEditingDeck((prev) => {
      if (prev.includes(character.id)) {
        return prev.filter((id) => id !== character.id);
      } else if (prev.length < 4) {
        return [...prev, character.id];
      }
      return prev;
    });
  };

  const saveDeck = () => {
    if (onDeckChange) {
      onDeckChange(editingDeck);
    }
    setMode("collection");
  };

  const cancelDeckEdit = () => {
    setEditingDeck([...currentDeck]);
    setMode("collection");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="glass-effect">
            <BookOpen className="w-4 h-4 mr-2" />
            Collection ({ownedCharacters.length}/{characters.length})
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl glass-effect border-purple-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400 anime-glow" />
                {mode === "collection" ? "Card Collection" : "Deck Editor"}
                <Badge className="bg-blue-500/20 text-blue-400">
                  {ownedCharacters.length}/{characters.length}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <CurrencyDisplay size="sm" />
                <div className="flex gap-2">
                  <Button
                    variant={mode === "collection" ? "default" : "outline"}
                    onClick={() => setMode("collection")}
                    size="sm"
                    className="glass-effect"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Collection
                  </Button>
                  <Button
                    variant={mode === "deck" ? "default" : "outline"}
                    onClick={() => setMode("deck")}
                    size="sm"
                    className="glass-effect"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Deck ({editingDeck.length}/4)
                  </Button>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto space-y-6">
            {mode === "collection" && (
              <>
                {/* Owned Characters */}
                {ownedCharacters.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      Your Characters ({ownedCharacters.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {ownedCharacters.map((character) => {
                        const data = getCharacterData(character);
                        if (!data) return null;

                        return (
                          <Card
                            key={character.id}
                            className="glass-effect p-4 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => setSelectedCharacter(character)}
                          >
                            <div className="space-y-3">
                              {/* Character Avatar */}
                              <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl relative">
                                {character.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}

                                {/* Level Badge */}
                                <Badge className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 text-xs">
                                  Lv.{data.level}
                                </Badge>
                              </div>

                              {/* Character Info */}
                              <div className="text-center">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {character.name}
                                </h4>
                                <p className="text-xs text-white/60">
                                  {character.anime}
                                </p>
                              </div>

                              {/* Cards Progress */}
                              {!data.isMaxLevel && (
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/70">Cards</span>
                                    <span className="text-white/70">
                                      {data.cards}/{data.cardsNeededForUpgrade}
                                    </span>
                                  </div>
                                  <Progress
                                    value={data.progressToNextLevel}
                                    className="h-1.5"
                                    indicatorClassName="bg-gradient-to-r from-blue-400 to-purple-400"
                                  />

                                  {/* Upgrade Cost */}
                                  {data.upgradeCost && (
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-1">
                                        <Coins className="w-3 h-3 text-yellow-400" />
                                        <span
                                          className={
                                            data.canUpgrade
                                              ? "text-white"
                                              : "text-red-400"
                                          }
                                        >
                                          {data.upgradeCost.coins}
                                        </span>
                                      </div>
                                      {data.canUpgrade && (
                                        <Button
                                          size="sm"
                                          className="h-6 px-2 text-xs anime-button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpgradeCharacter(character);
                                          }}
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {data.isMaxLevel && (
                                <Badge className="w-full bg-purple-500/20 text-purple-400 text-xs">
                                  MAX LEVEL
                                </Badge>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Locked Characters */}
                {lockedCharacters.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white/70 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Locked Characters ({lockedCharacters.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {lockedCharacters.map((character) => (
                        <Card
                          key={character.id}
                          className="glass-effect p-3 opacity-50 grayscale"
                        >
                          <div className="space-y-2">
                            <div className="aspect-square bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold">
                              ?
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-white/50 truncate">
                                ???
                              </p>
                              <Badge variant="outline" className="text-xs">
                                Locked
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === "deck" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Edit className="w-5 h-5 text-purple-400" />
                    Build Your Deck ({editingDeck.length}/4)
                  </h3>

                  <div className="flex gap-2">
                    <Button
                      onClick={cancelDeckEdit}
                      variant="outline"
                      size="sm"
                      className="glass-effect"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      onClick={saveDeck}
                      disabled={editingDeck.length !== 4}
                      size="sm"
                      className="anime-button"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Save Deck
                    </Button>
                  </div>
                </div>

                {/* Current Deck */}
                {editingDeck.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-white mb-3">
                      Current Deck:
                    </h4>
                    <div className="flex gap-3">
                      {editingDeck.map((characterId) => {
                        const character = characters.find(
                          (c) => c.id === characterId,
                        );
                        if (!character) return null;
                        const data = getCharacterData(character);

                        return (
                          <Card
                            key={characterId}
                            className="glass-effect p-2 relative"
                          >
                            <div className="w-16 h-20 flex flex-col items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {character.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <p className="text-xs text-white/80 text-center mt-1 truncate w-full">
                                {character.name.split(" ")[0]}
                              </p>
                              {data && (
                                <Badge className="text-xs bg-yellow-500/20 text-yellow-400">
                                  Lv.{data.level}
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 text-xs"
                                onClick={() => toggleCharacterInDeck(character)}
                              >
                                ×
                              </Button>
                            </div>
                          </Card>
                        );
                      })}

                      {/* Empty Slots */}
                      {Array.from({ length: 4 - editingDeck.length }).map(
                        (_, i) => (
                          <Card
                            key={`empty-${i}`}
                            className="glass-effect p-2 opacity-50"
                          >
                            <div className="w-16 h-20 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
                              <span className="text-gray-500 text-2xl">+</span>
                            </div>
                          </Card>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Available Characters */}
                <div>
                  <h4 className="text-md font-semibold text-white mb-3">
                    Available Characters:
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {ownedCharacters.map((character) => {
                      const data = getCharacterData(character);
                      const isInDeck = editingDeck.includes(character.id);
                      const canAdd = !isInDeck && editingDeck.length < 4;

                      return (
                        <Card
                          key={character.id}
                          className={cn(
                            "glass-effect p-3 cursor-pointer transition-all",
                            isInDeck && "border-green-400 bg-green-500/20",
                            canAdd && "hover:bg-white/10",
                            !canAdd && !isInDeck && "opacity-50",
                          )}
                          onClick={() =>
                            canAdd && toggleCharacterInDeck(character)
                          }
                        >
                          <div className="space-y-2">
                            <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm relative">
                              {character.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                              {data && (
                                <Badge className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 text-xs">
                                  {data.level}
                                </Badge>
                              )}
                              {isInDeck && (
                                <div className="absolute inset-0 bg-green-500/30 rounded-lg flex items-center justify-center">
                                  <Check className="w-6 h-6 text-green-400" />
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-white/80 truncate">
                                {character.name.split(" ")[0]}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Character Detail Dialog */}
      <Dialog
        open={!!selectedCharacter}
        onOpenChange={() => setSelectedCharacter(null)}
      >
        <DialogContent className="glass-effect border-purple-500/50">
          {selectedCharacter && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center justify-between">
                  <span>{selectedCharacter.name}</span>
                  {(() => {
                    const data = getCharacterData(selectedCharacter);
                    return (
                      data && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          Level {data.level}
                        </Badge>
                      )
                    );
                  })()}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <CharacterCard
                  character={selectedCharacter}
                  size="lg"
                  showStats={true}
                />

                {(() => {
                  const data = getCharacterData(selectedCharacter);
                  if (!data) {
                    return (
                      <div className="text-center py-4">
                        <p className="text-white/70">
                          This character is not yet in your collection.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {/* Level and Cards Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <h4 className="text-white font-semibold mb-2">
                            Level
                          </h4>
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-lg px-3 py-1">
                            {data.level}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <h4 className="text-white font-semibold mb-2">
                            Cards
                          </h4>
                          <Badge className="bg-blue-500/20 text-blue-400 text-lg px-3 py-1">
                            {data.cards}
                          </Badge>
                        </div>
                      </div>

                      {!data.isMaxLevel && data.upgradeCost && (
                        <>
                          <Separator />

                          {/* Upgrade Section */}
                          <div className="space-y-3">
                            <h4 className="text-white font-semibold flex items-center gap-2">
                              <ArrowUp className="w-4 h-4" />
                              Upgrade to Level {data.level + 1}
                            </h4>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">
                                  Cards Required
                                </span>
                                <span
                                  className={
                                    data.cards >= data.cardsNeededForUpgrade
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  {data.cards}/{data.cardsNeededForUpgrade}
                                </span>
                              </div>
                              <Progress
                                value={data.progressToNextLevel}
                                className="h-2"
                                indicatorClassName="bg-gradient-to-r from-blue-400 to-purple-400"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="w-5 h-5 text-yellow-400" />
                                <span
                                  className={
                                    currency.coins >= data.upgradeCost.coins
                                      ? "text-white"
                                      : "text-red-400"
                                  }
                                >
                                  {data.upgradeCost.coins} coins
                                </span>
                              </div>

                              {data.canUpgrade && (
                                <Button
                                  onClick={() =>
                                    handleUpgradeCharacter(selectedCharacter)
                                  }
                                  className="anime-button"
                                >
                                  Upgrade Now
                                </Button>
                              )}
                            </div>

                            {!data.canUpgrade && (
                              <p className="text-xs text-white/50">
                                {data.cards < data.cardsNeededForUpgrade
                                  ? `Need ${data.cardsNeededForUpgrade - data.cards} more cards`
                                  : `Need ${data.upgradeCost.coins - currency.coins} more coins`}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {data.isMaxLevel && (
                        <div className="text-center py-4">
                          <Badge className="bg-purple-500/20 text-purple-400 text-lg px-4 py-2">
                            ⭐ MAX LEVEL REACHED ⭐
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
