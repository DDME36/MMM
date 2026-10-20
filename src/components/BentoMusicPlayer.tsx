import type { CSSProperties } from 'react';
import { Music2, Pause, Play, RotateCcw, RotateCw, Volume1, Volume2 } from 'lucide-react';
import { CONFIG } from '../config';
import { useAudio } from '../context/AudioContext';

const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function BentoMusicPlayer() {
  const { isSongPlaying, toggleSong, songTime, songDuration, songVolume, seekSong, setSongVolume } = useAudio();
  return <div className={`bento-player ${isSongPlaying ? 'is-playing' : ''}`} style={{ '--player-tint': CONFIG.bento.playerTint, '--album-glow-time': `${CONFIG.motion.albumGlowMs}ms` } as CSSProperties}>
    <img className="player-backdrop" src={CONFIG.bento.album} alt="" aria-hidden="true" />
    <div className="player-content">
      <div className="player-eyebrow"><Music2 size={10} /><span>{CONFIG.bento.musicLabel}</span><span className="player-wave" aria-hidden="true"><i /><i /><i /></span></div>
      <div className="player-artwork-frame"><span className="player-artwork-glow" aria-hidden="true" /><img className="player-artwork" src={CONFIG.bento.album} alt={CONFIG.bento.songTitle} loading="lazy" /></div>
      <div className="player-metadata"><strong title={CONFIG.bento.songTitle}>{CONFIG.bento.songTitle}</strong><span>{CONFIG.bento.songSubtitle}</span></div>
      <div className="player-scrubber">
        <input type="range" min="0" max={songDuration || 1} step="0.1" value={Math.min(songTime, songDuration || 0)} disabled={!songDuration} onChange={event => seekSong(Number(event.target.value))} aria-label={CONFIG.labels.songPosition} aria-valuetext={`${timestamp(songTime)} / ${timestamp(songDuration)}`} style={{ '--range-fill': `${songDuration ? songTime / songDuration * 100 : 0}%` } as CSSProperties} />
        <div className="player-times" aria-hidden="true"><span>{timestamp(songTime)}</span><span>−{timestamp(Math.max(0, songDuration - songTime))}</span></div>
      </div>
      <div className="player-transport">
        <button type="button" onClick={() => seekSong(songTime - 10)} disabled={!songDuration} aria-label={CONFIG.labels.songBack}><RotateCcw size={17} /><small>10</small></button>
        <button type="button" className="player-toggle" onClick={toggleSong} aria-label={isSongPlaying ? CONFIG.labels.pauseSong : CONFIG.labels.playSong} aria-pressed={isSongPlaying}>{isSongPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
        <button type="button" onClick={() => seekSong(songTime + 10)} disabled={!songDuration} aria-label={CONFIG.labels.songForward}><RotateCw size={17} /><small>10</small></button>
      </div>
      <div className="player-volume"><Volume1 size={11} /><input type="range" min="0" max="1" step="0.01" value={songVolume} onChange={event => setSongVolume(Number(event.target.value))} aria-label={CONFIG.labels.songVolume} style={{ '--range-fill': `${songVolume * 100}%` } as CSSProperties} /><Volume2 size={12} /></div>
    </div>
  </div>;
}
