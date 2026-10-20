import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { CONFIG } from '../config';
import { createAudioPlayback } from '../lib/audio-playback';

interface AudioContextType {
  audioAllowed: boolean | null;
  setAudioAllowed: (allowed: boolean) => void;
  isAmbientPlaying: boolean;
  toggleAmbient: () => void;
  isSongPlaying: boolean;
  toggleSong: () => void;
  toggleSound: () => void;
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
  const playbackRef = useRef<ReturnType<typeof createAudioPlayback> | null>(null);

  useEffect(() => {
    // Initialize audio elements
    ambientRef.current = new Audio(CONFIG.audio.ambient);
    ambientRef.current.preload = 'none';
    ambientRef.current.loop = true;
    ambientRef.current.volume = CONFIG.audio.ambientVolume;

    songRef.current = new Audio(CONFIG.audio.song);
    songRef.current.preload = 'metadata';
    songRef.current.loop = false;
    songRef.current.volume = CONFIG.audio.songVolume;
    songRef.current.ontimeupdate = () => setSongTime(songRef.current?.currentTime ?? 0);
    songRef.current.ondurationchange = () => {
      const duration = songRef.current?.duration ?? 0;
      setSongDuration(Number.isFinite(duration) ? duration : 0);
    };
    playbackRef.current = createAudioPlayback(ambientRef.current, songRef.current,
      (ambient, song) => { setIsAmbientPlaying(ambient); setIsSongPlaying(song); },
      () => setAudioError(CONFIG.labels.audioUnavailable));

    return () => {
      playbackRef.current?.dispose();
      playbackRef.current = null;
      if (songRef.current) { songRef.current.ontimeupdate = null; songRef.current.ondurationchange = null; }
    };
  }, []);

  const setAudioAllowed = (allowed: boolean) => {
    setAudioError(null);
    setAudioAllowedState(allowed);
    playbackRef.current?.setAllowed(allowed);
  };

  const startExperience = () => {
    playbackRef.current?.startExperience();
  };

  const toggleAmbient = () => {
    setAudioError(null);
    setAudioAllowedState(!isAmbientPlaying);
    playbackRef.current?.toggleAmbient();
  };

  const toggleSong = () => {
    setAudioError(null);
    setAudioAllowedState(true);
    playbackRef.current?.toggleSong();
  };

  const toggleSound = () => {
    setAudioError(null);
    setAudioAllowedState(!(isAmbientPlaying || isSongPlaying));
    playbackRef.current?.toggleSound();
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
        toggleSound,
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
