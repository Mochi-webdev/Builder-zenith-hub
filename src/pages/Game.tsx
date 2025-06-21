import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Character, getCharacterById } from "@/lib/characters";
import { useGame } from "@/hooks/useGame";
import BattleArena from "@/components/game/BattleArena";
import GameUI from "@/components/game/GameUI";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    gameState,
    isInitialized,
    startGame,
    placeCharacter,
    pauseGame,
    resumeGame,
    resetGame,
    canAffordCharacter,
  } = useGame();

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );

  // Get deck from navigation state
  const deck = location.state?.deck || [];

  useEffect(() => {
    // Redirect to home if no deck is provided
    if (!deck || deck.length === 0) {
      navigate("/");
      return;
    }

    // Start the game with the selected deck when component is initialized
    if (isInitialized) {
      startGame(deck);
    }

    // Game loop is now handled in useGame hook
    return () => {
      // Cleanup is handled in useGame hook
    };
  }, [deck, navigate, isInitialized, startGame]);

  const handleCharacterSelect = useCallback(
    (character: Character) => {
      if (canAffordCharacter(character)) {
        setSelectedCharacter(character);
      }
    },
    [canAffordCharacter],
  );

  const handleArenaClick = useCallback(
    (position: { x: number; z: number }) => {
      if (selectedCharacter && gameState.gameStatus === "playing") {
        // Determine lane based on click position
        const lane = position.x < 0 ? "left" : "right";

        // Only allow placement in player's half of the arena
        if (position.z < 0) {
          const success = placeCharacter(selectedCharacter, lane);
          if (success) {
            setSelectedCharacter(null);
          }
        }
      }
    },
    [selectedCharacter, gameState.gameStatus, placeCharacter],
  );

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  const handleReset = useCallback(() => {
    resetGame();
    navigate("/");
  }, [resetGame, navigate]);

  // Get available characters from deck
  const availableCharacters = deck
    .map((id: string) => getCharacterById(id))
    .filter(Boolean) as Character[];

  if (!deck || deck.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No deck selected</h2>
          <p className="mb-4">Please select a deck to start playing.</p>
          <button
            onClick={() => navigate("/")}
            className="anime-button px-6 py-3"
          >
            Go to Character Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <BackgroundMusic />
      {/* 3D Battle Arena */}
      <BattleArena
        playerUnits={gameState.playerUnits}
        enemyUnits={gameState.enemyUnits}
        onArenaClick={handleArenaClick}
      />

      {/* Game UI Overlay */}
      <GameUI
        gameState={gameState}
        availableCharacters={availableCharacters}
        onCharacterSelect={handleCharacterSelect}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        selectedCharacter={selectedCharacter}
      />

      {/* Click Instructions */}
      {selectedCharacter && gameState.gameStatus === "playing" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="glass-effect p-4 rounded-lg text-center">
            <h3 className="text-white font-bold mb-2">Deploy Character</h3>
            <p className="text-white/80 text-sm mb-2">
              Click on your side of the arena (blue area) to deploy{" "}
              {selectedCharacter.name}
            </p>
            <div className="text-xs text-white/60">
              Cost: {selectedCharacter.cost} energy
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {gameState.gameStatus === "menu" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="glass-effect p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white">Initializing battle arena...</p>
          </div>
        </div>
      )}
    </div>
  );
}
