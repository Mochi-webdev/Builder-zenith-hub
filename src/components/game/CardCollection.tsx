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
import { chestManager, CardCollection } from "@/lib/chestSystem";
import { characters, Character } from "@/lib/characters";
import CharacterCard from "./CharacterCard";
import { BookOpen, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardCollectionDisplayProps {
  className?: string;
}

export default function CardCollectionDisplay({
  className,
}: CardCollectionDisplayProps) {
  const [collection, setCollection] = useState<CardCollection>({});
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    updateCollection();
    const interval = setInterval(updateCollection, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateCollection = () => {
    setCollection(chestManager.getCollection());
  };

  const getCharacterData = (character: Character) => {
    const data = collection[character.id];
    if (!data) return null;

    const progressToNextLevel =
      data.cardsNeededForUpgrade > 0
        ? (data.cards / data.cardsNeededForUpgrade) * 100
        : 100;

    return {
      ...data,
      progressToNextLevel,
      isMaxLevel: data.level >= 10,
    };
  };

  const ownedCharacters = characters.filter((char) => {
    const data = collection[char.id];
    return data && (data.level > 1 || data.cards > 0);
  });

  const unownedCharacters = characters.filter((char) => {
    const data = collection[char.id];
    return !data || (data.level === 1 && data.cards === 0);
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="glass-effect">
            <BookOpen className="w-4 h-4 mr-2" />
            Collection ({ownedCharacters.length}/{characters.length})
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl glass-effect border-purple-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <BookOpen className="w-6 h-6 text-blue-400 anime-glow" />
              Card Collection
              <Badge className="bg-blue-500/20 text-blue-400">
                {ownedCharacters.length}/{characters.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto space-y-6">
            {/* Owned Characters */}
            {ownedCharacters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Collected Characters
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {ownedCharacters.map((character) => {
                    const data = getCharacterData(character);
                    if (!data) return null;

                    return (
                      <Card
                        key={character.id}
                        className="glass-effect p-3 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedCharacter(character)}
                      >
                        <div className="space-y-2">
                          <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {character.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {character.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-500/20 text-yellow-400"
                            >
                              Level {data.level}
                            </Badge>
                          </div>

                          {!data.isMaxLevel && (
                            <div className="space-y-1">
                              <Progress
                                value={data.progressToNextLevel}
                                className="h-1"
                              />
                              <p className="text-xs text-white/70 text-center">
                                {data.cards}/{data.cardsNeededForUpgrade}
                              </p>
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

            {/* Unowned Characters */}
            {unownedCharacters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white/70 mb-3">
                  Not Collected
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {unownedCharacters.map((character) => (
                    <Card
                      key={character.id}
                      className="glass-effect p-3 opacity-50 grayscale cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => setSelectedCharacter(character)}
                    >
                      <div className="space-y-2">
                        <div className="aspect-square bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          ?
                        </div>
                        <div className="text-center">
                          <h4 className="text-sm font-semibold text-white/70 truncate">
                            ???
                          </h4>
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
                <DialogTitle className="text-white">
                  {selectedCharacter.name}
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
                        <p className="text-sm text-white/50 mt-2">
                          Open chests to find this character!
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Level</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          {data.level}
                        </Badge>
                      </div>

                      {!data.isMaxLevel && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/70">
                                Progress to Level {data.level + 1}
                              </span>
                              <span className="text-white/70">
                                {data.cards}/{data.cardsNeededForUpgrade}
                              </span>
                            </div>
                            <Progress
                              value={data.progressToNextLevel}
                              className="h-2"
                            />
                          </div>

                          <p className="text-xs text-white/50">
                            Collect {data.cardsNeededForUpgrade - data.cards}{" "}
                            more cards to upgrade!
                          </p>
                        </>
                      )}

                      {data.isMaxLevel && (
                        <div className="text-center py-2">
                          <Badge className="bg-purple-500/20 text-purple-400">
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
