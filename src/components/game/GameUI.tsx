import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Character, getCharacterById } from "@/lib/characters";
import { GameState } from "@/lib/gameLogic";
import CharacterCard from "./CharacterCard";
import EnergyBar from "./EnergyBar";
import TrophyDisplay from "./TrophyDisplay";
import {
  Pause,
  Play,
  RotateCcw,
  Trophy,
  Clock,
  Shield,
  Heart,
} from "lucide-react";

interface GameUIProps {
  gameState: GameState;
  availableCharacters: Character[];
  onCharacterSelect: (character: Character) => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  selectedCharacter: Character | null;
}

export default function GameUI({
  gameState,
  availableCharacters,
  onCharacterSelect,
  onPause,
  onResume,
  onReset,
  selectedCharacter,
}: GameUIProps) {
  const [selectedLane, setSelectedLane] = useState<"left" | "right" | null>(
    null,
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playerKingTower = gameState.playerTowers.find((t) => t.type === "king");
  const enemyKingTower = gameState.enemyTowers.find((t) => t.type === "king");
  const playerSideTowers = gameState.playerTowers.filter(
    (t) => t.type !== "king",
  );
  const enemySideTowers = gameState.enemyTowers.filter(
    (t) => t.type !== "king",
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="flex items-center justify-between">
          {/* Trophy Display */}
          <div className="flex items-center gap-4">
            <TrophyDisplay showProgress={false} />
          </div>
          {/* Player Towers Health */}
          <div className="flex items-center gap-2">
            {/* King Tower */}
            {playerKingTower && (
              <Card className="glass-effect p-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-xs text-white/70">King</div>
                    <Progress
                      value={
                        (playerKingTower.health / playerKingTower.maxHealth) *
                        100
                      }
                      className="w-16 h-1"
                      indicatorClassName="bg-green-400"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Side Towers */}
            {playerSideTowers.map((tower) => (
              <Card key={tower.id} className="glass-effect p-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded ${tower.isDestroyed ? "bg-red-400" : "bg-green-400"}`}
                  />
                  <div>
                    <div className="text-xs text-white/70">{tower.type}</div>
                    {!tower.isDestroyed && (
                      <Progress
                        value={(tower.health / tower.maxHealth) * 100}
                        className="w-12 h-1"
                        indicatorClassName="bg-green-400"
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Game Stats */}
          <Card className="glass-effect p-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-mono text-white">
                {formatTime(gameState.battleTimer)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-mono text-white">{gameState.score}</span>
            </div>
            <div className="flex gap-2">
              {gameState.gameStatus === "playing" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onPause}
                  className="glass-effect"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onResume}
                  className="glass-effect"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onReset}
                className="glass-effect"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Enemy Towers Health */}
          <div className="flex items-center gap-2">
            {/* Side Towers */}
            {enemySideTowers.map((tower) => (
              <Card key={tower.id} className="glass-effect p-2">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs text-white/70">{tower.type}</div>
                    {!tower.isDestroyed && (
                      <Progress
                        value={(tower.health / tower.maxHealth) * 100}
                        className="w-12 h-1"
                        indicatorClassName="bg-red-400"
                      />
                    )}
                  </div>
                  <div
                    className={`w-3 h-3 rounded ${tower.isDestroyed ? "bg-gray-400" : "bg-red-400"}`}
                  />
                </div>
              </Card>
            ))}

            {/* King Tower */}
            {enemyKingTower && (
              <Card className="glass-effect p-2">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs text-white/70">King</div>
                    <Progress
                      value={
                        (enemyKingTower.health / enemyKingTower.maxHealth) * 100
                      }
                      className="w-16 h-1"
                      indicatorClassName="bg-red-400"
                    />
                  </div>
                  <Heart className="w-4 h-4 text-red-400" />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Lane Selection */}
      {selectedCharacter && (
        <div className="absolute top-1/2 left-4 right-4 pointer-events-auto">
          <Card className="glass-effect p-4 mx-auto w-fit">
            <div className="text-center mb-3">
              <h3 className="text-white font-bold mb-1">Choose Lane</h3>
              <p className="text-white/70 text-sm">
                Select a lane to deploy {selectedCharacter.name}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant={selectedLane === "left" ? "default" : "outline"}
                onClick={() => setSelectedLane("left")}
                className="anime-button"
              >
                Left Lane
              </Button>
              <Button
                variant={selectedLane === "right" ? "default" : "outline"}
                onClick={() => setSelectedLane("right")}
                className="anime-button"
              >
                Right Lane
              </Button>
            </div>
            {selectedLane && (
              <Button
                className="anime-button w-full mt-3"
                onClick={() => {
                  // This would be handled by the parent component
                  setSelectedLane(null);
                }}
              >
                Deploy to {selectedLane} lane
              </Button>
            )}
          </Card>
        </div>
      )}

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex items-end gap-4">
          {/* Energy Bar */}
          <EnergyBar
            current={gameState.energy}
            max={gameState.maxEnergy}
            regenRate={gameState.energyRegenRate}
            className="flex-shrink-0"
          />

          {/* Character Deck */}
          <Card className="glass-effect p-4 flex-1">
            <h3 className="text-white font-bold mb-3 text-center">
              Character Deck
            </h3>
            <div className="flex gap-3 justify-center">
              {gameState.selectedDeck.map((characterId) => {
                const character = getCharacterById(characterId);
                if (!character) return null;

                const canAfford = gameState.energy >= character.cost;

                return (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    size="sm"
                    canAfford={canAfford}
                    isSelected={selectedCharacter?.id === character.id}
                    onClick={() =>
                      canAfford ? onCharacterSelect(character) : null
                    }
                    showStats={false}
                  />
                );
              })}
            </div>
          </Card>

          {/* Unit Counter */}
          <Card className="glass-effect p-4 flex-shrink-0">
            <div className="text-center">
              <div className="text-sm text-white/70 mb-1">Units</div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-500/20">
                  P: {gameState.playerUnits.length}
                </Badge>
                <Badge variant="outline" className="bg-red-500/20">
                  E: {gameState.enemyUnits.length}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Status Overlay */}
      {(gameState.gameStatus === "victory" ||
        gameState.gameStatus === "defeat" ||
        gameState.gameStatus === "paused") && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
          <Card className="glass-effect p-8 text-center max-w-md">
            {gameState.gameStatus === "victory" && (
              <>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 anime-glow" />
                <h2 className="text-3xl font-bold text-yellow-400 mb-2 text-anime-glow">
                  VICTORY!
                </h2>
                <p className="text-white/80 mb-4">
                  You've defeated the enemy tower!
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-white/70">
                    <span>Time:</span>
                    <span>{formatTime(gameState.battleTimer)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Score:</span>
                    <span>{gameState.score}</span>
                  </div>
                </div>
              </>
            )}

            {gameState.gameStatus === "defeat" && (
              <>
                <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-red-400 mb-2">DEFEAT</h2>
                <p className="text-white/80 mb-6">
                  Your tower has been destroyed!
                </p>
              </>
            )}

            {gameState.gameStatus === "paused" && (
              <>
                <Pause className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-blue-400 mb-2">
                  PAUSED
                </h2>
                <p className="text-white/80 mb-6">Game is paused</p>
              </>
            )}

            <div className="flex gap-3 justify-center">
              {gameState.gameStatus === "paused" && (
                <Button onClick={onResume} className="anime-button">
                  Resume
                </Button>
              )}
              <Button
                onClick={onReset}
                variant="outline"
                className="glass-effect"
              >
                New Game
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
