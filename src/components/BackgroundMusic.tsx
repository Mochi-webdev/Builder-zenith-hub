import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [musicGain, setMusicGain] = useState<GainNode | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const context = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const gain = context.createGain();
        gain.connect(context.destination);
        gain.gain.value = 0.1; // Low volume background music

        setAudioContext(context);
        setMusicGain(gain);
      } catch (error) {
        console.warn("Audio context not supported:", error);
      }
    }

    return () => {
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, []);

  const generateBackgroundMusic = () => {
    if (!audioContext || !musicGain) return;

    // Create ambient background music using oscillators
    const createOscillator = (
      frequency: number,
      type: OscillatorType,
      delay: number = 0,
    ) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(musicGain);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gain.gain.value = 0.02;

      // Add some variation
      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime + delay,
      );
      oscillator.frequency.linearRampToValueAtTime(
        frequency * 1.1,
        audioContext.currentTime + delay + 8,
      );
      oscillator.frequency.linearRampToValueAtTime(
        frequency,
        audioContext.currentTime + delay + 16,
      );

      oscillator.start(audioContext.currentTime + delay);
      return oscillator;
    };

    // Create multiple layers for ambient music
    const oscillators = [
      createOscillator(55, "sine", 0), // Bass
      createOscillator(110, "sine", 2),
      createOscillator(220, "triangle", 4),
      createOscillator(330, "sine", 6),
    ];

    // Stop oscillators after some time and restart
    setTimeout(() => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      if (isPlaying) {
        generateBackgroundMusic();
      }
    }, 16000);
  };

  const toggleMusic = () => {
    if (!audioContext || !musicGain) return;

    if (isPlaying) {
      musicGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      setIsPlaying(false);
    } else {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      musicGain.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.5,
      );
      setIsPlaying(true);
      generateBackgroundMusic();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMusic}
        className="glass-effect"
        disabled={!audioContext}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
