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
        // Only allow placement in player's half of the arena (z < 0)
        if (position.z < 0) {
          // Determine lane based on click position
          const lane = position.x < 0 ? "left" : "right";
          const success = placeCharacter(selectedCharacter, lane);
          if (success) {
            setSelectedCharacter(null);
          }
        }
      } else if (selectedCharacter) {
        // If character is selected but clicked outside valid area, cancel selection
        setSelectedCharacter(null);
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
        playerTowers={gameState.playerTowers}
        enemyTowers={gameState.enemyTowers}
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
