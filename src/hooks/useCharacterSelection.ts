import { useState, useCallback } from "react";
import { Character } from "@/lib/characters";

interface UseCharacterSelectionProps {
  maxDeckSize?: number;
  initialDeck?: string[];
}

export function useCharacterSelection({
  maxDeckSize = 4,
  initialDeck = [],
}: UseCharacterSelectionProps = {}) {
  const [selectedDeck, setSelectedDeck] = useState<string[]>(initialDeck);

  const addCharacter = useCallback(
    (characterId: string) => {
      setSelectedDeck((prev) => {
        if (prev.includes(characterId) || prev.length >= maxDeckSize) {
          return prev;
        }
        return [...prev, characterId];
      });
    },
    [maxDeckSize],
  );

  const removeCharacter = useCallback((characterId: string) => {
    setSelectedDeck((prev) => prev.filter((id) => id !== characterId));
  }, []);

  const toggleCharacter = useCallback(
    (character: Character) => {
      setSelectedDeck((prev) => {
        if (prev.includes(character.id)) {
          return prev.filter((id) => id !== character.id);
        } else if (prev.length < maxDeckSize) {
          return [...prev, character.id];
        }
        return prev;
      });
    },
    [maxDeckSize],
  );

  const clearDeck = useCallback(() => {
    setSelectedDeck([]);
  }, []);

  const isCharacterSelected = useCallback(
    (characterId: string) => {
      return selectedDeck.includes(characterId);
    },
    [selectedDeck],
  );

  const canAddCharacter = useCallback(
    (characterId: string) => {
      return (
        !selectedDeck.includes(characterId) && selectedDeck.length < maxDeckSize
      );
    },
    [selectedDeck, maxDeckSize],
  );

  const isDeckComplete = selectedDeck.length === maxDeckSize;
  const remainingSlots = maxDeckSize - selectedDeck.length;

  return {
    selectedDeck,
    addCharacter,
    removeCharacter,
    toggleCharacter,
    clearDeck,
    isCharacterSelected,
    canAddCharacter,
    isDeckComplete,
    remainingSlots,
    deckSize: selectedDeck.length,
    maxDeckSize,
  };
}
