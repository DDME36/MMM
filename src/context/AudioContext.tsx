import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { CONFIG } from '../config';

interface AudioContextType {
  audioAllowed: boolean | null;
  setAudioAllowed: (allowed: boolean) => void;
  isAmbientPlaying: boolean;
  toggleAmbient: () => void;
  isSongPlaying: boolean;
  toggleSong: () => void;
  startExperience: () => void;
  audioError: string | null;
  songTime: number;
  songDuration: number;
  songVolume: number;
  seekSong: (seconds: number) => void;
  setSongVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioAllowed, setAudioAllowedState] = useState<boolean | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [songTime, setSongTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [songVolume, setSongVolumeState] = useState(CONFIG.audio.songVolume);

  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const songRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    ambientRef.current = new Audio(CONFIG.audio.ambient);
    ambientRef.current.preload = 'none';
    ambientRef.current.loop = true;
    ambientRef.current.volume = CONFIG.audio.ambientVolume;
    ambientRef.current.onplay = () => setIsAmbientPlaying(true);
    ambientRef.current.onpause = () => setIsAmbientPlaying(false);
    ambientRef.current.onerror = () => { setIsAmbientPlaying(false); setAudioError(CONFIG.labels.audioUnavailable); };

    songRef.current = new Audio(CONFIG.audio.song);
    songRef.current.preload = 'metadata';
    songRef.current.loop = false;
    songRef.current.volume = CONFIG.audio.songVolume;
    songRef.current.ontimeupdate = () => setSongTime(songRef.current?.currentTime ?? 0);
    songRef.current.ondurationchange = () => {
      const duration = songRef.current?.duration ?? 0;
      setSongDuration(Number.isFinite(duration) ? duration : 0);
    };
    const restoreAmbient = () => { if (ambientRef.current) ambientRef.current.volume = CONFIG.audio.ambientVolume; };
    songRef.current.onpause = () => { setIsSongPlaying(false); restoreAmbient(); };
    songRef.current.onerror = () => { setIsSongPlaying(false); restoreAmbient(); setAudioError(CONFIG.labels.audioUnavailable); };

    songRef.current.onended = () => {
      setIsSongPlaying(false);
      restoreAmbient();
    };

    return () => {
      if (ambientRef.current) { ambientRef.current.onplay = null; ambientRef.current.onpause = null; ambientRef.current.onerror = null; }
      if (songRef.current) { songRef.current.onpause = null; songRef.current.onended = null; songRef.current.onerror = null; songRef.current.ontimeupdate = null; songRef.current.ondurationchange = null; }
      ambientRef.current?.pause();
      songRef.current?.pause();
    };
  }, []);

  const setAudioAllowed = (allowed: boolean) => {
    setAudioError(null);
    setAudioAllowedState(allowed);
    if (allowed) {
      ambientRef.current?.play().catch(() => { setIsAmbientPlaying(false); setAudioError(CONFIG.labels.audioUnavailable); });
    } else {
      setIsAmbientPlaying(false);
      ambientRef.current?.pause();
    }
  };

  const startExperience = () => {
    if (audioAllowed && ambientRef.current && ambientRef.current.paused) {
      ambientRef.current.play().catch(() => setIsAmbientPlaying(false));
    }
  };

  const toggleAmbient = () => {
    setAudioError(null);
    if (!ambientRef.current) return;
    if (isAmbientPlaying) {
      ambientRef.current.pause();
      setIsAmbientPlaying(false);
    } else {
      setAudioAllowedState(true);
      ambientRef.current.volume = songRef.current && !songRef.current.paused ? CONFIG.audio.duckVolume : CONFIG.audio.ambientVolume;
      ambientRef.current.play().catch(() => { setIsAmbientPlaying(false); setAudioError(CONFIG.labels.audioUnavailable); });
    }
  };

  const toggleSong = () => {
    setAudioError(null);
    if (!songRef.current) return;
    if (isSongPlaying) {
      songRef.current.pause();
      setIsSongPlaying(false);
      if (ambientRef.current && isAmbientPlaying) {
        ambientRef.current.volume = CONFIG.audio.ambientVolume;
      }
    } else {
      if (ambientRef.current) {
        ambientRef.current.volume = CONFIG.audio.duckVolume;
      }
      songRef.current.play()
        .then(() => setIsSongPlaying(true))
        .catch(() => { setIsSongPlaying(false); setAudioError(CONFIG.labels.audioUnavailable); if (ambientRef.current) ambientRef.current.volume = CONFIG.audio.ambientVolume; });
    }
  };

  const seekSong = (seconds: number) => {
    const song = songRef.current;
    if (!song || !Number.isFinite(song.duration) || !Number.isFinite(seconds)) return;
    song.currentTime = Math.max(0, Math.min(song.duration, seconds));
    setSongTime(song.currentTime);
  };
  const setSongVolume = (volume: number) => {
    if (!Number.isFinite(volume)) return;
    const next = Math.max(0, Math.min(1, volume));
    setSongVolumeState(next);
    if (songRef.current) songRef.current.volume = next;
  };

  return (
    <AudioContext.Provider
      value={{
        audioAllowed,
        setAudioAllowed,
        isAmbientPlaying,
        toggleAmbient,
        isSongPlaying,
        toggleSong,
        startExperience,
        audioError,
        songTime, songDuration, songVolume, seekSong, setSongVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
