import { useState, useEffect } from "react";
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
  Zap,
  Swords,
  Crown,
  Target,
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

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
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
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Particle system for background effects
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0);

        // Add new particles occasionally
        if (Math.random() < 0.1) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 60,
            maxLife: 60,
            color: [
              "rgb(147, 51, 234)",
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
            ][Math.floor(Math.random() * 3)],
          });
        }

        return newParticles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  const TowerHealthDisplay = ({
    tower,
    isEnemy = false,
  }: {
    tower: any;
    isEnemy?: boolean;
  }) => {
    const healthPercent = (tower.health / tower.maxHealth) * 100;
    const isKing = tower.type === "king";

    return (
      <div className="floating-panel hover-lift">
        <div className="flex items-center gap-3 p-3">
          <div className="relative">
            {isKing ? (
              <Crown
                className={cn(
                  "w-5 h-5",
                  isEnemy ? "text-red-400" : "text-green-400",
                )}
              />
            ) : (
              <Shield
                className={cn(
                  "w-4 h-4",
                  isEnemy ? "text-red-400" : "text-green-400",
                )}
              />
            )}
            {tower.isDestroyed && (
              <div className="absolute inset-0 bg-red-500/20 rounded animate-pulse" />
            )}
          </div>

          <div className="flex-1">
            <div className="text-xs text-white/80 font-medium mb-1 capitalize">
              {tower.type}
            </div>
            {!tower.isDestroyed ? (
              <div className="relative">
                <Progress
                  value={healthPercent}
                  className="h-2 bg-slate-800/50 border border-white/10"
                  indicatorClassName={cn(
                    "transition-all duration-300",
                    isEnemy
                      ? "bg-gradient-to-r from-red-500 to-red-400"
                      : "bg-gradient-to-r from-green-500 to-green-400",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            ) : (
              <div className="text-xs text-red-400 font-bold animate-pulse">
                DESTROYED
              </div>
            )}
          </div>

          <div className="text-xs font-mono text-white/60">
            {tower.isDestroyed ? "0" : Math.ceil(tower.health)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.life / particle.maxLife,
              transform: `scale(${particle.life / particle.maxLife})`,
            }}
          />
        ))}
      </div>

      {/* Interactive Cursor Effect */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-50 transition-transform duration-150 ease-out"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: selectedCharacter ? "scale(2)" : "scale(1)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Enhanced Top HUD */}
        <div className="absolute top-6 left-6 right-6 pointer-events-auto">
          <div className="flex items-start justify-between gap-6">
            {/* Left Panel - Player Status */}
            <div className="flex flex-col gap-3">
              <TrophyDisplay showProgress={false} />

              {/* Player Towers */}
              <div className="space-y-2">
                <div className="text-xs text-green-400/80 font-medium tracking-wide uppercase">
                  Your Towers
                </div>
                {playerKingTower && (
                  <TowerHealthDisplay tower={playerKingTower} />
                )}
                {playerSideTowers.map((tower) => (
                  <TowerHealthDisplay key={tower.id} tower={tower} />
                ))}
              </div>
            </div>

            {/* Center Panel - Game Stats */}
            <div className="floating-panel hover-lift px-6 py-4">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-pulse-glow" />
                  <div className="text-xl font-mono font-bold text-white tracking-wider">
                    {formatTime(gameState.battleTimer)}
                  </div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    Battle Time
                  </div>
                </div>

                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                <div className="text-center">
                  <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2 anime-glow" />
                  <div className="text-xl font-mono font-bold text-white tracking-wider">
                    {gameState.score}
                  </div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    Score
                  </div>
                </div>

                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                <div className="flex gap-2">
                  {gameState.gameStatus === "playing" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onPause}
                      className="futuristic-button"
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onResume}
                      className="futuristic-button"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onReset}
                    className="futuristic-button"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel - Enemy Status */}
            <div className="flex flex-col gap-3 items-end">
              <div className="floating-panel px-4 py-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">Enemy</span>
                </div>
              </div>

              {/* Enemy Towers */}
              <div className="space-y-2">
                <div className="text-xs text-red-400/80 font-medium tracking-wide uppercase text-right">
                  Enemy Towers
                </div>
                {enemyKingTower && (
                  <TowerHealthDisplay tower={enemyKingTower} isEnemy />
                )}
                {enemySideTowers.map((tower) => (
                  <TowerHealthDisplay key={tower.id} tower={tower} isEnemy />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Deployment Instructions */}
        {selectedCharacter && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="floating-panel-large animate-float px-8 py-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse-glow">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Deploy {selectedCharacter.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Cost: {selectedCharacter.cost} energy</span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 mb-4 leading-relaxed">
                Click anywhere in the{" "}
                <span className="text-blue-400 font-bold">
                  blue deployment zone
                </span>{" "}
                to place your character
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded animate-pulse" />
                  <span>Valid Zone</span>
                </div>
                <span>•</span>
                <span>Click anywhere to cancel</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Bottom HUD */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
          <div className="flex items-end gap-6">
            {/* Enhanced Energy Bar */}
            <div className="flex-shrink-0">
              <EnergyBar
                current={gameState.energy}
                max={gameState.maxEnergy}
                regenRate={gameState.energyRegenRate}
                className="w-64"
              />
            </div>

            {/* Enhanced Character Deck */}
            <div className="floating-panel-large flex-1 px-6 py-5">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Swords className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Character Deck
                </h3>
              </div>

              <div className="flex gap-4 justify-center">
                {gameState.selectedDeck.map((characterId) => {
                  const character = getCharacterById(characterId);
                  if (!character) return null;

                  const canAfford = gameState.energy >= character.cost;

                  return (
                    <div key={character.id} className="relative group">
                      <CharacterCard
                        character={character}
                        size="sm"
                        canAfford={canAfford}
                        isSelected={selectedCharacter?.id === character.id}
                        onClick={() =>
                          canAfford ? onCharacterSelect(character) : null
                        }
                        showStats={false}
                        className={cn(
                          "transition-all duration-300 hover-lift",
                          selectedCharacter?.id === character.id &&
                            "ring-2 ring-purple-400 animate-pulse-glow",
                          !canAfford &&
                            "opacity-50 grayscale cursor-not-allowed",
                        )}
                      />

                      {/* Energy Cost Indicator */}
                      <div
                        className={cn(
                          "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                          canAfford
                            ? "bg-green-500 text-white animate-pulse-glow"
                            : "bg-red-500/80 text-white/80",
                        )}
                      >
                        {character.cost}
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Unit Counter */}
            <div className="floating-panel flex-shrink-0 px-5 py-4">
              <div className="text-center">
                <div className="text-sm text-white/80 font-medium mb-3 tracking-wide">
                  Battle Units
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded animate-pulse-glow" />
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 border-green-400/30 text-green-400"
                    >
                      You: {gameState.playerUnits.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded animate-pulse-glow" />
                    <Badge
                      variant="outline"
                      className="bg-red-500/20 border-red-400/30 text-red-400"
                    >
                      Enemy: {gameState.enemyUnits.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Game Status Overlay */}
        {(gameState.gameStatus === "victory" ||
          gameState.gameStatus === "defeat" ||
          gameState.gameStatus === "paused") && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto backdrop-blur-sm">
            <div className="floating-panel-large max-w-lg text-center px-10 py-8 animate-scale-in">
              {gameState.gameStatus === "victory" && (
                <>
                  <div className="relative mb-6">
                    <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce-glow" />
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping" />
                  </div>
                  <h2 className="text-4xl font-bold text-yellow-400 mb-4 text-anime-glow animate-pulse-glow">
                    VICTORY!
                  </h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    Outstanding! You've conquered the enemy towers and claimed
                    victory!
                  </p>
                  <div className="space-y-3 mb-8 bg-slate-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center text-white/80">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Battle Duration:
                      </span>
                      <span className="font-mono font-bold">
                        {formatTime(gameState.battleTimer)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Final Score:
                      </span>
                      <span className="font-mono font-bold text-yellow-400">
                        {gameState.score}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {gameState.gameStatus === "defeat" && (
                <>
                  <div className="relative mb-6">
                    <Shield className="w-20 h-20 text-red-400 mx-auto" />
                    <div className="absolute inset-0 bg-red-400/20 rounded-full animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-bold text-red-400 mb-4">
                    DEFEAT
                  </h2>
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    Your towers have fallen! Regroup and try again.
                  </p>
                </>
              )}

              {gameState.gameStatus === "paused" && (
                <>
                  <div className="relative mb-6">
                    <Pause className="w-20 h-20 text-blue-400 mx-auto animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-bold text-blue-400 mb-4">
                    PAUSED
                  </h2>
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    Game is temporarily paused
                  </p>
                </>
              )}

              <div className="flex gap-4 justify-center">
                {gameState.gameStatus === "paused" && (
                  <Button
                    onClick={onResume}
                    className="futuristic-button-primary px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume Battle
                  </Button>
                )}
                <Button
                  onClick={onReset}
                  variant="outline"
                  className="futuristic-button px-8 py-3"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  New Game
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
