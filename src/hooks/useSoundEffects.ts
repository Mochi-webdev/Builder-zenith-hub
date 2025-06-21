import { useCallback, useRef } from "react";

interface SoundConfig {
  volume?: number;
  enabled?: boolean;
}

export function useSoundEffects(config: SoundConfig = {}) {
  const { volume = 0.3, enabled = true } = config;
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && enabled && typeof window !== "undefined") {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn("Audio context not supported:", error);
      }
    }
    return audioContextRef.current;
  }, [enabled]);

  const createTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      const audioContext = initAudioContext();
      if (!audioContext || !enabled) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + 0.01,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + duration,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn("Error playing sound:", error);
      }
    },
    [initAudioContext, enabled, volume],
  );

  // Sound effect functions
  const playButtonClick = useCallback(() => {
    createTone(800, 0.1, "square");
  }, [createTone]);

  const playCharacterSelect = useCallback(() => {
    createTone(600, 0.15, "sine");
    setTimeout(() => createTone(900, 0.1, "sine"), 100);
  }, [createTone]);

  const playCharacterDeploy = useCallback(() => {
    createTone(400, 0.2, "sawtooth");
    setTimeout(() => createTone(600, 0.15, "sine"), 100);
  }, [createTone]);

  const playEnergyRecharge = useCallback(() => {
    createTone(1000, 0.05, "sine");
  }, [createTone]);

  const playAttack = useCallback(() => {
    createTone(300, 0.1, "sawtooth");
  }, [createTone]);

  const playVictory = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C, E, G, C (major chord)
    notes.forEach((note, index) => {
      setTimeout(() => createTone(note, 0.5, "sine"), index * 200);
    });
  }, [createTone]);

  const playDefeat = useCallback(() => {
    createTone(200, 0.8, "sawtooth");
  }, [createTone]);

  const playHover = useCallback(() => {
    createTone(1200, 0.05, "sine");
  }, [createTone]);

  return {
    playButtonClick,
    playCharacterSelect,
    playCharacterDeploy,
    playEnergyRecharge,
    playAttack,
    playVictory,
    playDefeat,
    playHover,
  };
}
