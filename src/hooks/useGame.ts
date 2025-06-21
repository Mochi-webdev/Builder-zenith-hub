import { useState, useEffect, useCallback } from "react";
import { gameEngine, GameState } from "@/lib/gameLogic";
import { Character } from "@/lib/characters";

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = gameEngine.subscribe((state) => {
      setGameState(state);
    });

    setIsInitialized(true);

    return unsubscribe;
  }, []);

  const startGame = useCallback((deck: string[]) => {
    gameEngine.startGame(deck);
  }, []);

  const placeCharacter = useCallback(
    (character: Character, lane: "left" | "right") => {
      return gameEngine.placeCharacter(character, lane);
    },
    [],
  );

  const pauseGame = useCallback(() => {
    gameEngine.pauseGame();
  }, []);

  const resumeGame = useCallback(() => {
    gameEngine.resumeGame();
  }, []);

  const resetGame = useCallback(() => {
    gameEngine.resetGame();
  }, []);

  const canAffordCharacter = useCallback(
    (character: Character) => {
      return gameEngine.canPlaceCharacter(character);
    },
    [gameState.energy],
  );

  return {
    gameState,
    isInitialized,
    startGame,
    placeCharacter,
    pauseGame,
    resumeGame,
    resetGame,
    canAffordCharacter,
  };
}
