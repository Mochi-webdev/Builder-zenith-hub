import { useState, useEffect, useCallback, useRef } from "react";
import { gameEngine, GameState } from "@/lib/gameLogic";
import { Character } from "@/lib/characters";

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());
  const [isInitialized, setIsInitialized] = useState(false);
  const gameLoopRef = useRef<number>();

  useEffect(() => {
    const unsubscribe = gameEngine.subscribe((state) => {
      setGameState(state);
    });

    // Start the game update loop
    let lastTime = Date.now();
    const updateLoop = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      gameEngine.update(deltaTime);
      gameLoopRef.current = requestAnimationFrame(updateLoop);
    };

    gameLoopRef.current = requestAnimationFrame(updateLoop);
    setIsInitialized(true);

    return () => {
      unsubscribe();
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
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
