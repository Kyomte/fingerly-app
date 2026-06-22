import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export type SoundCue = 'hang' | 'rest' | 'done';

const SOURCES: Record<SoundCue, number> = {
  hang: require('../../assets/sounds/hang.wav'),
  rest: require('../../assets/sounds/rest.wav'),
  done: require('../../assets/sounds/done.wav'),
};

/**
 * Preloads the phase-transition audio cues and returns a `play` function.
 * Sounds are configured to play even when the device ringer is muted so the
 * cue is still audible mid-hang with chalky hands and the screen out of view.
 */
export function useSoundCues(enabled = true) {
  const soundsRef = useRef<Partial<Record<SoundCue, Audio.Sound>>>({});
  const readyRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const entries = await Promise.all(
          (Object.keys(SOURCES) as SoundCue[]).map(async cue => {
            const { sound } = await Audio.Sound.createAsync(SOURCES[cue], {
              volume: 1.0,
            });
            return [cue, sound] as const;
          })
        );

        if (cancelled) {
          entries.forEach(([, sound]) => sound.unloadAsync());
          return;
        }

        entries.forEach(([cue, sound]) => {
          soundsRef.current[cue] = sound;
        });
        readyRef.current = true;
      } catch {
        // Audio is a best-effort enhancement; haptics remain the fallback.
      }
    })();

    return () => {
      cancelled = true;
      readyRef.current = false;
      const loaded = soundsRef.current;
      soundsRef.current = {};
      Object.values(loaded).forEach(sound => sound?.unloadAsync());
    };
  }, [enabled]);

  const play = useCallback((cue: SoundCue) => {
    if (!enabled || !readyRef.current) return;
    const sound = soundsRef.current[cue];
    if (!sound) return;
    // replayAsync rewinds to the start, so rapid back-to-back cues still fire.
    sound.replayAsync().catch(() => {});
  }, [enabled]);

  return play;
}
